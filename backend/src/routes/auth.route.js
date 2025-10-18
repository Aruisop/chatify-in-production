import express from "express";
import {signup, login, logout, updateProfile} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router = express.Router();

//apply arcjet protection middleware to all auth routes
//for api testing, what we need to ensure is that the user is logged,in
//just comment out the use of arcjetprotectn middleware, for postman testing
//in order to access contacts, login first and then go to the messages/contacts router
//dont logout and not have any webtoken

router.use(arcjetProtection);

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute,(req,res)=>res.status(200).json(req.user));

export default router;

