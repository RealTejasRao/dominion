import mongoose, {Schema} from "mongoose";

const deepworkSchema= new Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true,
        },
        startedAt:{
            type:Date,
            default:Date.now,
            required:true,
        },
        endedAt:{
            type:Date,
            default: null,

        },
        durationMinutes:{
            type:Number,
            default:0,
        },
        interrupted:{
            type:Boolean,
            default:false,
        },
        
        isActive:{
            type:Boolean,
            default:true,
            index:true,
        }
    },
    {timestamps: true,},
);

deepworkSchema.index({user:1, isActive:1}, {unique:true});

const Deepwork= mongoose.model("Deepwork", deepworkSchema)