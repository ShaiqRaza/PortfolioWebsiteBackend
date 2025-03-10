import dotenv from 'dotenv';
dotenv.config();
import adminModel from "../models/adminModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const loginAdmin = async(req, res) => {
    try{
        const admin = await adminModel.findOne();
        if(!admin)
            return res.status(400).json({success: false, message: "There is no admin, you can't login" });
        const {password, email} = req.body;
        if(!password || !email)
            return res.status(400).json({success: false, message: "All fields are required"})

        if(email != admin.email )
            return res.status(400).json({success: false, message: "Incorrect email or password"})

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch)
            return res.status(400).json({success: false, message: "Incorrect email or password" });

        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

        res.cookie('admin', token, {httpOnly: true, path: "/", sameSite: "None", secure: true });
        return res.status(200).json({success: true, message: "Login successful!" });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "An error occures while login the admin",
            error: err.message
        })
    }
}

export const logoutAdmin = async(req, res) => {
    try{
        res.clearCookie('admin', {httpOnly: true, path: "/", sameSite: "None", secure: true });
        return res.status(200).json({success: true, message: "Logged out successfully!"})
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "error occured at logging out",
            error: err.message
        })
    }
}

export const isLoggedIn = async (req, res)=>{
    try{
        const authCookie = req.cookies.admin;
        if(!authCookie)
            return res.status(200).json({
            success: false,
            message: "There is no cookie!",
        });
        const decoded = jwt.verify (authCookie, process.env.JWT_SECRET);
        const admin = await adminModel.findOne({email:decoded.email})
        if(admin)
            return res.status(200).json({
                success: true
            });
        return res.status(200).json({
            success: false,
            message: "Cookie is not correct!",
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Something error occured in cookie getting",
            error: err.message
        })
    }
}
