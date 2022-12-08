const express = require("express");
const app = new express();
const path = require("path");
const { send } = require("process");
const final = require("./final");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

var HTTP_PORT = process.env.PORT || 8080;

var on_http = function(){
    console.log("Express http server listening on " + HTTP_PORT);
}

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "/finalViews/home.html"));
});

app.get("/register", (req, res)=>{
    res.sendFile(path.join(__dirname, "/finalViews/register.html"));
});

app.post("/register", (req, res) => {
    final.register(req.body)
        .then((user) => {
            res.send(`<p>${user.email} registerd successfully</p>
            <a href="/">Go Home</a>`)
        })
        .catch(err => {
            res.send(`<p>Error: ${err}</p>`);
        })
});

app.get("/signIn", (req, res)=>{
    res.sendFile(path.join(__dirname, "/finalViews/signIn.html"));
});

app.post("/signIn", (req, res)=>{
    final.signIn(req.body)
        .then(user => {
            res.send(`<p>${user.email} signed in successfully</p>
            <a href="/">Go Home</a>`)
        })
        .catch(err => {
            res.send(`<p>${err}</p>`);
        });
});

final.startDB()
    .then(() => { app.listen(HTTP_PORT, on_http); })
    .catch(err => { console.log(err) });
