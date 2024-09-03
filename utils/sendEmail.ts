import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_ID ,
        pass: process.env.MAIL_PASS ,
    },
});


transporter.verify((error, success) => {
    if (error) {
        console.log('Error with email configuration:', error);
    } else {
        console.log('Server is ready to take our messages:', success);
    }
});


const sendmail = async (email:string,otp:string) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_ID, 
            to: email, 
            subject: "OTP Verification", 
            html:`<p>OTP for verification is ${otp}. Do not share this with anyone</p>`
        });
    
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        throw new Error(error as string);
    }
}

export default sendmail;