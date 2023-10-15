import { Router } from "express";
import passport from "passport";

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
        return res.status(200).send({payload: req.user});
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

sessionRouter.get('/current', passport.authenticate('jwt', { session : false}), (req,res) => {
    console.log(req)
    res.send(req.user);
})



sessionRouter.get('/logout', async (req, res) => {
    try{
        if(req.session.user){
            req.session.destroy();
            res.redirect(200,'/static')
        }
        } catch(error){
        res.status(400).send({error:`error en logout ${error}`});
    }
});





export default sessionRouter;