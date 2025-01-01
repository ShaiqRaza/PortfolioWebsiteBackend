import mongoose from 'mongoose';

const aboutSchema = mongoose.Schema({
    intro: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const aboutModel = mongoose.model('about', aboutSchema);
export default aboutModel;