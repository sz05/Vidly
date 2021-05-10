const {User} = require('../models/user');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
// const config = require('config') 

// if(!config.get('jwtPrivateKey')){
//     console.error("FATAL ERROR: jwtPrivateKey undefiened")
//     process.exit(1)
// }

router.post('/', async (req, res) => {
 const { error} = validateR(req.body)
 if(error) {
     res.status(400).send(error.details[0].message)
 }

 let user = await User.findOne({ email: req.body.email});
 if(!user) res.status(400).send('Invalid user or password')

 const validPass = await bcrypt.compare(req.body.password, user.password)
 if(!validPass) return res.status(400).send('Invalid user or password')

    const token = user.generateAuthToken();

    res.send(token)
});

function validateR(req){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })

    return schema.validate(req)
}

module.exports = router;
