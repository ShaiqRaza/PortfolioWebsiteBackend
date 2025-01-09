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
            image: {
                type: String,
            },
            image_id: {
                type: String,
            }
        }
    ],
    video: {
        type: String
    },
    video_id: {
        type: String
    }
});

const projectModel = mongoose.model('project', projectSchema);
export default projectModel;