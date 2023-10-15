import 'dotenv/config';
import express from "express";
import multer from "multer";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';


import path from 'path';
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";


import { ProductsManager } from "./controllers/productsManager.js";
import { Products } from './models/localProducts.models.js';

const productManager = new ProductsManager();

//models
import { messageModel } from "./models/messages.models.js";
import { productModel } from './models/products.models.js';


//rutas productos
import localProductsRouter from './routes/localProducts.routes.js';
import productRouter from './routes/products.routes.js';

//rutas carts
import localCartRouter from './routes/localCart.routes.js';
import cartRouter from './routes/cart.routes.js';

//rutas user
import userRouter from './routes/users.routes.js';

//sessions routes
import sessionRouter from "./routes/session.routes.js";


//models


const PORT = 8080;

const app = express();

//VARIABLES GLOBALES

//variable para enviar userEmail por socket.
let userEmail;


//config multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/public/img');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()} ${file.originalname}`)
    }
});

const server = app.listen(PORT, () => {
    console.log(`server on port ${PORT}`);
});


app.use(express.json());
app.use(cookieParser(process.env.SIGNED_COOKIE)) // La cookie esta firmada
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, //Establezco que la conexion sea mediante URL
            useUnifiedTopology: true //Manego de clusters de manera dinamica
        },
        ttl: 60 //Duracion de la sesion en la BDD en segundos

    }),
    secret: process.env.SESSION_SECRET,
    resave: false, //Fuerzo a que se intente guardar a pesar de no tener modificacion en los datos
    saveUninitialized: false //Fuerzo a guardar la session a pesar de no tener ningun dato
}))
app.use(express.urlencoded({ extended: true }));

//inicializamos la estrategia
initializePassport();
//para que funcione passport en toda la aplicacion
app.use(passport.initialize());
//inicializamos las sesiones. Hacemos que maneje lo que seria de las sesiones
app.use(passport.session());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
const upload = multer({ storage: storage });
//ruta para imagenes

//aqui se deben concatenar las rutas.
app.use('/static', express.static(path.join(__dirname, '/public')));


//conectando mongoDB atlas con visual studio code.
mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('DB is connected');

    }).catch(() => console.log('error en conexion a DB'));


//server socket.io
const io = new Server(server);
//lado del servidor
io.on('connection', async (socket) => {
    console.log('servidor Socket.io connected');

    //productos en tiempo real

    //se consulta los productos existentes
    const productos = await productManager.getProducts();
    socket.emit('prods', productos);

    socket.on('nuevoProducto', async (nuevoProd) => {
        const { title, description, price, code, stock, category } = nuevoProd;
        const newProduct = new Products(title, description, price, code, true, stock, category, []);
        productManager.addProduct(newProduct);
        socket.emit('prod', newProduct);
    });



    //chat handlebars

    // Consulta los mensajes existentes en la base de datos
    try {
        const messagesView = await messageModel.find();
        socket.emit('messagesView', messagesView);
    } catch (error) {
        console.log('Error al consultar mensajes:', error);
    }

    socket.on('message', async (messageInfo) => {
        const { email, message } = messageInfo;
        try {
            await messageModel.create({ email, message });
            const messages = await messageModel.find();
            userEmail = messages.email;
            socket.emit('messages', messages);
        } catch (error) {
            console.log('error', error);
        }
    })

})



//routes productos
app.use('/api/localProducts', localProductsRouter);

//routes cart
app.use('/api/localCarts', localCartRouter);

//routes users 
app.use('/api/users', userRouter);

//routes products con mongo
app.use('/api/products', productRouter);


//routes carts con mongo
app.use('/api/carts', cartRouter);

//routes de session
app.use('/api/sessions', sessionRouter);


app.get('/static/login', async (req, res) => {

    if(!req.session.user){    
    res.render('login', {
        css: "login.css",
        title: "login",
        js: 'login.js'

    })
    } 
});

app.get('/static/register', async (req, res) => {

    res.render('register', {
        css: "register.css",
        title: "register",
        js: 'register.js'

    })
});


app.get('/static/products', async (req, res) => {


    try {
        const products = await productModel.paginate({});
        const productsJSON = products.docs.map(producto => {
            return {
                _id: producto._id.toString(),
                title: producto.title,
                description: producto.description,
                price: producto.price,
                stock: producto.stock,
            };
        });

        if (req.session.user) {
            res.render('products', {
                css: 'products.css',
                js: 'logout.js',
                products: productsJSON,
                name: req.session.user.first_name,
                lastName: req.session.user.last_name
            })
        } else {
            res.render('accessDenied');
        }

    } catch (error) {
        console.log(error);
    }

})



//este es el endpoint en el que me voy a conectar a mi aplicacion
app.post('/upload', upload.single('product'), (req, res) => {
    res.status(200).send('imagen cargada');
})


