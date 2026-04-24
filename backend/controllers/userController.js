import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/User.js'
import jwt from 'jsonwebtoken'

import axios from 'axios'

//API to register user
const registerUser = async (req,res) => {
  try {
    const {name,email, password} = req.body 
    if(!name || !email ||!password){
      return res.json({success:false,message: "Missing Details"})
    }

    //Validating email format
    if(!validator.isEmail(email)){
      return res.json({success:false,message: "Invalid Email"})
    }
  
    //Validating strong password
    if(password.length < 8){
      return res.json({success:false,message: "Password should be at least 8 characters"})
    }
   
    //Hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }
  
    const newUser = new userModel(userData)
    await newUser.save()
   
    const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET)
    res.json({success:true, token}) 
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.json({ success: false, message: error.message });
    
  }
}
 

//APi for user Login 
const loginUser = async (req,res) => {
  try {
    const {email,password} = req.body
    const user = await userModel.findOne({email})
    if(!user){
      return res.json({success:false,message:'user does not exist'})
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if(isMatch){
      const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
      res.json({success:true,token})
    } else {
      res.json({success:false,message:'Invalid Password'})
    }
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}


export {registerUser,loginUser}