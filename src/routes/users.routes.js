import { Router } from "express";
import { userModel } from "../models/users.models.js"; 


const userRouter = Router();


userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send({ respuesta: 'ok', mensaje: users });

    } catch (error) {
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}
)


userRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if (user) {
            res.status(200).send({ respuesta: 'ok', mensaje: user });
        } else {
            res.status(404).send({ respuesta: "error", mensaje: "user not found" });
        }
    } catch (error) {
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
})


userRouter.put('/:id', async (req, res) => {
    const {id} = req.params;
    const { first_name, last_name, age, email, password} = req.body;
    try {
        const respuesta = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password });
        if(respuesta){
            res.status(200).send({ respuesta: 'ok', mensaje: respuesta });
        } else {
            res.status(404).send({respuesta: 'error', mensaje: 'producto no encontrado'});
        }
        
    } catch (error) {
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
})

userRouter.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const user = await userModel.findByIdAndDelete(id);
        if(user) {
            res.status(200).send({ respuesta: 'ok', mensaje: 'usuario borrado' });
        } else {
            res.status(404).send({ respuesta: 'error', mensaje: 'usuario no encontado, error al eliminar' });
        }


    } catch (error) {
        res.status(400).send({ respuesta: "error", mensaje: error });
    }
}
)



export default userRouter;