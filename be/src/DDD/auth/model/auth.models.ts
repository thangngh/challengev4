
export interface IAuthModel {
    acceptCode: string;
    userId: string;
    expireAt?: number;
    isUse?: boolean;
    id?: string;
}
class AuthModel implements IAuthModel {
    constructor(
        public acceptCode: string,
        public userId: string,
        public expireAt?: number,
        public isUse?: boolean,
        public id?: string
    ) {}
}

export default AuthModel;