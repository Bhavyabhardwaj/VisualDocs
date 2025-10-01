import type { AuthResponse, CreateUserRequest, LoginRequest, UpdateUserRequest, UserProfile } from "../types";
import { BcryptUtils, generateTokenPair, verifyRefreshToken, logger } from "../utils";
import prisma from "../config/db";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../errors";

export class AuthService {
    async register(userData: CreateUserRequest): Promise<AuthResponse> {
        try {
            logger.info("user Registering attempt", { userData });
            // check if already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email }
            })
            if (existingUser) {
                throw new ConflictError("User with this email already exists");
            }
            const hashedPassword = await BcryptUtils.hashPassword(userData.password);

            const newUser = await prisma.user.create({
                data: {
                    email: userData.email,
                    name: userData.name,
                    password: hashedPassword,
                    role: 'USER',
                    isActive: true,
                    emailVerified: false,
                },
                select: {
                    id: true, email: true, name: true, avatar: true,
                    role: true, isActive: true, emailVerified: true,
                    createdAt: true, updatedAt: true,
                }
            });
            // token generation
            const tokens = generateTokenPair({
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            });
            logger.info("User registered successfully", { userId: newUser.id, email: newUser.email });
            return {
                user: {
                    ...newUser,
                    avatar: newUser.avatar || ''
                },
                token: tokens
            };
        } catch (error) {
            if (error instanceof ConflictError) {
                throw error;
            }

            logger.error('Registration failed', {
                email: userData.email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw new BadRequestError('Registration failed');
        }
    }

    // login
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            logger.info("User login attempt", { email: credentials.email });
            const user = await prisma.user.findUnique({
                where: { email: credentials.email },
                select: {
                    id: true, email: true, name: true, avatar: true,
                    role: true, isActive: true, emailVerified: true,
                    password: true,
                    createdAt: true, updatedAt: true,
                }
            });
            if (!user) {
                throw new BadRequestError("Invalid email or password");
            }
            if (!user.isActive) {
                throw new UnauthorizedError('Account is deactivated. Please contact support.');
            }
            if (!user.password) {
                throw new UnauthorizedError('Invalid credentials - OAuth account');
            }

            const isPasswordValid = await BcryptUtils.verifyPassword(credentials.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedError("Invalid email or password");
            }
            // Update last login
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    lastLoginAt: new Date(),
                    updatedAt: new Date()
                }
            });
            const { password, ...userProfile } = user;

            const tokens = generateTokenPair({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            });
            logger.info("User logged in successfully", { userId: user.id, email: user.email });
            return {
                user: {
                    ...userProfile,
                    avatar: user.avatar || ''
                },
                token: tokens
            };
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                throw error;
            }
            logger.error('Login failed', {
                email: credentials.email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw new UnauthorizedError('Login failed');

        }
    }
    // change password
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        try {
            logger.info("Password change attempt", { userId });
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new NotFoundError("User not found");
            }
            // check if password is right
            if (!user.password) {
                throw new UnauthorizedError('Cannot change password for OAuth account');
            }

            const isPasswordValid = await BcryptUtils.verifyPassword(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedError("Current password is incorrect");
            }
            const hashedNewPassword = await BcryptUtils.hashPassword(newPassword);

            // update password
            await prisma.user.update({
                where: { id: userId },
                data: {
                    password: hashedNewPassword,
                    updatedAt: new Date()
                }
            });
            logger.info("Password changed successfully", { userId });
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
                throw error;
            }
            logger.error('Password change failed', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw new BadRequestError('Password change failed');
        }
    }

    // get user profile
    async getUserProfile(userId: string): Promise<UserProfile> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true, email: true, name: true, avatar: true,
                    role: true, isActive: true, emailVerified: true,
                    createdAt: true, updatedAt: true, lastLoginAt: true
                }
            })

            if (!user) {
                throw new NotFoundError("User not found");
            }
            if (!user.isActive) {
                throw new UnauthorizedError('Account is deactivated. Please contact support.');
            }
            return {
                ...user,
                avatar: user.avatar || ''
            };
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
                throw error;
            }

            logger.error('Get user profile failed', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw new BadRequestError('Failed to get user profile');
        }
    }

    // update user profile
    async updateUserProfile(userId: string, updates: UpdateUserRequest): Promise<UserProfile> {
        try {
            logger.info("User profile update attempt", { userId, updates });
            
            // Use a transaction with retry logic for better connection handling
            const result = await prisma.$transaction(async (tx) => {
                const existingUser = await tx.user.findUnique({
                    where: { id: userId }
                });
                
                if (!existingUser) {
                    throw new NotFoundError("User not found");
                }
                
                if (!existingUser.isActive) {
                    throw new UnauthorizedError('Account is deactivated');
                }
                
                const updatedUser = await tx.user.update({
                    where: { id: userId },
                    data: {
                        ...updates,
                        updatedAt: new Date()
                    },
                    select: {
                        id: true, email: true, name: true, avatar: true,
                        role: true, isActive: true, emailVerified: true,
                        createdAt: true, updatedAt: true, lastLoginAt: true
                    }
                });
                
                return updatedUser;
            }, {
                maxWait: 10000, // 10 seconds max wait for transaction to start
                timeout: 20000, // 20 seconds timeout for transaction
            });
            
            logger.info("User profile updated successfully", { userId, updates });
            return {
                ...result,
                avatar: result.avatar || ''
            };
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
                throw error;
            }
            logger.error('Profile update failed', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new BadRequestError('Profile update failed');
        }
    }

    // get user statictics
    async getUserStats(userId: string): Promise<{
    projectCount: number;
    diagramCount: number;
    analysisCount: number;
    lastActivity: Date | null;
  }> {
    try {
      const [projectCount, diagramCount, analysisCount, user] = await Promise.all([
        prisma.project.count({
          where: { 
            userId, 
            status: { not: 'DELETED' } 
          }
        }),
        prisma.diagram.count({
          where: { 
            project: { userId },
            status: 'COMPLETED'
          }
        }),
        prisma.analysis.count({
          where: { 
            project: { userId }
          }
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { lastLoginAt: true }
        })
      ]);

      return {
        projectCount,
        diagramCount,
        analysisCount,
        lastActivity: user?.lastLoginAt || null,
      };

    } catch (error) {
      logger.error('Get user stats failed', { 
        userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      throw new BadRequestError('Failed to get user statistics');
    }
  }
  // dectivate account
  async deactivateAccount(userId: string): Promise<void> {
    try {
      logger.info('Account deactivation attempt', { userId });

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Deactivate user
      await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          updatedAt: new Date(),
        }
      });

      logger.info('Account deactivated successfully', { userId });

    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      logger.error('Account deactivation failed', { 
        userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      throw new BadRequestError('Account deactivation failed');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      logger.info('Refresh token attempt');
      
      // Verify the refresh token
      const payload = verifyRefreshToken(refreshToken);
      
      if (!payload || !payload.userId) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Check if user still exists and is active
      const user = await prisma.user.findUnique({
        where: { 
          id: payload.userId,
          isActive: true // Ensure user is still active
        },
        select: {
          id: true, 
          email: true, 
          name: true, 
          avatar: true,
          role: true, 
          isActive: true, 
          emailVerified: true,
          createdAt: true, 
          updatedAt: true,
        }
      });

      if (!user) {
        throw new UnauthorizedError('User not found or inactive');
      }

      // Generate new token pair
      const tokens = generateTokenPair({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });

      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          lastLoginAt: new Date()
        }
      });

      logger.info('Tokens refreshed successfully', { userId: user.id });

      return {
        user: {
          ...user,
          avatar: user.avatar || ''
        },
        token: tokens
      };

    } catch (error) {
      logger.error('Token refresh failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof UnauthorizedError) {
        throw error;
      }

      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    try {
      logger.info(`User logging out: ${userId}`);

      // Update user's last activity in database
      await prisma.user.update({
        where: { id: userId },
        data: { 
          lastLoginAt: new Date() // Update last activity
        }
      });

      logger.info(`User logged out successfully: ${userId}`);

    } catch (error) {
      logger.error('Logout failed', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new BadRequestError('Logout failed');
    }
  }

  // Get user by ID for passport deserialization
  async getUserById(id: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isActive: true,
          emailVerified: true,
          provider: true,
          providerId: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return {
        ...user,
        avatar: user.avatar || ''
      };
    } catch (error) {
      logger.error('Error getting user by ID:', { id, error });
      throw error;
    }
  }

  // Find or create OAuth user
  async findOrCreateOAuthUser(oauthData: {
    provider: 'GOOGLE' | 'GITHUB';
    providerId: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<any> {
    try {
      logger.info('Finding or creating OAuth user:', {
        provider: oauthData.provider,
        providerId: oauthData.providerId,
        email: oauthData.email
      });

      // First, try to find existing user by provider ID
      let user = await prisma.user.findFirst({
        where: {
          provider: oauthData.provider,
          providerId: oauthData.providerId
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isActive: true,
          emailVerified: true,
          provider: true,
          providerId: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (user) {
        // Update last login time and avatar if needed
        const updateData: any = { lastLoginAt: new Date() };
        if (!user.avatar && oauthData.avatar) {
          updateData.avatar = oauthData.avatar;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });

        logger.info('Found existing OAuth user:', { userId: user.id });
        return {
          ...user,
          avatar: user.avatar || oauthData.avatar || ''
        };
      }

      // Check if user exists with same email (for linking accounts)
      const existingEmailUser = await prisma.user.findUnique({
        where: { email: oauthData.email }
      });

      if (existingEmailUser) {
        // Link OAuth account to existing email account
        user = await prisma.user.update({
          where: { id: existingEmailUser.id },
          data: {
            provider: oauthData.provider,
            providerId: oauthData.providerId,
            avatar: oauthData.avatar || existingEmailUser.avatar,
            emailVerified: true, // OAuth emails are verified
            lastLoginAt: new Date()
          },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
            isActive: true,
            emailVerified: true,
            provider: true,
            providerId: true,
            createdAt: true,
            updatedAt: true,
          }
        });

        logger.info('Linked OAuth account to existing user:', { userId: user.id, wasExisting: true });
        return {
          ...user,
          avatar: user.avatar || ''
        };
      }

      // Create new OAuth user
      user = await prisma.user.create({
        data: {
          email: oauthData.email,
          name: oauthData.name,
          provider: oauthData.provider,
          providerId: oauthData.providerId,
          password: this.generateRandomPassword(), // OAuth users get random password
          avatar: oauthData.avatar || null,
          role: 'USER',
          isActive: true,
          emailVerified: true, // OAuth emails are verified
          lastLoginAt: new Date()
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isActive: true,
          emailVerified: true,
          provider: true,
          providerId: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      logger.info('Created new OAuth user:', { 
        userId: user.id, 
        provider: oauthData.provider,
        isNewUser: true 
      });
      return {
        ...user,
        avatar: user.avatar || ''
      };

    } catch (error) {
      logger.error('Error in findOrCreateOAuthUser:', {
        provider: oauthData.provider,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof ConflictError || error instanceof NotFoundError) {
        throw error;
      }

      throw new BadRequestError('Failed to process OAuth authentication');
    }
  }

  // Handle OAuth login (similar to the provided OAuthService)
  async handleOAuthLogin(profile: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: 'GOOGLE' | 'GITHUB';
  }): Promise<{
    user: any;
    tokens: any;
    provider: string;
    isNewUser: boolean;
  }> {
    try {
      logger.info('OAuth login attempt', { 
        provider: profile.provider, 
        email: profile.email 
      });

      // Check if this is a new user by looking for existing email
      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email }
      });
      const isNewUser = !existingUser;

      // Use existing OAuth user creation logic
      const oauthUserData: {
        provider: 'GOOGLE' | 'GITHUB';
        providerId: string;
        email: string;
        name: string;
        avatar?: string;
      } = {
        provider: profile.provider,
        providerId: profile.id,
        email: profile.email,
        name: profile.name
      };

      if (profile.avatar) {
        oauthUserData.avatar = profile.avatar;
      }

      const user = await this.findOrCreateOAuthUser(oauthUserData);

      // Generate token pair
      const tokens = generateTokenPair({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });

      logger.info('OAuth login successful', { 
        provider: profile.provider,
        userId: user.id,
        email: user.email,
        isNewUser
      });

      return {
        user,
        tokens,
        provider: profile.provider,
        isNewUser
      };

    } catch (error) {
      logger.error('OAuth login failed', { 
        provider: profile.provider,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Generate random password for OAuth users
  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Link OAuth account to existing user
  async linkOAuthAccount(userId: string, oauthData: {
    provider: 'GOOGLE' | 'GITHUB';
    providerId: string;
    avatar?: string;
  }): Promise<UserProfile> {
    try {
      logger.info('Linking OAuth account', { userId, provider: oauthData.provider });

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if this OAuth account is already linked to another user
      const existingOAuthUser = await prisma.user.findFirst({
        where: {
          provider: oauthData.provider,
          providerId: oauthData.providerId,
          id: { not: userId }
        }
      });

      if (existingOAuthUser) {
        throw new ConflictError('This OAuth account is already linked to another user');
      }

      // Link the OAuth account
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          provider: oauthData.provider,
          providerId: oauthData.providerId,
          avatar: oauthData.avatar || user.avatar,
          emailVerified: true,
          updatedAt: new Date()
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true
        }
      });

      logger.info('OAuth account linked successfully', { userId, provider: oauthData.provider });

      return {
        ...updatedUser,
        avatar: updatedUser.avatar || ''
      };

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }

      logger.error('OAuth account linking failed', {
        userId,
        provider: oauthData.provider,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new BadRequestError('Failed to link OAuth account');
    }
  }

  // Unlink OAuth account
  async unlinkOAuthAccount(userId: string): Promise<UserProfile> {
    try {
      logger.info('Unlinking OAuth account', { userId });

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (!user.provider) {
        throw new BadRequestError('No OAuth account to unlink');
      }

      // Ensure user has a password before unlinking OAuth
      if (!user.password) {
        throw new BadRequestError('Cannot unlink OAuth account - please set a password first');
      }

      // Unlink the OAuth account
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          provider: null,
          providerId: null,
          updatedAt: new Date()
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true
        }
      });

      logger.info('OAuth account unlinked successfully', { userId });

      return {
        ...updatedUser,
        avatar: updatedUser.avatar || ''
      };

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }

      logger.error('OAuth account unlinking failed', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new BadRequestError('Failed to unlink OAuth account');
    }
  }
}

