import { Request, Response } from "express"
import { prisma } from "..";
import bcrypt from "bcrypt"
import { signAccessToken, signRefreshToken } from "../utils/jwt"
import { LoginSchema } from "../validations/zod";
import { ZodError } from "zod";

const loginController = async (req: Request, res: Response) => {



    try {
        const { email, password } = LoginSchema.parse(req.body);

        const userInfo = await prisma.user.findUnique({
            where: { email }
        })
        if (!userInfo) {

            res.status(401).json({
                success: false,
                message: "No User of This Email"
            })
            return;
        }

        if (!userInfo.password) {
            res.status(401).json({
                success: false,
                message: "This user does not have a password set"
            });
            return
        }
        const verify = await bcrypt.compare(password, userInfo.password)
        if (!verify) {
            res.status(401).json({
                success: false,
                message: "Password Not Matched"
            })
            return;
        }
        const payload = { id: userInfo.id, email: userInfo.email };
        const token = signAccessToken(payload)
        const refreshToken = signRefreshToken(payload)

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: userInfo.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        })


        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000 // 15 min
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            userInfo:userInfo
        });


    }
    catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: err.errors, // Zod gives you nice details
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
export default loginController