import {Schema, model} from 'mongoose';
import paginate from 'mongoose-paginate-v2';


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
    rol:{
        type: String,
        default:'user'
    }

})


userSchema.plugin(paginate); //implementar el metodo paginate en el schema

export const userModel = model('user', userSchema); //userModel seria igual al modelo de mi base de datos.

