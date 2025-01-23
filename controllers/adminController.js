import dotenv from 'dotenv'
dotenv.config();
import adminModel from '../models/adminModel.js';
import bcrypt from 'bcrypt'

export const createAdmin = async (req, res) =>{
    try{
        if(process.env.NODE_ENV == "production")
            return res.status(400).json({success: false, message:"You can't create Admin!"})
        const availableAdmin = await adminModel.findOne();
        if(availableAdmin)
            return res.status(400).json({success: false, message: "Admin is already created"})

        const {email, password} = req.body;

        if(!(email && password))
            return res.status(400).json({success: false, message: "All fields are required"})

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const admin = await adminModel.create({
            password: hash,
            email
        })

        res.status(200).json({
            success: true,
            message: "Admin created successfully",
            data: admin
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Something error occured in admin creation",
            error: err.message
        })
    }
}

export const updateAdmin = async (req, res) =>{
    try{
        //for more security
        const {email, password, currentPassword} = req.body;

        if( !((email || password) && currentPassword) )
            return res.status(400).json({success: false, message: "All fields are required"})
        
        const admin = await adminModel.findOne();
        if(!admin)
            return res.status(400).json({success: false, message: "There is no admin yet"})
    
        const response = await bcrypt.compare(currentPassword, admin.password);
        
        if(!response)
            return res.status(400).json({success: false, message: "Password is incorrect"})

        if(password){
            // comparing new and prev password
            const comparison = await bcrypt.compare(password, admin.password);

            if(comparison && (!email || email==admin.email))
                return res.status(400).json({success: false, message: "Nothing to update"})
            
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            admin.password = hash;
           
        }
        //if password is not given then email must be given compulsory as I already checked it
        else if(email==admin.email)
            return res.status(400).json({success: false, message: "Nothing to update"})
        admin.email = email;
    
        await admin.save();
    
        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: admin
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Something error occured in admin updation",
            error: err.message
        })
    }
}
