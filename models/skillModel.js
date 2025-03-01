import mongoose from 'mongoose'
const skillSchema = mongoose.Schema({
    logo:{//actual url
        type: String,
        default: ''
    },
    logo_id:{//public_id
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