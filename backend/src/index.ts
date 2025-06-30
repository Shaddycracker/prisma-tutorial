import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"

export const prisma = new PrismaClient()
const app = express()
const port = 8080

app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ "name": "shadab ali" })
})

app.get('/user', (req: Request, res: Response) => {
    res.status(200).json({
        id: 23,
        name: "Dummy",
        email: "dummy@example.com",
        google_id: null,
        created_At: new Date(),
        updated_At: null
    });
});


app.get('/api/create-user', async (req: Request, res: Response) => {

    try {


        const user = await prisma.user.create({
            data: {
                name: "Shadab Ali",
                email: "shadab@gmail.com",
            }
        });
        res.status(200).json({
            success: true,
            user: user
        })
    } catch (err) {
        console.log("error Message", err)
        res.status(401).json({
            success: false,
            user: null
        })
    }
})

app.listen(port, () => {
    console.log(`App Running on ${port}`)
})