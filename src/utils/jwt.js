import 'dotenv/config'
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    

    const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '20h'})

    console.log("token: ", token);
    return token;
}

//generamos token
generateToken({"_id":"6522e34b2f0f6d6792a2f19c","first_name":"rogelio","last_name":"","age": "18","email":"andresrogesu@gmail.com","password":"$2b$15$Qq984AMwXYAEyWjrAaAzLe5fBTPPmUGk2QLur0Z9HR66JZt1Xd7AK","rol":"user"}
);



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
