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
    images: {
        type:[
            {
                image: {
                    type: String,
                },
                image_id: {
                    type: String,
                }
            }
        ],
        default: []
    },
    video: {
        type: String,
        default: null
    },
    video_id: {
        type: String,
        default: null
    }
});

const projectModel = mongoose.model('project', projectSchema);
export default projectModel;