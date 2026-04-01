import bcrypt from "bcrypt";

export const hashPass = async (password: string) => {
    try {
        const hashPassword = await bcrypt.hash(password, 11);
        return hashPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
}