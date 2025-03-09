import mongoose from 'mongoose'

const socialSchema = mongoose.Schema({
    instagram: {
        type: String,
        default: "www.instagram.com"
    },
    x: {
        type: String,
        default: "www.x.com"
    },
    github: {
        type: String,
        default: "www.github.com"
    },
    linkedin: {
        type: String,
        default: "www.linkedin.com"
    },
    phone: {
        type: String,
        default: "Nope"
    }
})

const socialModel = mongoose.model('social', socialSchema);
export default socialModel;