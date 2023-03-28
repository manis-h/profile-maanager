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

