import mongoose from 'mongoose'
const skillSchema = mongoose.Schema({
    logo:{
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type:String,
        default: ''
    }
})

const skillModel = mongoose.model('skill', skillSchema);
export default skillModel