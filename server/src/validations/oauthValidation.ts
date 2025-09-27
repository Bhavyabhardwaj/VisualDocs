import { z } from 'zod';

export const linkOAuthAccountSchema = z.object({
  body: z.object({
    provider: z.enum(['GOOGLE', 'GITHUB'], {
      message: 'Provider must be GOOGLE or GITHUB'
    }),
    providerId: z.string({
      message: 'Provider ID is required'
    }).min(1, 'Provider ID cannot be empty'),
    avatar: z.string().url('Avatar must be a valid URL').optional()
  })
});

export const unlinkOAuthAccountSchema = z.object({
  // No body validation needed for unlink
});

export type LinkOAuthAccountRequest = z.infer<typeof linkOAuthAccountSchema>['body'];
export type UnlinkOAuthAccountRequest = z.infer<typeof unlinkOAuthAccountSchema>;