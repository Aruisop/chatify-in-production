import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
export const generateToken = (userId,res) =>{
    //token 
    //stopped here at 1:09:35
    //make sure to cd backend from terminal via ctrl+j
    //npm run dev
    const { JWT_SECRET } = ENV;
    if(!JWT_SECRET) throw new Error("JWT_SECRET is not configured");

    const token = jwt.sign({userId}, JWT_SECRET,{
        expiresIn:"7d",
    });
  res.cookie("jwt",token,{
    maxAge: 7*24*60*60*1000,
    httpOnly: true, //prevent cross site scripting
    sameSite: "strict",
    secure: ENV.NODE_ENV === "development"?false: true, //only send cookie over https
  });
  return token;
};