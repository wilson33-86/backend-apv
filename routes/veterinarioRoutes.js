import { Router } from "express";
import { perfil,registrar,confirmar,autenticar,olvidePassword,comprobarToken,nuevoPassword,actualizarPerfil,cambiarPassword} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/auth.js";

const router = Router();

router.post('/',registrar);

router.get('/confirmar/:token',confirmar);

router.post('/autenticar',autenticar);

router.get('/perfil',checkAuth,perfil);

router.put('/perfil/:id',checkAuth,actualizarPerfil);

router.put('/cambiar-Password',checkAuth,cambiarPassword);

router.post('/olvide-Password',olvidePassword)

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

export default router;