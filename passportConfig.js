const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initPassport(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username)
        if (!user) {
            console.log("no user")
            return done(null, false)
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log("authenticated")
                return done(null, user)
            } else {
                console.log("nice try")
                return done(null, false)
            }
        } catch(err) {
            return done(err)
        }
    }
    passport.use(new LocalStrategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initPassport