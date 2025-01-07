import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import adminModel from '../models/adminModel.js';

//see! I'm making this not "is logged in admin" because my backend only have this login feature for admin not for any other personality
export const isLoggedin = async (req, res, next)=>{
    try{
        const authCookie = req.cookies.admin;
        const decoded = jwt.verify (authCookie, process.env.JWT_SECRET);
        const admin = await adminModel.findOne({email:decoded})
        if(admin){
            return next();
        }
        return res.json({message:"Admin is not logged in"})
    }
    catch(err){
        res.status(504).json({
            message: "Something error occured in cookie getting",
            error: err.message
        })
    }
}