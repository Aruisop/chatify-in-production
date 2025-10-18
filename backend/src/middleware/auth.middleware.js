import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
export const protectRoute = async (req,res,next)=>{
     try {
      const token = req.cookies.jwt;
      console.log("JWT from cookies:", req.cookies.jwt);
      if(!token) return res.status(401).json({message:"Unauthorized access"});

      const decoded = jwt.verify(token,ENV.JWT_SECRET);
      if(!decoded) return res.status(401).json({message:"Unauthorized access, invalid token"});

      const user = await User.findById(decoded.userId).select("-password");
      if(!user) return res.status(404).json({message:"Unauthorized access, user not found"});
      
      req.user = user;
      next();
     } catch (error) {
        // handle error here
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({message:"Internal Server Error"});
     }
 };