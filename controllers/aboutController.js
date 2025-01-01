import aboutModel  from "../models/aboutModel";

export const createAbout = async(req, res) =>{
    try{
        if(process.env.NODE_ENV == 'production')
            return res.status(400).json({ message: "You are not allowed to create about in production environment" });
        const {Intro, description, avatar, password} = req.body;
        const existingAbout = await aboutModel.find();

        if(existingAbout.length>0){
            return res.status(500).send(`About already exists`);
        }

        const newAbout = await aboutModel.create({
            Intro,
            description,
            avatar,
            password
        })
        res.status(200).json(newAbout);
    }
    catch(err){
        res.status(500).json({ 
            message: "An error occurred while creating the about.",
            error: err.message 
        });
    }
}