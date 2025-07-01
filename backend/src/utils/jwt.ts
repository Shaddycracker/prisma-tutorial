import jwt from "jsonwebtoken"


export const signAccessToken = (payload: object) =>
    jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });

export const signRefreshToken = (payload: object) =>
    jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

export const verifyToken = (token: string, secret: string) =>
    jwt.verify(token, secret);
