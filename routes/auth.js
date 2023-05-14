require('dotenv').config()
const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken');


const User = require('../models/User')

router.post('/register', async(req, res) => {
    const { username, email, password } = req.body
    if (!(username.length > 6 && username.length < 20)) {
        return res.status(404).json({ success: false, message: 'you must be provide name ok' })
    }
    if (!username || !password || !email) {
        return res.status(404).json({ success: false, message: 'Missing username or password or enail' })
    }

    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: 'da ton tai' })
        }

        const hashpassword = await argon2.hash(password);
        const newUser = new User({ name: username, email, password: hashpassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.ACC_TOKEN);
        res.json({ success: true, message: "da thanh cong", token: token });

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "toi khong the" })

    }

})
router.post('/login', async(req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({ success: false, message: 'Missing email or password' })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: 'khong hop le' })
        }
        if (!await argon2.verify(user.password, password)) {
            return res.status(404).json({ success: false, message: 'khong hop le' })
        }
        const token = jwt.sign({ userId: user._id }, process.env.ACC_TOKEN);
        res.json({ success: true, message: "da thanh cong", token: token });
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "toi khong the" })
    }
})

module.exports = router