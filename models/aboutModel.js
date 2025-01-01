import mongoose from 'mongoose';

const aboutSchema = mongoose.Schema({
    Intro: {
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

export const aboutModel = mongoose.model('about', aboutSchema);