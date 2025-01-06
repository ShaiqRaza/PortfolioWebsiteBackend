import dotenv from 'dotenv'
dotenv.config();
import adminModel from '../models/adminModel';

export const createAdmin = async (req, res) =>{
    try{
        if(process.env.NODE_ENV == "production")
            return res.status(404).json({message:"You can't create Admin!"})
        const availableAdmin = adminModel.findOne();
        if(availableAdmin)
            return res.status(500).json({message: "Admin is already created"})

        const {email, password} = req.body();

        if(!(email && password))
            return res.status(504).json({message: "All fields are required"})

        const admin = await adminModel.create({
            email,
            password
        })

        res.send("Admin is created successfully")

    }
    catch(err){
        res.json({
            message: "Something error occured in admin creation",
            error: err.message
        })
    }
}