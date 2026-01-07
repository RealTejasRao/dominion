import mongoose, {Schema} from "mongoose";

const failureSchema= new Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true,
        },
        date:{
            type:String,
            required:true,
            index:true,
        },
        reason:{
            type:String,
            trim:true,
            minlength: 10,
            default:"",
        },
    }, {timestamps: true,},
);

failureSchema.index({user:1, isActive:1}, {unique:true});

const Failure= mongoose.model("Failure", failureSchema);
export default Failure;

