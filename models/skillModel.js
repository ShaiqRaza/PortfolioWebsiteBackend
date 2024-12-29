import mongoose from 'mongoose'
const skillSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type:String,
        required: true
    }
})

const skillModel = mongoose.model('skill', skillSchema);
export default skillModel