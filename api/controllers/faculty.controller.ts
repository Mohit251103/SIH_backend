import Faculty from "../models/faculty.model";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otp from "../../utils/otpGenerator";
import sendmail from "../../utils/sendEmail";
import resendOtpController from "../controllers/extra/resend-otp.controller";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = req.body;
        const faculty = await Faculty.findOne({ email: user.email as string });
        if (faculty) {
            return res.status(409).send("User already exist");
        }

        const hashedPassword = await bcrypt.hash(user.password as string, 10);
        user.password = hashedPassword;

        await Faculty.create({ ...user, instituteId: user.instituteId as string, });

        const gen_otp = otp()
        res.cookie("otp", gen_otp, { maxAge: 5 * 60 * 1000, secure: false, httpOnly: true });
        res.cookie("email",user.email,{secure:false})
        sendmail(user.email, gen_otp as string);

        res.status(200).send("Verification code sent");

    } catch (error: any) {
        throw new Error(error as string);
    }
})

router.post('/verify-otp', async (req, res) => {
    try {
        const { otp, email } = req.body;

        const gen_otp = req.cookies.otp;
        res.clearCookie("otp");
        if (!gen_otp) {
            return res.status(408).send("Time out. Generate new OTP. ");
        }

        if (otp != gen_otp) {
            return res.status(400).send("Wrong OTP");
        }

        let user: any;
        if (!email) {
            user = await Faculty.findOne({ email: req.cookies.email });
        }
        else {
            user = await Faculty.findOne({ email });
        }

        if (!user) {
            res.status(404).send("User does not exist");
        }
        user!.isverified = true;
        await user!.save();
        if (req.cookies.email) {
            res.clearCookie("email");
        }

        user.isfirsttime = false;
        return res.status(200).send("User verified successfully.");
    } catch (error) {
        throw new Error(error as string);
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = req.body;
        const faculty = await Faculty.findOne({ email: user.email });
        if (!faculty) {
            return res.status(404).send("User does not exist");
        }

        const comparePass = await bcrypt.compare(user.password, faculty.password);
        if (!comparePass) {
            return res.status(403).send("Incorrect credentials");
        }

        const data = { id: faculty._id, email: faculty.email };

        const token = jwt.sign(data, process.env.SECRET_KEY as string);
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true
        })
        res.status(200).send("Logged in successfully");

    } catch (error) {
        throw new Error(`Internal server error : ${error}`);
    }
})

router.get("/logout", (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).send("logged out successfully");
    } catch (error) {
        throw new Error(error as string);
    }

})

router.use('/resend-otp', resendOtpController);

router.post("/verify", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Faculty.findOne({ email });
        if (!user) {
            return res.status(404).send("User does not exist");
        }

        if (user!.isverified) {
            return res.status(200).send("User verified");
        }
        return res.status(403).send("Not verified")
    } catch (error) {
        throw new Error(error as string);
    }
})

router.post("/reset-password", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Faculty.findOne({ email });
        const hashedPassword = await bcrypt.hash(password, 10);
        user!.password = hashedPassword;

        await user!.save();
        return res.status(200).send("Password reset successfully");
    } catch (error) {
        throw new Error(error as string);
    }
})


export default router;