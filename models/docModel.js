import mongoose from 'mongoose'

const docSchema = mongoose.Schema({
    image:{
        type:String,
        required: true
    },
    image_id:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required: true
    },
    //description is not compulsory
    description: String
});

const docModel = mongoose.model('doc', docSchema);
export default docModel;