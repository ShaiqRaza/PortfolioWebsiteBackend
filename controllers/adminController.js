import dotenv from 'dotenv'
dotenv.config();
import adminModel from '../models/adminModel.js';
import bcrypt from 'bcrypt'

export const createAdmin = async (req, res) =>{
    try{
        if(process.env.NODE_ENV == "production")
            return res.status(404).json({message:"You can't create Admin!"})
        const availableAdmin = await adminModel.findOne();
        if(availableAdmin)
            return res.status(500).json({message: "Admin is already created"})

        const {email, password} = req.body;

        if(!(email && password))
            return res.status(504).json({message: "All fields are required"})

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const admin = await adminModel.create({
            password: hash,
            email
        })

        res.json({message: "Admin created successfully"})
    }
    catch(err){
        res.json({
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
            return res.status(400).json({message: "All fields are required"})
        
        const admin = await adminModel.findOne();
        if(!admin)
            return res.status(404).json({message: "There is no admin yet"})
    
        const response = await bcrypt.compare(currentPassword, admin.password);
        
        if(!response)
            return res.status(401).json({message: "Password is incorrect"})

        if(password){
            // comparing new and prev password
            const comparison = await bcrypt.compare(password, admin.password);

            if(comparison && (!email || email==admin.email))
                return res.status(409).json({message: "Nothing to change"})
            
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            admin.password = hash;
           
        }
        //if password is not given then email must be given compulsory as I already checked it
        else if(email==admin.email)
            return res.status(409).json({message: "Nothing to change"})
        else
            admin.email = email;
    
        await admin.save();
    
        res.status(200).json({message: "Admin updated successfully"});
    }
    catch(err){
        res.json({
            message: "Something error occured in admin updation",
            error: err.message
        })
    }
}