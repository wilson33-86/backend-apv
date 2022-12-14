import mongoose from "mongoose";
import tokenEmail from "../helpers/generarToken.js";
import bcrypt from "bcrypt";

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required:true,
        trim:true,

    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    telefono:{
        type:String,
        default:null,
        trim:true
    },
    web:{
        type:String,
        default:null,
       
    },
    token:{
     type:String,
     default: tokenEmail(),
    },

    confirmado:{
        type:Boolean,
        default:false,
      
    }
});

veterinarioSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt); 
});

veterinarioSchema.methods.validarPassword = async function(passwordForm){
  return await bcrypt.compare(passwordForm,this.password);
};

const veterinario = mongoose.model("Veterinario",veterinarioSchema);

export default veterinario;