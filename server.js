const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const session = require("express-session")

app.use(express.json())
app.use(session({
    secret: "bjkhguyjkasefjilnsfdjhgvzsc",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const initPassport = require("./passportConfig")
initPassport(passport, getUserByUsername, getUserById)

users = [{
    id: '1701619424019',
    username: 'chuck',
    password: '$2b$10$gq1DSCYzxIuahW1J3Kj6weXWmZavh6IFRY707leYYddMckk.enlW6'
}]

app.post("/api/user/register", async (req, res) => {
    try {
        double = users.find(user => user.username == req.body.username)
        if (double) {
            return res.sendStatus(400)
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
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

app.post('/api/user/login', passport.authenticate('local', {
    successRedirect: "/success",
    failureRedirect: "/failure",
}))

app.get("/success", (req, res) => {
    res.sendStatus(200)
})

app.get("/failure", (req, res) => {
    res.sendStatus(401)
})

app.listen(3000)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("passed")
        return next()
    }
    return res.sendStatus(401)
}


function getUserByUsername(username) {
    return users.find(user => user.username == username)
}

function getUserById(id) {
    return users.find(user => user.id == id)
}