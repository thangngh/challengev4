import { ERole } from "../types";

export interface IUserModel {
    name: string;
    phoneNumber: string;
    email: string;
    role: ERole;
    address: string;
    username?: string;
    password?: string;
    isFirstLogin?: boolean;
    verifyCodeFirstLogin?: string;
    isDeleted?: boolean;   
    isLogin?: boolean 
    id?: string;
}

class UserModel implements IUserModel {
    constructor(
        public name: string,
        public phoneNumber: string,
        public email: string,
        public role: ERole,
        public address: string,
        public username?: string,
        public password?: string,
        public isFirstLogin?: boolean,
        public verifyCodeFirstLogin?: string,
        public isDeleted?: boolean,
        public isLogin?: boolean,
        public id?: string,
    ) {}
}

export default UserModel;