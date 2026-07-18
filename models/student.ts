import mongoose , {model, models, Schema} from "mongoose"

const studentSchema = new Schema({
    name:{
        type:String,
        required:true,

    },
    rollNumber:{
        type: String,
        required:true,
        unique:true,
    },
    class:{
        type: String,
        required:true,


    },
    section:{
        type:String,

    },
    email:{
        type:String,
        
    },
    phone:{
        type:String,
        
    },
    imageUrls:{
        type: [String],default:[]
    },
    embedding:{
        type:[Number],required:true
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },

},{timestamps:true});

export const Student = models.Student || model("Student",studentSchema);