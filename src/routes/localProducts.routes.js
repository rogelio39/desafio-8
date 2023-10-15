import {Router} from "express";
import { ProductsManager } from "../controllers/productsManager.js";
import { Products } from "../models/localProducts.models.js";


const productManager = new ProductsManager();

async function addProduct(prod) {
    const { title, description, price, code, stock, category } = prod;
    const newProduct = new Products(title, description, price, code, true, stock, category, []);
    await productManager.addProduct(newProduct);
    return newProduct;
}


const localProductsRouter = Router();


localProductsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const { limit } = req.query;
        if (limit) {
            const prod = products.slice(0, limit);
            res.status(200).send(prod);
        } else {
            res.status(200).send(products);
        }
    } catch (error) {
        res.status(500).send('error al cargar productos', error);
    }
})  



localProductsRouter.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        console.log(id);
        const product = await productManager.getProductById(id);

        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send('Producto no existente');
        }
    } catch (error) {
        res.status(500).send('error', error);
    }
});


localProductsRouter.post('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const prod = products.find((product) => product.code === req.body.code);

        if (prod) {
            res.status(400).send("producto existente");
        } else {
            await addProduct(req.body);
            res.status(200).send('producto creado con exito');
        }
    } catch (error) {
        res.status(500).send('error', error);
    }
});


localProductsRouter.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deletedProd = await productManager.deleteProduct(id);

        if (!deletedProd) {
            res.status(200).send("producto eliminado correctamente");
        } else {
            res.status(400).send('error al eliminar producto');
        }
    } catch (error) {
        res.status(500).send('error', error);
    }
});




export default localProductsRouter;