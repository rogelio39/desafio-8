import { Router } from "express";
import {productModel} from "../models/products.models.js";


const productRouter = Router();


productRouter.get('/', async (req, res) => {
    const { category, status, limit, page, sort } = req.query;
    //objeto para manejar las opciones ingresadas por parametros
    let options = {};

    if (sort === 'prices_desc') {
        options.sort = { price: -1 };
    } else if (sort === 'prices_crec') {
        options.sort = { price: 1 };
    } else {
        options.sort = {};
    }

    // Construye el objeto de consulta options.query en función de los parámetros proporcionados
    let query = {};

    if(status){
        query.status = status;
    } else if(category) {
        query.category = category;
    } else {
        query = {};
    }
    options.query = query;

    try {
        const respuesta = await productModel.paginate(options.query, { limit: limit ?? 10, page: page ?? 1, sort: options.sort });
        res.status(200).send({ respuesta: 'ok', message: respuesta.docs});
    } catch (error) {
        res.status(400).send({ respuesta: "error en consultar productos", mensaje: error });
    }
});



productRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const prod = await productModel.findById(id);
        if(prod){
            res.status(200).send({respuesta : 'ok', message: prod})
        } else {
            res.status(404).send({respuesta : "Error en encontrar el producto", mensaje: "not found"});
        }
    }catch(error){
        res.status(400).send({respuesta : "error en consultar productos", mensaje: error});
    }
});


productRouter.post('/', async (req, res) => {
    const { title, description, price,code, stock, category } = req.body;
    try {
        const prod = await productModel.create({title, description, price, code, stock, category});

        res.status(200).send({ respuesta: 'ok', mensaje: prod });
        
    } catch (error) {
        res.status(400).send({ respuesta: "error en crear producto", mensaje: error });
    }
})

productRouter.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {title, description, price, code, status, stock, category } = req.body;
    try{
        const prod = await productModel.findByIdAndUpdate(id, {title, description, price, code, status, stock, category });
        if(prod){
            res.status(200).send({respuesta : 'ok', message: 'producto actualizado'})
        } else {
            res.status(404).send({respuesta : "Error en actualizar el producto", mensaje: "error"});
        }
    }catch(error){
        res.status(400).send({respuesta : "error en actualizar productos", mensaje: error});
    }
});

productRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{ 
        const prod = await productModel.findByIdAndDelete (id);
        if(prod){
            res.status(200).send({respuesta : 'ok', message: 'producto eliminado'})
        } else {
            res.status(404).send({respuesta : "Error en eliminar el producto", mensaje: "not found"});
        }
    }catch(error){
        res.status(400).send({respuesta : "error en eliminar productos", mensaje: error});
    }
});




export default productRouter;