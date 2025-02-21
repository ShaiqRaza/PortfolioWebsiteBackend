import mongoose from 'mongoose'

const socialSchema = mongoose.Schema({
    instagram: {
        type: String,
        defeult: "www.instagram.com"
    },
    x: {
        type: String,
        defeult: "www.x.com"
    },
    facebook: {
        type: String,
        defeult: "www.facebook.com"
    },
    linkedin: {
        type: String,
        defeult: "www.linkedin.com"
    }
})

const socialModel = mongoose.model('social', socialSchema);
export default socialModel;