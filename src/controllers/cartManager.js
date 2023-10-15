
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';


export class Cart {
    constructor() {
        this.id = uuidv4();
        this.products = [];
    }

}
export class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }


    async createCart() {
        try {
            const carts = await this.readProducts();
            const cart = new Cart();
            carts.push(cart);
            await this.writeFile(carts);
            return cart;
        } catch (error) {
            console.log('error', error);
        }
    }

    async readProducts() {
        try {
            const data = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            return data;
        } catch (error) {
            if (error) {
                console.log('error al leer el archivo. Metodo readProducts', error)
                return [];
            }
        }
    }

    async writeFile(data) {
        try {
            const datos = JSON.stringify(data, null, 4);
            await fs.writeFile(this.path, datos, 'utf8');
        } catch (error) {
            console.log('error en metodo writeFile', error)
        }
    }

    async getCartById(id) {
        const carts = await this.readProducts();
        const cartId = carts.find(cart => cart.id === id);
        if (cartId) {
            return cartId;
        } else {
            return false;
        }
    }

    async addProduct(cid, pid) {
        try {
            const carts = await this.readProducts();
            const cart = carts.find(cart => cart.id === cid);
            if (cart) {
                const prodIndex = cart.products.findIndex(prod => prod.id === pid);
                if (prodIndex != -1) {
                    cart.products[prodIndex].quantity++;
                } else {
                    cart.products.push({ id: pid, quantity: 1 });
                }
                await this.writeFile(carts);
                return true;
            } else {
                console.log('carrito no encontrado');
                return false;
            }
        } catch (error) {
            console.log('error al agregar producto', error);
        }
    }

    async getProducts() {
        const carts = await this.readProducts();
        const products = carts.productsCart;
        return products;
    }
}