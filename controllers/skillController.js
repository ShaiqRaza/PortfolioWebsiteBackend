import skillModel from '../models/skillModel.js'

export const getAllSkills = async(req, res) =>{
    await skillModel.find()
    .then((response)=>{
        res.status(200).json(response);
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send("Something error happened! Can't load All skills");
    })
}