import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

export const BcryptUtils = {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
        return bcrypt.hash(password, salt);
    },

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    },
    getSaltRounds(): number {
        return BCRYPT_SALT_ROUNDS;
    }
}