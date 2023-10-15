import {Schema, model} from 'mongoose';


const cartSchema = new Schema({
    products: {
        type: [
            {
                id_prod : { 
                    type : Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: function () {
            return  [];
        }
    }
})


//lo que hago es definir que cada vez que me hagan una consulta con findOne trabaje directamente con populate
cartSchema.pre('findOne', function() {
    this.populate('products.id_prod'); 
})


export const cartModel = model('carts', cartSchema)

