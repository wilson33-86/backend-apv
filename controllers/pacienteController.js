import Paciente from "../models/Paciente.js";

const agregarPaciente = async(req,res)=>{
   const pacient =  new Paciente(req.body);
   pacient.veterinario = req.veterinarioCli._id;
   res.json(pacient)
   try {
    const pacienteNuevo = await pacient.save();
    console.log(pacienteNuevo);
    
   }catch(error) {
    console.log(error);
   }
};

const obtenerPacientes = async (req, res) => {

        const pacientes = await Paciente.find()
        .where("veterinario")
        .equals(req.veterinarioCli); 

        // console.log(pacientes);   
        res.json(pacientes);    
      
     
  
};

const obtenerPaciente = async(req,res)=>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    if(!paciente){
        const error = new Error('No existe paciente');
        res.status(400).json({msg:error.message});
    }
    if(paciente.veterinario._id.toString() !== req.veterinarioCli._id.toString()){
        return res.json({msg:"Acción no válida"});
    }
    
if(paciente){
 console.log(paciente);
//  res.json(paciente)
}   
};

const actualizarPaciente = async(req,res)=>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    if(!paciente){
        const error = new Error('No existe paciente');
        res.status(404).json({msg:error.message});
    }
    if(paciente.veterinario._id.toString() !== req.veterinarioCli._id.toString()){
        return res.json({msg:"Acción no válida"});
    }

    paciente.nombre = req.body.nombre ||  paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
      const PacienteUpd =  await paciente.save();
      console.log(PacienteUpd);
    } catch (error) {
        console.log(error);        
    }
};
const eliminarPaciente = async(req,res)=>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    if(!paciente){
        // const error = new Error('No existe paciente');
        // res.status(404).json({msg:error.message});
        console.log('No existe paciente');
        return;
    }
    if(paciente.veterinario._id.toString() !== req.veterinarioCli._id.toString()){
        console.log({msg:"Acción no válida"});
        return;
    }

    try {
         await paciente.deleteOne();
        console.log({msg:"Paciente Eliminado"});
      } catch (error) {
          console.log(error);        
      }

};

export{
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}