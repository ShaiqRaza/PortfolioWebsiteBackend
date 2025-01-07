import dotenv from 'dotenv';
dotenv.config();
import adminModel from "../models/adminModel.js";
import bcrypt from 'bcrypt';

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

        // first of all, I stored the hash of the actual admin's password so that I can compare it with the entered password for login
        const hash = admin.password;
        bcrypt.compare(password, hash, function(err, result) {
            if(err)
                return res.status(500).json({message: "Error occured in hash comparing", error: err.message})
            if(result){
                res.cookie('admin', "success", {httpOnly: true});
                return res.status(200).json({ message: "Login successful!" });
            }
            else
                res.json({
                    message: "Incorrect email or password"
                })
        });
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
        const adminCookie = req.cookies.admin;
        if(adminCookie){
            res.clearCookie('admin', {httpOnly:true});
            return res.json({message: "Logged out successfully!"})
        }
        else
            return res.json({message: "You are not logged in yet!"})
    }
    catch(err){
        res.status(500).json({
            message: "error occured at logging out",
            error: err.message
        })
    }
}