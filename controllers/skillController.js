import skillModel from '../models/skillModel.js'

export const getAllSkills = async(req, res) =>{
    await skillModel.find()
    .then((response)=>{
        res.status(200).json(response);
    })
    .catch((err)=>{
        res.status(500).send("Something error happened! Can't load All skills");
    })
}

export const createSkill = async(req, res) =>{
    const {title, description} = req.body;
    const existingSkill = await skillModel.findOne({title});

    if(existingSkill){
        return res.status(500).send(`${title} skill already exists`);
    }

    const newSkill = await skillModel.create({
        title,
        description
    })
    .then((response)=>{
        res.status(200).json(response);
    })
    .catch((err)=>{
        res.status(500).send("Something error happened! Can't create new skill document");
    })
}

export const updateSkill = async(req, res) =>{ 
    const {title, description, id} = req.body;
    const existingSkill = await skillModel.find({_id:id});

    if(!existingSkill){
        return res.status(500).send(`Something error happened! Target skill document not exists`);
    }

    existingSkill.description = description;
    existingSkill.title = title;
    await existingSkill.save()
    .then((response)=>{
        res.status(200).json(response);
    })
    .catch((err)=>{
        res.status(500).send(`Something error happened! Can'ts update ${title} skill document`);
    })
}

export const deleteSkill = async (req, res)=>{
    const {title} = req.body;
    const existingSkill = await skillModel.find({title});

    if(!existingSkill){
        return res.status(504).send("The target skill to delete doesn't even exits.")
    }

    await skillModel.deleteOne({title})
    .then((response)=>{
        return res.send(response)
    })
    .catch(()=>{
        return res.status(400).send("Something error happened! Can't delete the skill document.")
    })
}