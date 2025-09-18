import { NextFunction, Request, Response } from "express";
import JWT, { SignOptions } from "jsonwebtoken";

class JwtStrategy {
  private static instance: JwtStrategy;
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private accessTokenExpireTime: string;
  private refreshTokenExpireTime: string;
  private tokenIssuer: string;

  private constructor() {
    this.accessTokenSecret = CONFIG.jwt.accessTokenSecret;
    this.refreshTokenSecret = CONFIG.jwt.refreshTokenSecret;
    this.accessTokenExpireTime = CONFIG.jwt.accessTokenExpireTime;
    this.refreshTokenExpireTime = CONFIG.jwt.refreshTokenExpireTime;
    this.tokenIssuer = CONFIG.jwt.tokenIssuer;
  }

  public static getInstance(): JwtStrategy {
    if (!JwtStrategy.instance) {
      JwtStrategy.instance = new JwtStrategy();
    }
    return JwtStrategy.instance;
  }

  public async signAccessToken(userId: string): Promise<string> {
    try {
      const payload = {
        userId
      };

      const options: SignOptions = {
        expiresIn: this.accessTokenExpireTime as any,
        issuer: this.tokenIssuer,
      };

      const accessToken = JWT.sign(
        payload,
        this.accessTokenSecret,
        options,
      )

      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  public async signToken(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = { userId };

      const accessTokenOptions: SignOptions = {
        expiresIn: this.accessTokenExpireTime as any,
        issuer: this.tokenIssuer
      }
      const refreshTokenOption: SignOptions = {
        expiresIn: this.refreshTokenExpireTime as any,
        issuer: this.tokenIssuer
      }
      const [accessToken, refreshToken] = await Promise.all([
        JWT.sign(payload, this.accessTokenSecret, accessTokenOptions),
        JWT.sign(payload, this.refreshTokenSecret, refreshTokenOption)
      ])

      return { accessToken, refreshToken }
    } catch (error) {
      throw error;
    }
  }

  public async verifyAccessToken(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      return res.status(401)
        .json({
          code: 'UNAUTHORIZED',
          message: 'No authorization header provided'
        })
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    try {
      const valid = JWT.verify(token, this.accessTokenSecret)

      req.user = valid;
      next()
    } catch (error) {
      throw error
    }
  }

  public async verifyRefreshToken(req: Request, res: Response, next: NextFunction) { }
}

export default JwtStrategy.getInstance();
