import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req,res) =>{
   const {fullName, email, password} = req.body;
   try{
    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters"});
    }
    //check if email valid via regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message: "Invalid email format"});
    }

    const user = await User.findOne({email});
    if(user) return res.status(400).json({message: "Email already exists"});

    //password hashing
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);

    //create a new user
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    });

    if(newUser){
      // before CR
      // generateToken(newUser._id,res);
      // await newUser.save();

      //after CR
      //persist user first, then issue the auth cookie
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
      //send welcome email
      try{
       await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
      }catch(err){
        console.error("Failed to send welcome email:",err);
      }
    }else{
        res.status(400).json({message: "Invalid user data"});
    }
   
  }catch(error){
   console.log("Error in signup controller:",error);
   res.status(500).json({message: "Internal Server error"});   
   }  
};

export const login = async (req,res)=>{
   const {email, password} = req.body;
   if(!email || !password){
    return res.status(400).json({message:"All fields are required"});
   }
   try{
    const user = await User.findOne({email});
    //never tell which one is incorrect
    if(!user) return res.status(400).json({message:"Invalid Credentials"});

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials"});

    generateToken(user._id,res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  }catch(error){
  console.error("Error in login controller:",error);
  res.status(500).json({message:"Internal Server Error"});
  }
};

export const logout = (_,res)=>{
  res.cookie("jwt","",{maxAge:0});
  res.status(200).json({message:"Logged out successfully"});
};

export const updateProfile = async(req,res) =>{
  try{
   const { profilePic } = req.body;
   if(!profilePic) return res.status(400).json({message: "Profile picture is required"});
   //middleware will run before this and set the req.user, who is authenticated
   const userId=req.user._id;
   const uploadResponse = await cloudinary.uploader.upload(profilePic);
   const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
   res.status(200).json(updatedUser);
   }catch(error){
    console.log("Error in updateProfile controller:",error);
    res.status(500).json({message:"Internal Server Error"});
   } 
};