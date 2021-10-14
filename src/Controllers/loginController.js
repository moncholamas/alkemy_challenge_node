
export function login(req,res){
    console.log(req.body);
    return res.json({
        msg: "hola"
    });
}

export function logup(req,res){
    const {name_user, pass_user} = req.body;
    
    return res.json({
        msg: "hola"
    });
}