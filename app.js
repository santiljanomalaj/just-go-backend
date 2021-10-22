const path = require('path');

const  fs = require('fs')

const http  = require('http')

const mongoose = require('mongoose');

const express = require('express');

require('dotenv').config()

const bodyParser = require('body-parser');

const app = express();

const cors = require('cors')

const helmet = require('helmet')

const  morgan = require('morgan')
 

const authRoutes = require('./routes/auth');

const userRoutes = require('./routes/user');

const categoryRoutes = require('./routes/category');

const productRoutes = require('./routes/product');

const orderRoutes = require('./routes/order');

const paymentRoutes = require('./routes/payment');

const paymentStripeRoutes = require('./routes/payment_stripe');

const sectionRoutes = require('./routes/section');

const statsRoutes = require('./routes/stats');

const configRoutes = require('./routes/config');



const smsRoutes = require('./routes/sms')
const MONGODB_URI =`mongodb+srv://${process.env.MONOG_USERNAME}:${process.env.MONGO_PSWD}@cluster0.cm2ar.mongodb.net/${process.env.MONGO_DB}?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`

let whitelist = ['https://justgodelivery.com', 'http://justgodelivery.com'];
let corsOptions = {
    origin: function (origin, callback) {
          if (whitelist.indexOf(origin) !== -1) {
                  callback(null, true);
                } else {
                        callback(null, false);
                      }
        },
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(bodyParser.json()); 
app.use(cors(corsOptions));
app.options('*', cors());
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept");

    next();
})

app.use(authRoutes);
app.use(userRoutes);
app.use(categoryRoutes)
app.use(productRoutes)
app.use(orderRoutes)
app.use(paymentRoutes)
app.use(paymentStripeRoutes)
app.use(sectionRoutes)
app.use(smsRoutes)
app.use(statsRoutes)
app.use(configRoutes)

const accessLogStram = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
)

app.use(helmet())
app.use(morgan('combined', {stream: accessLogStram}))

app.use('/static',express.static(path.join(__dirname, 'images')));

app.use((err, req, res, next)=>{
    if(!err.statusCode)
    err.statusCode = 500
    
    res.status(err.statusCode).json({msg: err.message || 'Something Went wrong'})
})
mongoose.connect(MONGODB_URI)
    .then(result=>{
        app.listen(process.env.PORT || 3000)
    })
    .catch(err=>{
        console.log(err)
    })
