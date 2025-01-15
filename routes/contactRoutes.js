import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();   

// Route to handle the form submission
router.post('/send-email', (req, res) => {
    const { email, message } = req.body;

    // Create a Nodemailer transporter object
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',  // SMTP provider details (Gmail in this case)
        port: 587,               // Port for STARTTLS
        secure: false,           // Use STARTTLS
        auth: {
            user: 'shaiqraza808y@gmail.com',  // Your authenticated email address
            pass: 'Shaiq1234'    // Your email password or app-specific password
        }
    });

    // Set up email message options
    let mailOptions = {
        from: 'shaiqraza808y@gmail.com',  // This is the actual sender's email (your email)
        to: 'shaiqraza808y@gmail.com',    // You are sending the email to your email address
        replyTo: email,                // Reply will go to the user's email
        subject: 'Contact from portfolio website',
        text: message,
        html: `<p>${message}</p>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Message sent successfully');
    });
});

export default router;