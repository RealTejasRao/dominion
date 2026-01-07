import mongoose, { mongo, Schema } from "mongoose";
import User from "./users.models";

const goalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true,
    index:true,
  },

  title: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  completed:{
    type:Boolean,
    default:false,
  },
  date:{
    type:String,
    required:true,
    index:true,
  },
  
},{timestamps:true,},);

goalSchema.index({user:1, date:1, title:1}, {unique:true});


const Goal= mongoose.model("Goal", goalSchema);
export default Goal;