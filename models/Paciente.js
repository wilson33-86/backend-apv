import mongoose from "mongoose";

const pacienteSchema = mongoose.Schema({
    nombre:{
        type:String,
        require:true,
    },
    propietario:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    fecha:{
        type:Date,
        require:true,
        default: Date.now(),
    },
    sintomas:{
        type:String,
        require:true,
    },
    veterinario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"veterinario",
    },


},
{
    timestamps:true,
}

);

const paciente = mongoose.model("Paciente",pacienteSchema);

export default paciente;