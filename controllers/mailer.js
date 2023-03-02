import nodemailer from 'nodemailer'
import ENV from "../router/connfig.js"
import Mailgen from 'mailgen';
let nodeconfig={
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'conner.hudson48@ethereal.email',
        pass: 'jSdqEtUwGujYyf5nRp'
    }
}
let transporter = nodemailer.createTransport(nodeconfig);
let MailGenerator = new Mailgen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:"https://mailgen.js/"
    }
})
export const registerMail = async(req,res)=>{
    const{username, userEmail, text, subject} = req.body
    // .EMAIL BODY
    var email ={
        body:{
            name:username,
            intro:text||"WELCOME ON BOARD",
            outro:"need help?Just reply to this email. we would be happy to help"
        }
    }
    var emailBody =MailGenerator.generate(email);
    let message ={
        from:ENV.EMAIL,
        to:userEmail,
        subject:subject || "signup successful",
        html:emailBody
    }
    transporter.sendMail(message)
    .then(()=>{
        return res.status(201).send({msg:"You should recieve an email from us"})
    })
    .catch(error=> res.status(500).send({error}))
}