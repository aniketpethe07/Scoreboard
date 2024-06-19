require('dotenv').config()
const express = require('express')
const session = require('express-session');

const connectDB = require('./db')
const route = require('./routes/userRoute'); 

const app = express()

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.use(express.static('./public'))

const port = process.env.PORT

app.use('/', route)

connectDB().then(() => 
    app.listen(port, () => {
        console.log(`Server running at ${port}`);
    })
)