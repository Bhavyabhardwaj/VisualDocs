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
            const existingUser = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!existingUser) {
                throw new NotFoundError("User not found");
            }
            if (!existingUser.isActive) {
                throw new UnauthorizedError('Account is deactivated');
            }
            const updatedUser = await prisma.user.update({
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
            logger.info("User profile updated successfully", { userId, updates });
            return {
                ...updatedUser,
                avatar: updatedUser.avatar || ''
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
}

