import express from "express";
import conectarDb from "./config/db.js";
import dotenv from "dotenv";
import routerVeterinario from "./routes/veterinarioRoutes.js";
import routerPaciente from "./routes/pacienteRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
conectarDb();

const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions={
    origin:function(origin,callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null,true);
        }else{
            callback(new Error("Dominio No permitido"));
        }
    },
};
app.use(cors(corsOptions))

app.set("PORT",process.env.PORT || 4000);
// app.use(express.urlencoded({extended:true}));
app.use(express.json());

//rutas
app.use('api/veterinarios',routerVeterinario);
app.use('/api/pacientes',routerPaciente);

app.listen(app.get("PORT"),()=>{
    console.log('Servidor corriendo en el puerto',app.get("PORT"))
})