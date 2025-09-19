interface IRegisterPhone {
    phoneNumber: string;
}

interface IVerifyEmail {
    email: string;
    accessCode: string;
}

interface IEmployeeLogin {
    username: string;
    password: string
}

export {
    IRegisterPhone,
    IVerifyEmail,
    IEmployeeLogin
}