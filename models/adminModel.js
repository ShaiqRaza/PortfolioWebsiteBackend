import mongoose from 'mongoose'

const adminSchema = mongoose.Schema({
    email:{
        type:String,
        required: true,
        validate: {
            validator: (v) => {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
          }        
    },
    password:{
        type:String,
        required: true
    }   
})

const adminModel = mongoose.model('admin', adminSchema);
export default adminModel;