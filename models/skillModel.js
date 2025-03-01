import mongoose from 'mongoose'
const skillSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type:String,
    }
})

const skillModel = mongoose.model('skill', skillSchema);
export default skillModel