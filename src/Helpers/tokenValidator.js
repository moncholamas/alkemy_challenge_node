import jsonwebtoken from 'jsonwebtoken'
export function validator(req,res,next){
    const token = req.headers["token"]; //tengo que enviar el token desde el header

    try {
        jsonwebtoken.verify(token,'alkemy');
        return next();
    } catch (error) {
        console.log(error);
        return res.json({msg:"autenticación fallida, necesita iniiar sesión para continuar, si no tiene cuenta ingrese a: /register"})
    }
}