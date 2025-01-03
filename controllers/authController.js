import dotenv from 'dotenv';
dotenv.config();
import aboutModel from "../models/aboutModel.js";
import bcrypt from 'bcrypt';

export const loginAdmin = async(req, res) => {
    try{
        const {password} = req.body;
        if(!password)
            return res.json({message: "Password is Required"})
        const about = await aboutModel.findOne();
        if(!about)
            return res.status(404).json({ message: "Admin not found!" });
        const hash = about.password;
        bcrypt.compare(password, hash, function(err, result) {
            if(err)
                return res.status(500).json({message: "Error occured in hash comparing", error: err.message})
            if(result){
                res.cookie('admin', "success", {httpOnly: true});
                return res.status(200).json({ message: "Login successful!" });
            }
            else
                res.json({
                    message: "Password is Incorrect!"
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