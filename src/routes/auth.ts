import express from "express";
import authController from "../controllers/auth.ctrl";
import zodSchemaInjector from "../middleware/zodSchemaInjector";
import { authSchema } from "../validationSchemas/authSchema";



const router = express.Router();

// signup - create user
router.post("/signup", zodSchemaInjector(authSchema.signup),authController.signup)

// login
router.post("/login", zodSchemaInjector(authSchema.login), authController.login)

// // google auth
// router.post("/google", validator(authSchema.googleSignUp),authController.googleSignUp)


export const authRouter = router
