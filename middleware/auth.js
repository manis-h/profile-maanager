import  jwt  from "jsonwebtoken";
import ENV from '../router/connfig.js'
export default async function Auth(req,res,next){
    try {
        const token =req.headers.authorization.split(" ")[1];
        // res.json(token)
        // retrive user detail
        const decodeToken = await jwt.verify(token, ENV.JWT_SECRET)
        req.user = decodeToken;
        next()
        // res.json(decodeToken);
    } catch (error) {
        res.status(401).json({error:"Authentication failed"})
    }
}
export function localVariables(req,res,next){
    req.app.locals ={
        OTP:null,
        resetSession: false
    }
    next()
}