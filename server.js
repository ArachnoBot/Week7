const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const session = require("express-session")
const cookies = require("cookie-parser");

app.use(cookies());
app.use(express.json())
app.use(session({
    secret: "bjkhguyjkasefjilnsfdjhgvzsc",
    resave: false,
    saveUninitialized: false
}))

app.listen(3000)

app.use(passport.initialize())
app.use(passport.session())

const initPassport = require("./passportConfig")
initPassport(passport, getUserByUsername, getUserById)

const users = []

const todos = []

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.post("/api/user/register", checkNotAuthenticated, async (req, res) => {
    try {
        const double = users.find(user => user.username == req.body.username)
        if (double) {
            return res.sendStatus(400)
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        newUser = {
            id: Date.now().toString(),
            username: req.body.username,
            password: hashedPassword
        }
        users.push(newUser)
        console.log(users)
        res.send(newUser)
    } catch {
        res.send("shit's fucked")
    }
})

app.get("/api/user/list", (req, res) => {
    res.send(users)
})

app.post('/api/user/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: "/success",
    failureRedirect: "/failure",
}))

app.get("/success", (req, res) => {
    // Isnt this already done automatically?
    res.cookie("connect.sid", req.cookies["connect.sid"]).sendStatus(200)
})

app.get("/failure", (req, res) => {
    res.sendStatus(401)
})

app.get("/api/secret", checkAuthenticated, (req, res) => {
    res.sendStatus(200)
})

app.post("/api/todos", checkAuthenticated, (req, res) => {
    const userId = req.session.passport.user
    const todoList = todos.find(todo => todo.id == userId)

    if (todoList) {
        todoList.todos.push(req.body.todo)
    } else {
        todos.push({
            id: userId,
            todos: [req.body.todo]
        })
    }
    res.send(req.body.todo)
})

app.get("/api/todos/list", checkAuthenticated, (req, res) => {
    res.send(todos)
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("passed")
        return next()
    }
    return res.sendStatus(401)
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("stop")
        return res.redirect("/")
    }
    return next()
}

function getUserByUsername(username) {
    return users.find(user => user.username == username)
}

function getUserById(id) {
    return users.find(user => user.id == id)
}