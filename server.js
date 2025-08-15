const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const nocache = require("nocache"); 

const Email = "swalimohd048@gmail.com";
const Password = "123";
const name = "swali";


app.use(nocache());

app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

function isAuthintication(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
}

function ifLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.redirect('/home');
    } else {
        next();
    }
}


app.get('/', ifLoggedIn, (req, res) => {
    res.render('login',{err:null});
});

app.get('/home', isAuthintication, (req, res) => {
    res.render('home', { name });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (Email === email && Password === password) {
        req.session.user = email;
        res.redirect('/home');
    } else {
        
        res.render('login',{err:"incorrect password or Email "});
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err)=>{
        if(err){
            res.send("logout error")

    }else{
        res.redirect('/')
    }
    })
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
app.get('/error',(req,res,next)=>{
    const err=new Error('it is the costome erroor');
    next(err)
})
app.use((err,req,res,next)=>{
    res.status(500).send('it is the error');
    console.log()
    next()
})