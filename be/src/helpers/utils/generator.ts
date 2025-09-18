const DIGITS = '0123456789'

export const generateCode = (length: number): string => {
    let code: string = ''
    for (let i = 0; i < length; i ++) {
        code += DIGITS[Math.floor(Math.random() * 10)]
    }

    return code
}