import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    //video and images are not required
    images: [
        {
            type: String,
        }
    ],
    video: {
        type: String
    }
});

const projectModel = mongoose.model('project', projectSchema);
export default projectModel;