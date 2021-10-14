import bcryptjs from 'bcrypt';

export async function encriptar(pass){
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(pass,salt);
}

export async function compararEncryp(pass,passRes){
    return await bcryptjs.compare(pass,passRes);
}   