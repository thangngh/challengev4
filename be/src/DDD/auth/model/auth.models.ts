
class AuthModel {
    constructor(
        public acceptCode: string,
        public userId: string,
        public expireAt?: number,
        public isUse?: boolean,
        public isFirstLogin?: boolean,
        public id?: string
    ) {}
}

export default AuthModel;