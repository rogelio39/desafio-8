import { Router } from "express";
import { CartManager } from "../controllers/cartManager.js";
import { ProductsManager } from "../controllers/productsManager.js";

const localCartRouter = Router();
const productManager = new ProductsManager();
const cart = new CartManager('./cart.json');


localCartRouter.post('/', async (req, res) => {
    try {
        await cart.createCart();
        const newCart = await cart.getProducts();
        res.status(200).send(`Carrito creado con exito ${JSON.stringify(newCart, null, 4)}`);
    } catch (error) {
        res.status(500).send('error');
    }
});


localCartRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartProds = await cart.getCartById(cid);
        if (cartProds) {
            res.status(200).send(cartProds);
        } else {
            res.status(404).send('not found');
        }
    } catch (error) {
        res.status(500).send('error al cargar carrito');
    }
})




localCartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartProds = await cart.getCartById(cid);
        if (cartProds) {
            const productsFromJson = await productManager.getProducts();
            const productJson = productsFromJson.find(prod => prod.id ===  parseInt(pid));
            const prodCreated =  await cart.addProduct(cid, parseInt(pid));
            if (productJson) {
                res.status(404).send('Ya existe un producto en base de datos con ese id');
            } else if(prodCreated){
                res.status(200).send(`producto agregado con exito`);
            } else {
                res.status(400).send('error al agregar producto');
            }
        } else {
            res.status(400).send('Carrito no existe');
        }
    } catch (error) {
        res.status(500).send('error');
    }
});





export default localCartRouter;