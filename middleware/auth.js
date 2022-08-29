import jwt from "jsonwebtoken";
import veterinario from "../models/Veterinario.js";

const checkAuth = async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){  
              
       try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.veterinarioCli = await veterinario.findById(decoded.id).select("-password -token -confirmado");          
            next();
           
       } catch (error) {        
            const e = new Error("Token no valido!");
            return res.status(403).json({msg:e.message});  
            }
    }

if(!token){
    const error = new Error("Token no enviado o vacio!");
    return res.status(403).json({msg:error.message});  
}    
    next();
};


export default checkAuth;


