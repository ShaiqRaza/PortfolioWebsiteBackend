import dotenv from 'dotenv';
dotenv.config();
import aboutModel from "../models/aboutModel.js";
import bcrypt from 'bcrypt';

export const loginAdmin = async(req, res) => {
    try{
        const about = await aboutModel.findOne();
        if(!about)
            return res.status(404).json({ message: "About not found!" });
        const hash = about.password;
        const {password} = req.body;
        bcrypt.compare(password, hash, function(err, result) {
            if(err)
                return res.status(500).json({message: "Error occured in hash comparing", error: err.message})
            if(result){
                res.cookie('admin', "success", {httpOnly: true});
                return res.status(200).json({ message: "Login successful!" });
            }
        });
    }
    catch(err){
        res.status(500).json({
            message: "An error occures while login the admin",
            error: err.message
        })
    }
}