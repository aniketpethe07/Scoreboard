const express = require('express')
const { register, login, checkAuthorization, profile, getData, getScore } = require('../controllers/userController')
const router = express.Router()

router.route('/').get(async(req, res) => {
    res.render('home')
})

router.route('/getData').post(getData)

router.route('/getScore').get(getScore)
// router.get('/getScore', getScore);

router.route('/register')
.get(async(req, res) => {
    res.render('register')
})
.post(register)

router.route('/login')
.get(async(req, res) => {
    res.render('login')
})
.post(login)

router.route('/profile')
.get(checkAuthorization, async(req, res) => {
    res.render('profile')
})
.post(profile)

module.exports = router