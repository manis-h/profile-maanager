import userModel from "../model/user.model.js"
import bcrypt from  'bcrypt'
import  jwt  from "jsonwebtoken";
import ENV from '../router/connfig.js'
import { response } from "express";
import otpGenerator from "otp-generator";
export async function verifyUser(req,res,next){
    // res.json('updateUser Route')
    try {
     const {username} =req.method =="GET"? req.query :req.body;   
     let exist = await userModel.findOne({username})
     if(!exist) return res.status(404).send({error:"can't find user"});
     next();
    } catch (error) {
        return res.status(404).send({error:"Authenticcation Error"})
    }
}
export async function register(req,res){
    // res.json('Register Route')
    try {
        const {username, password, profile, email} =req.body;
        // .check existing username
        const existUsername = new Promise((resolve, reject) => {
            userModel.findOne({username},function(err,user){
                if(err) reject(new Error(err))
                if(user) reject({error:"Please use unique username"});
                resolve();
            })
        })
        // check existing mail
        const existEmail = new Promise((resolve, reject) => {
            userModel.findOne({username},function(err,user){
                if(err) reject(new Error(err))
                if(user) reject({error:"Please use unique Email"});
                resolve();
            })
        })
        Promise.all([existUsername,existEmail])
        .then(()=>{
            if(password){
              bcrypt.hash(password,10)
              .then( hashedPassword=>{
                const user = new userModel({
                    username,
                    password: hashedPassword,
                    profile:profile||"",
                    email
                })
                    user.save()
                    .then(result=>res.status(201).send({msg:"User Registered Successfully"}))
                    .catch(error=>res.status(500).send({error}))
              }).catch(error=>{
                return res.status(500).send({
                    error:"Unable to hash password"
                })    
              })  
            }

        }).catch(error=>{
            return res.status(500).send({error})
        })
    } catch (error) {
        return res.status(500).send(error)
    }
}
export async function login(req,res){
    // res.json('login Route')
    const {username,password} =req.body;
    try {
        userModel.findOne({username})
        .then(user=>{
            bcrypt.compare(password,user.password)
            .then(passwordCheck =>{
                if(!passwordCheck)return res.status(400).send({error:"Dont have Password"})

                    // jsonwebtoken
                   const token = jwt.sign({
                        userId: user._id,
                        username: user.username
                    },ENV.JWT_SECRET,{expiresIn:"24h"})

                    return res.status(200).send({
                        msg:"Login Successful",
                        user:user.username,
                        token
                    })

            })
            .catch(error=>{
                return res.status(400).send({error:"Password Does not match"})
            })
        })
        .catch( error=>{
            return res.status(404).send({error:"user not found"})
        })
    } catch (error) {
        return res.status(500).send(error)
    }
}

export async function getUser(req,res){
    // res.json('User Route')
    const {username} =req.params;
    try {
        if(!username) return res.status(501).send({error:"Invalid username"})
        userModel.findOne({username},function(err,user){
            if(err)return res.status(500).send({err});
            if(!user)return res.status(501).send({error:"couldn't find user data"})
            const {password, ...rest} =Object.assign({},user.toJSON());
            return res.status(201).send(rest)
        })
    } catch (error) {
       return res.status(404).send({error:"Cant find user data"}) 
    }
}
export async function updateUser(req,res){
    // res.json('updateUser Route')
    // const id =req.query.id;
    const {userId} = req.user;
    if(userId){
const body= req.body


userModel.updateOne({_id :userId},body,function(err,data){
    if(err) throw err;
    return res.status(201).send({msg:"Record Updated"})
})
    }
    else{
        return res.status(401).send({error:"user not found"});
    }
}
export async function generateOTP(req,res){
    // res.json('generateOTP Route')
  req.app.locals.OTP = await  otpGenerator.generate(6,{lowerCaseAlphabets:false ,upperCaseAlphabets:false ,specialChars:false});
  res.status(201).send({code:req.app.locals.OTP})

}
export async function verifyOTP(req,res){
    // res.json('verifyOTP Route')
    const { code } =req.query
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP =null
        // Start the session of reset password
        req.app.locals.resetSession =true 
        return res.status(201).send({msg:"Verified successfully"})
    }
    
    return res.status(400).send({msg:"INVALID OTP"})
}
export async function resetPassword(req,res){
    // res.json('resetPassword Route')
    try {
        if(!req.app.locals.resetSession)     return res.status(440).send({error:"Session expired"})

        const {username,password} =req.body
        try {
            userModel.findOne({username})
            .then(user =>{
                bcrypt.hash(password, 10)
                .then(hashedPassword=>{
                    userModel.updateOne({username: user.username},{password:hashedPassword},function(err,data){
                        if(err) throw err;
                        
                        req.app.locals.resetSession = false
                        return res.status(201).send({msg:"record updated"})
                    })
                })
                .catch(e=>{
                    return res.status(500).send({
                        error:"unable to hash password"
                    })
                })


            })
            .catch(error =>{
                return res.status(404).send({msg:"username not found"})
            })
        } catch (error) {
            
        }
    } catch (error) {
        return res.status(401).send({error})
    }
}
export async function createResetSession(req,res){
    // res.json('createResetSession Route')
    if(req.app.locals.resetSession){
        req.app.locals.resetSession = false //allow access to this route only once
        res.status(201).send({msg:"Access Granted"}) 

    }
    return res.status(440).send({error:"Session expired"})
}