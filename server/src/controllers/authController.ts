import type { NextFunction, Request, Response } from "express";
import type { CreateUserRequest, LoginRequest } from "../types";
import { authService } from "../services";
import { successResponse } from "../utils";

export class AuthController {

    // register new user
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: CreateUserRequest = req.body;

            const result = await authService.register(userData);
            return successResponse(
                res,
                result,
                'User registered successfully',
                201,
            );
        } catch (error) {
            next(error);
        }
    }

    // login user 
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const credentials: LoginRequest = req.body;
            const result = await authService.login(credentials);
            return successResponse(
                res,
                result,
                'Login successfull',
                200,
            );
        } catch (error) {
            next(error);
        }
    }

    // get user profile
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;        // from auth middleware
            const user = await authService.getUserProfile(userId!);
            return successResponse(
                res,
                { user },
                'Profile fetched successfully',
            );
        } catch (error) {
            next(error);
        }
    }

    // update profile 
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;        // from auth middleware
            const updates = req.body;
            const updatedUser = await authService.updateUserProfile(userId!, updates);
            return successResponse(
                res,
                { user: updatedUser },
                'Profile updated successfully',
            );
        } catch (error) {
            next(error);
        }
    }

    // change password
    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;        // from auth middleware
            const { currentPassword, newPassword } = req.body;
            const result = await authService.changePassword(userId!, currentPassword, newPassword);
            return successResponse(
                res,
                null,
                'Password changed successfully',
            );
        } catch (error) {
            next(error);
        }
    }

    // get user stats
    async getUserStats(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;        // from auth middleware 
            const stats = await authService.getUserStats(userId!);
            return successResponse(
                res,
                stats,
                'User stats fetched successfully',
            );
        } catch (error) {
            next(error);
        }
    }

    // deactivate account
    async deactivateAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;        // from auth middleware
            await authService.deactivateAccount(userId!);
            return successResponse(
                res,
                null,
                'Account deactivated successfully',
            );
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            const result = await authService.refreshToken(refreshToken);

            return successResponse(
                res,
                result,
                'Token refreshed successfully'
            );
        } catch (error) {
            next(error);
        }
    }

    // logout user
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;        // from auth middleware
            const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

            // Call the logout service method
            await authService.logout(userId!, refreshToken);

            // Clear refresh token cookie if it exists
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return successResponse(
                res,
                null,
                'Logged out successfully'
            );

        } catch (error) {
            next(error);
        }
    }

    // Link OAuth account to existing user
    async linkOAuthAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const { provider, providerId, avatar } = req.body;

            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            if (!provider || !providerId) {
                return res.status(400).json({ error: 'Provider and providerId are required' });
            }

            const updatedUser = await authService.linkOAuthAccount(userId, {
                provider,
                providerId,
                avatar
            });

            return successResponse(
                res,
                { user: updatedUser },
                'OAuth account linked successfully'
            );

        } catch (error) {
            next(error);
        }
    }

    // Unlink OAuth account
    async unlinkOAuthAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const updatedUser = await authService.unlinkOAuthAccount(userId);

            return successResponse(
                res,
                { user: updatedUser },
                'OAuth account unlinked successfully'
            );

        } catch (error) {
            next(error);
        }
    }
}