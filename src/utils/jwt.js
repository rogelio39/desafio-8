import 'dotenv/config'
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    

    const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '12h'})
    return token; 
}


export const authToken = (req, res, next) => {
    //consultar al header
    const authHeader = req.header.Authorization;

    if(!authHeader) {
        res.status(401).send({error: 'usuario no autenticado'})
    }
    //nos quedamos con el token y descartamos el bearer
    const token = authHeader.split(' ')[1]; 

    jwt.sign(token, process.env.JWT_SECRET, (error, credential) => {
        if(error){
            return res.status(403).send({error: 'usuario no autorizado: token invalido'})
        }
        
        //usuario valido
        req.user = credential.user;
        next()
    })
}
