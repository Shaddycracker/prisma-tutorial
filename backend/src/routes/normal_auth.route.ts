import { Router } from "express";
import LoginController from "../controllers/login.controller"
import SignupController from "../controllers/signup.controller";

const route = Router();

route.post('/login', LoginController)
route.post('/register',SignupController)

export default route;