const express = require('express');
const dashboardRouter = require('./routes/dashboard');
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("home", { title: "Home" });
});

app.use('/dashboard', dashboardRouter);

app.listen(3000);