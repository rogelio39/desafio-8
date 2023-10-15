import { promises as fs } from 'fs';


export class ProductsManager {
    constructor() {
        this.path = './productos.json';
    }

    async writeProducts(data) {
        const datos = JSON.stringify(data, null, 4);
        await fs.writeFile(this.path, datos, 'utf8');
    }

    async readProducts() {
        try {
            const data = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            return data;
        } catch (error) {
            if (error) {
                return [];
            }
        }
    }

    async addProduct(product) {
        try {
            const products = await this.readProducts();
            //verificar si existe el producto
            const existingProduct = products.find(prod => prod.code === product.code);
            if (existingProduct) {
                throw new Error('el producto ya existe');
            } else {
                products.push(product);
                console.log('producto agregado');
                await this.writeProducts(products);
            }
        } catch (error) {
            console.error('error al agregar el producto');
        }

    }

    async updatedProduct(productId, propertyName, newValue) {
        try {
            const products = await this.readProducts()
            const productToUpdate = products.find((prod) => prod.id === productId);
            if (!productToUpdate) {
                throw new Error('producto no encontrado');
            } else {
                productToUpdate[propertyName] = newValue;

                const index = products.findIndex((prod) => prod.id === productId);
                if (index !== -1) {
                    products[index] = productToUpdate;
                    await this.writeProducts(products);
                }
            }
        } catch (error) {
            console.error('error', error.message);
        }
    }

    async getProductById(id) {
        const products = await this.readProducts()
        const productId = products.find((prod) => prod.id === id);
        console.log(productId)
        if (productId) {
            console.log('producto encontrado')
            console.log(productId);
            return productId;
        } else {
            console.log('Producto no encontrado');
            return null;
        }
    }

    async getProducts() {
        try{
            const products = await this.readProducts();
            // console.log(products)
            return products;
        } catch(error){
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.readProducts();
            const product = products.find((prod) => prod.id === id);
            if (product) {
                const prodsToDelete = products.filter(prod => prod.id !== id);
                await this.writeProducts(prodsToDelete);
            }
        } catch (error) {
            console.error('error', error);
        }
    }
}










