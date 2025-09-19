import { ERole } from "../types";

export interface IUserModel {
    name: string;
    phoneNumber: string;
    email?: string;
    role: ERole;
    address?: string;
    username?: string;
    password?: string;
    isFirstLogin?: boolean;
    verifyCodeFirstLogin?: string;
    isDeleted?: boolean;   
    isLogin?: boolean 
    refreshToken?: string;
    id?: string;
}

class UserModel implements IUserModel {
    constructor(
        public name: string,
        public phoneNumber: string,
        public role: ERole,
        public address?: string,
        public email?: string,
        public username?: string,
        public password?: string,
        public isFirstLogin?: boolean,
        public verifyCodeFirstLogin?: string,
        public isDeleted?: boolean,
        public isLogin?: boolean,
        public refreshToken?: string,
        public id?: string,
    ) {}
}

export default UserModel;