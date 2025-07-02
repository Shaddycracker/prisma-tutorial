import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"
import { config } from "dotenv";

export const prisma = new PrismaClient()
config()
const app = express()
app.use(express.json())
const port = process.env.PORT || 8080

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ "name": "shadab ali" })
})
import Auth from "./routes/normal_auth.route"

app.use('/user', Auth)


app.listen(port, () => {
    console.log(`App Running on ${port}`)
})