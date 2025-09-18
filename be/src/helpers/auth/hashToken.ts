import bcrypt from 'bcrypt';

const hashToken = async (plainText: string, saltRounds: number = CONFIG.bcrypt.saltRounds) => {
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(plainText, salt)
}

const compareToken = async (plainText: string, hashText: string) => {
    return await bcrypt.compare(plainText, hashText);
}

export const TokenHelper = {
    hashToken,
    compareToken
}