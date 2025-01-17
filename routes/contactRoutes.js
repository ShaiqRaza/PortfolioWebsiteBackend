import dotenv from 'dotenv';    
dotenv.config();   
import express from 'express';
import nodemailer from 'nodemailer';
import adminModel from '../models/adminModel.js';

const router = express.Router();   

// Route to handle the form submission
router.post('/send-email', async (req, res) => {
    const { email, message, name } = req.body;
    if( !(email && message && name) )
        return res.status(400).json({success: false, message: 'All fields are required.'});

    const admin = await adminModel.findOne()
    .catch(err=>{
        return res.status(500).json({success: false, message: "Somehthing error occured in finding admin.", error: err.message});
    })

    if(!admin)
        return res.status(400).json({success: false, message: "Admin not found."});

    // Create a Nodemailer transporter object
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',  // SMTP provider details (Gmail in this case)
        port: 587,               // Port for STARTTLS
        secure: false,           // Use STARTTLS
        auth: {
            user: admin.email,  // Your authenticated email address
            pass: admin.password // Your email password or app-specific password
        }
    });

    // Set up email message options
    let mailOptions = {
        from: admin.email,  // This is the actual sender's email (your email)
        to: admin.email,    // You are sending the email to your email address
        replyTo: email,                // Reply will go to the user's email
        subject: `${name} contacted from portfolio website.`,
        text: message,
        html: `<p>${message}</p>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({success: false, message: 'Error sending email', error: error.message});
        }
        res.status(200).json({message: 'Message sent successfully', success: true});
    });
});

export default router;