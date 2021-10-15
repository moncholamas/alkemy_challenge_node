import jsonwebtoken from 'jsonwebtoken'
export function validator(req,res,next){
    const token = req.headers["token"]; //tengo que enviar el token desde el header

    try {
        const verifytoken = jsonwebtoken.verify(token,'alkemy');
        return next();
    } catch (error) {
        console.log(error);
        return res.json({msg:"error al validar el token"})
    }
}