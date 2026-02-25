import bcrypt from "bcrypt";

const saltGround = 10;

export const passwordEncrypt = async (password) => {
    try{
        const hashPassword = await bcrypt.hash(password, saltGround);

        return hashPassword
    }
    catch(err){
        return err.message
    }
}

export const passwordDecrypt = async (password, hashPassword) => {
    try{
        const decryptionResult = await bcrypt.compare(password, hashPassword);

        return decryptionResult
    }
    catch(err){
        return err.message
    }
}