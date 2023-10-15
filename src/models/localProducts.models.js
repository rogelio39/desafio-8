import { v4 as uuidv4 } from 'uuid';

export class Products {
    constructor(title, description, price, code, status, stock, category, thumbnail) {
        this.title = title,
            this.description = description,
            this.price = price,
            this.code = code,
            this.status = status,
            this.stock = stock,
            this.category = category,
            this.thumbnail = thumbnail,
            this.id = uuidv4();
    }

}

