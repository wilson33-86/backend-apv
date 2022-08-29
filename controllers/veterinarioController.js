import veterinario from "../models/Veterinario.js";
import crearJwt from "../helpers/generarJwt.js";
import tkn from "../helpers/generarToken.js";
import emailReg from "../helpers/emailReg.js";
import recuperarPassw from "../helpers/recuperaPassw.js";

const registrar = async(req,res)=>{
    const {email,nombre}= req.body;
    const existeEmail = await veterinario.findOne({email});
    if(existeEmail){
        const error = new Error('ya existe el usuario!');
        res.status(400).json({msg:error.message});
    }

    try {
        const nuevoUser = new veterinario(req.body);
        const usuario = await nuevoUser.save();
        //enviar email
        emailReg({email,nombre,token:usuario.token});

        res.json(usuario);
    } catch (err) {
        console.log(err)
    }
};


const perfil =(req,res)=>{
    const {veterinarioCli}= req;
    
    res.json(veterinarioCli);
    };

const confirmar = async(req,res)=>{
    const {token} = req.params;
    const existeToken = await veterinario.findOne({token});
    if(!existeToken){
        const error = new Error('Token no valido');
        return res.status(404).json({msg:error.message});
    }
    
    try {
        existeToken.token = null;
        existeToken.confirmado = true;
        await existeToken.save();
        res.json({msg:"Usuario confirmado correctamente"});
    } catch (error) {
        console.log(error);
    }
    
    };

const autenticar = async(req,res)=>{
    const {email,password} = req.body;
    const usuario = await veterinario.findOne({email});
    if(!usuario){
     const error = new Error('Usuario No Existe!');
     return res.status(401).json({msg:error.message});
    }
     
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada!');
        return res.status(401).json({msg:error.message});
    }
  const compruebaPassw = await usuario.validarPassword(password);
    if(compruebaPassw){
      // console.log('password correcto');
       const jwtClave = crearJwt(usuario.id);
       res.json({
        _id: usuario._id,
        nombre:usuario.nombre,
        email:usuario.email,      
        token:jwtClave
       });
    }else{
        const error = new Error('Tu password es incorrecto!');
        return res.status(401).json({msg:error.message});
    }

    // res.send('paso!!');
};
const olvidePassword = async(req,res)=>{
    const {email} = req.body;
    const existeEmail = await veterinario.findOne({email});
    console.log(existeEmail);
    if(!existeEmail){
        const error = new Error('Usuario no existe en bd!');
        return res.status(400).json({msg:error.message});
    }

    try {
      existeEmail.token = tkn();
      await existeEmail.save();
      recuperarPassw({
        email,
        nombre: existeEmail.nombre,
        token:existeEmail.token
      })
      res.json({msg:"La instruciones fueron enviadas a su email"})
        
    } catch (error) {
        console.log(error)
    }
};
const comprobarToken = async(req,res)=>{
    const {token} = req.params;
    const existeToken = await veterinario.findOne({token});
    if(existeToken){
        return res.json({msg:"Token valido, si existe el usuario"});
    }else{
        const error = new Error('Token no existe!');
        return res.status(400).json({msg:error.message});
    }
};
const nuevoPassword = async(req,res)=>{
    const {token} = req.params;
    const {password} = req.body;
    const veterin = await veterinario.findOne({token});
    if(!veterin){
       const error = new Error('Token no valido');
       return res.status(404).json({msg:error.message});
    }

    try {
        veterin.token = null;
        veterin.password = password;
        await veterin.save();
        res.json({msg:"se ha cambiado contraseña correctamente"})
        
    } catch (error) {
        console.log(error)
    }


};

const actualizarPerfil = async (req,res)=>{
    const {id} = req.params;
    const {email,nombre,web,telefono} = req.body;
    const usuario = await veterinario.findById(id);

    if(!usuario){
        const error = new Error('Usuario no encontrado');
       return res.status(404).json({msg:error.message});
    }
    
    if(usuario.email !== email){
        const existeEmail = await veterinario.findOne({email});
        if(existeEmail){
            const error = new Error('Email esta en uso');
            return res.status(404).json({msg:error.message});
        }
       
    }

    try {
        usuario.nombre = nombre;
        usuario.email = email;
        usuario.web = web;
        usuario.telefono = telefono;

        const updUser = await usuario.save();
        //res.json(updUser);
        console.log(updUser)
        
    } catch (error) {
        console.log(error)
    }

}

const cambiarPassword= async(req,res)=>{

    const {_id} =req.veterinarioCli;
    const {passwordActual,nuevoPassword} = req.body;

    const veterin = await veterinario.findById(_id);
    if(!veterin){
        const error = new Error('No se encuentra ell usuario');
        return res.status(404).json({msg:error.message});
    }

    if( await veterin.validarPassword(passwordActual)){
        veterin.password = nuevoPassword;
        await veterin.save();
        res.json({msg:'Password Almacenado Correctamente'})
    }else{
        console.log('Incorrecto')
        const error = new Error('Password actual Incorrecto');
        return res.status(404).json({msg:error.message});
    }

}

export{
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    cambiarPassword
}


