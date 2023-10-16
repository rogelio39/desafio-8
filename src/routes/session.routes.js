import { Router } from "express";
import passport from "passport";
import {passportError, authorization} from '../utils/messagesError.js';
import { generateToken } from "../utils/jwt.js";
const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try{
        if(!req.user){
            res.status(401).send({message: 'invalid user'})
        }
        req.session.user = {
            first_name : req.user.first_name,
            last_name : req.user.last_name,
            age : req.user.age,
            email : req.user.email,
        };    

        //generamos el token
        const token = generateToken(req.user);
        //enviamos el token por cookie
        res.cookie('jwtCookie', token, {
            maxAge: 4320000 //12 hs en mili segundos
        });
        res.status(200).send({payload: req.user});
    }catch(error){
        res.status(500).send({message: `error al iniciar  sesion ${error}`});
    }
});

sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try{
        if(!req.user){
            res.status(400).send({message: 'existing user'})
        }
        
        return res.status(200).send({mensaje : 'User created'});

    }catch(error){
        res.status(500).send({message: `Error register ${error}`});
    }
});



sessionRouter.get('/github', passport.authenticate('github', {scope: ['user: email']} ), (req, res) => {
    res.status(200).send({message: 'usuario registrado'});
})


sessionRouter.get('/githubCallback', passport.authenticate('github'), (req, res) => {
    req.session.user = req.user;
    res.status(200).send({message: 'usuario logueado'});
})

sessionRouter.get('/testJWT', passport.authenticate('jwt', { session : false}), (req,res) => {
    console.log(req)
    res.send(req.user);
})


sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req,res) => {  
    res.send(req.user);
})



sessionRouter.get('/logout', async (req, res) => {
    try{
        if(req.session.user){
            req.session.destroy();
            res.clearCookie('jwtCookie');
            res.status(200).send({resultado: 'usuario deslogueado'})
        }
        } catch(error){
        res.status(400).send({error:`error en logout ${error}`});
    }
});





export default sessionRouter;