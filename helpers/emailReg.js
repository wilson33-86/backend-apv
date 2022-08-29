import nodemailer from "nodemailer";

const emailReg = async(datos)=>{
    const transporte = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

const {email,nombre,token} = datos;

const enviarEmail= await transporte.sendMail({
    from:"Apv, veterinaria",
    to:email,
    subject:"Comprobar cuenta Apv",
    text:"Debes comprobar tu cuenta",
    html:`
     <p>Hola ${nombre}!, comprueba tu cuenta en Apv</p>
     <p>da click en el siguiente link: <a href="http://127.0.0.1:5173/confirmar/${token}">Comprobar</a></p>
    `

});
console.log("mensaje enviado: %s",enviarEmail.messageId);
};

export default emailReg;