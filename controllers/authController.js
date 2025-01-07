import dotenv from 'dotenv';
dotenv.config();
import adminModel from "../models/adminModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const loginAdmin = async(req, res) => {
    try{
        const admin = await adminModel.findOne();
        if(!admin)
            return res.status(404).json({ message: "There is no admin, you can't login" });
        const {password, email} = req.body;
        if(!password || !email)
            return res.json({message: "All fields are required"})

        if(email != admin.email )
            return res.status(500).json({ message: "Incorrect email or password"})

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch)
            return res.status(401).json({ message: "Incorrect email or password" });

        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

        res.cookie('admin', token, {httpOnly: true});
        return res.status(200).json({ message: "Login successful!" });
    }
    catch(err){
        res.status(500).json({
            message: "An error occures while login the admin",
            error: err.message
        })
    }
}

export const logoutAdmin = async(req, res) => {
    try{
        res.clearCookie('admin', {httpOnly:true});
        return res.json({message: "Logged out successfully!"})
    }
    catch(err){
        res.status(500).json({
            message: "error occured at logging out",
            error: err.message
        })
    }
}