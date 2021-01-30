import Jwt from "jsonwebtoken";
import { AuthSchema, ResponseToken } from "../../graphql/schema";
import { Secret } from "../../types/secret";
import { CustomRequest } from "../../types";
import { HTTP404Error, HTTP500Error } from "../utils/httpError";
import { getSecretController } from "../../modules/secret/secret.controller";

export interface AuthLevel2Payload {
  id: string;
  token: string;
}

export interface AuthLevel1Payload {
  username: string;
  uid: string;
}

export interface RefreshPayload {
  username: string;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TokenManager {
  secret?: Secret;

  /**
   * @param secret
   * set the secret 
   */
  public setSecret = (secret: Secret) => {
    this.secret = secret;
    return this;
  }

  /**
   * 
   * @param token string
   * @param secret string
   * @returns payload T
   * @description A wrapper for decode the given token using given secret
   */
  private verifyToken = async <T>(token: string, secret: string): Promise<T> => {
    const decoded = await new Promise<T>((resolve, reject) => {
      Jwt.verify(token, secret, (error, payload) => {
        if (error) {
          return reject(error)
        }
        return resolve(payload! as any as T);
      })
    });
    return decoded;
  }

  /**
   * 
   * @param secret string
   * @param payload T
   * @param options Jwt.SignOptions
   * @returns token of type string
   * @description A wrapper for generating token with given payload and secret.
   */
  private generateToken = async <T = any>(secret: string, payload: T | any, options: Jwt.SignOptions = {}) => {
    const token = await new Promise<string>((resolve, reject) => {
      Jwt.sign(payload, secret, options, (error, token) => {
        if (error) {
          return reject(error)
        }
        return resolve(token!);
      });
    });
    return token;
  }

  /**
   * 
   * @param payload AuthLevel1Payload
   * @returns authToken string
   * @description generate auth level1 token with provided secret
   */
  private generateAuthLevel1Token = async (payload: AuthLevel1Payload): Promise<string> => {
    if (!this.secret) {
      throw new HTTP500Error("AuthLevel1Token secret not provided");
    }
    const { authSecret } = this.secret;
    const token = await this.generateToken(authSecret, payload, { expiresIn: "1h" });
    return token;
  }

  /**
   * 
   * @param payload AuthLevel2Payload
   * @returns authToken string
   * @description generate auth level2 token with provided payload.
   * Pick the secret from env variable
   */
  private generateAuthLevel2Token = async (payload: AuthLevel2Payload): Promise<string> => {
    const secret = process.env.AUTH_TOKEN_SECRET;
    if (!secret) {
      throw new HTTP500Error("auth secret not provided");
    }
    const token = await this.generateToken<AuthLevel2Payload>(secret, payload);;
    return token;
  }

  public generateAuthToken = async (payload: AuthLevel1Payload): Promise<string> => {
    if(!this.secret) {
      throw new HTTP500Error("secret not provided");
    }
    const {id} = this.secret;
    const level1 = await this.generateAuthLevel1Token(payload);
    const token = await this.generateAuthLevel2Token({id, token: level1});
    return token;
  }

  // refresh token generator function
  public generateRefreshToken = async (payload: RefreshPayload): Promise<string> => {
    const secret = process.env.AUTH_TOKEN_SECRET;
    if (!this.secret || !secret) {
      throw new HTTP500Error("refresh token secret not provided");
    }
    const { id, refreshSecret } = this.secret;
    const refreshToken = await this.generateToken(refreshSecret, payload, { expiresIn: "7d" });
    return refreshToken;
  }

  // generate auth and refresh token
  public generateTokens = async (auth: AuthSchema): Promise<ResponseToken> => {
    if (!auth) {
      throw new HTTP500Error('user information not provided');
    }
    let token: string;
    let refreshToken: string;
    const { uid, username, createdAt, updatedAt } = auth;
    token = await this.generateAuthToken({ uid: uid!, username: username! });
    refreshToken = await this.generateRefreshToken({ uid, username, createdAt, updatedAt });
    return new ResponseToken(token, refreshToken);
  }

  public decodeAuthLevel1Token = async (token: string) => {
    if (!this.secret) {
      throw new HTTP500Error("secret not provided");
    }
    const { authSecret } = this.secret;
    const payload = await this.verifyToken<AuthLevel1Payload>(token, authSecret);
    return payload;
  }

  public decodeAuthLevel2Token = async (token: string) => {
    const secret = process.env.AUTH_TOKEN_SECRET;
    if (!secret) {
      throw new HTTP500Error("secret not provided");
    }
    const payload = await this.verifyToken<AuthLevel2Payload>(token, secret);
    return payload;
  }

  public decodeAuthToken = async (token: string) => {
    const level2Pyload = await this.decodeAuthLevel2Token(token);
    const secret = await getSecretController().getSecretById(level2Pyload.id);
    this.setSecret(secret);
    const level1Pyload = await this.decodeAuthLevel1Token(level2Pyload.token);
    return level1Pyload;
  }

  public decodeRefreshToken = async (token: string) => {
    if (!this.secret) {
      throw new HTTP500Error("secret not provided");
    }
    const { refreshSecret } = this.secret;
    const payload = await this.verifyToken<RefreshPayload>(token, refreshSecret);
    return payload;
  }

  public refreshAuthToken = async (refreshToken: string): Promise<ResponseToken> => {
    const refreshPayload = await this.decodeRefreshToken(refreshToken);
    if (!refreshPayload) {
      throw new HTTP404Error();
    }
    const { uid, username } = refreshPayload;
    const token = await this.generateAuthToken({ uid, username });
    return new ResponseToken(token, refreshToken);
  }

  public getAuthToken = (req: CustomRequest): null | string => {
    const Authorization: string | undefined = req.get("Authorization");
    if (!Authorization) {
      return null;
    }
    const [_, token] = Authorization.split(" ");
    return token;
  }

  public getRefreshToken = (req: CustomRequest): null | string => {
    const token: string | undefined = req.get("x-refresh-token");
    if (!token) {
      return null;
    }
    return token;
  }

  public decodeAuthTokenLevel1 = (token: string): Promise<AuthLevel1Payload> => {
    const secret = process.env.AUTH_TOKEN_SECRET;
    const payload = this.verifyToken<AuthLevel1Payload>(token, secret!);
    return payload;
  }
}