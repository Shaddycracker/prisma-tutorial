import { Request, Response } from "express";
import { SignUpSchema } from "../validations/zod";
import { ZodError } from "zod";
import { prisma } from "..";
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from "../utils/jwt";

const SignupController = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = SignUpSchema.parse(req.body);

        const userInfo = await prisma.user.findUnique({
            where: { email }
        })
        if (userInfo) {

            res.status(401).json({
                success: false,
                message: "User Already Exist With Email"
            })
            return;
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
            }
        });
        const payload = { id: newUser.id, email: newUser.email };
        const token = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV==='production'? 'none':'lax',
            maxAge: 15 * 60 * 1000 // 15 min
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });




    }
    catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: err.errors,
            });
            return
        }
        console.log('Controller Login.ts ', err)
        res.status(404).json({

            success: false,
            message: "Internal error or server Error"

        })

    }



}
export default SignupController;