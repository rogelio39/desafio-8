import {Schema, model} from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { cartModel } from './carts.models.js';


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: false,
        index : true
    },
    age : {
        type: Number,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    rol:{
        type: String,
        default:'user'
    }

})


userSchema.plugin(paginate); //implementar el metodo paginate en el schema

userSchema.pre('save', async function(next) {
    try{
        const newCart = await cartModel.create({});
        this.cart = newCart._id;
    }catch(error){
        //pateo lo que seria el error a la ruta, y que lo maneje la ruta. 
            next(error); 
    }
})
export const userModel = model('user', userSchema); //userModel seria igual al modelo de mi base de datos.
