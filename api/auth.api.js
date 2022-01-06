const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express.Router();
const mongoose = require('mongoose');
const { query } = require('express');
const user = mongoose.model('user');

//Get user api with jwt token '
//redirected to a sample account information page.
//Edit screen to change user entered profile fields.



//edit user profile api
app.post('/edit', (req, res) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'abcd', (err, decoded) => {
            if (err) {
                res.status(401).json({
                    message: 'Invalid token'
                });
            } else {
                user.findOne({
                    _id: decoded.id
                }, (err, user) => {
                    if (err) {
                        res.status(500).json({  
                            message: 'Internal server error'
                        });
                    } else {
                        if (user) {
                            user.firstName = req.body.firstName;
                            user.lastName = req.body.lastName;
                            user.save((err) => {
                                if (err) {
                                    res.status(500).json({
                                        message: 'Internal server error'
                                    });
                                } else {
                                    res.status(200).json({
                                        message: 'User profile updated successfully'
                                    });
                                }
                            });
                        } else {
                            res.status(404).json({
                                message: 'User not found'
                            });
                        }
                    }
                });
            }
        });
    } else {
        res.status(401).json({
            message: 'Invalid token'
        });
    }
});



app.get('/',(req,res)=>{
    const token = req.headers['authorization'];
    console.log(token);
    if(!token){
        return res.status(401).send({message:'Unauthorized request 1'});
    }  
    try{    
        const decoded = jwt.verify(token,'abcd');
        user.findOne({_id:decoded.id}).then((user)=>{
            if(!user){
                return res.status(401).send({message:'Unauthorized request 2'});
            }
            return res.status(200).send(user);
        })
    }   
    catch(err){
        return res.status(401).send({message:'Unauthorized request 3'});
    }
})

app.post('/register',(req,res)=>{
    console.log(req.body)
    user.findOne({
        emailId:req.body.emailId
    }).then(async (data) => {
        if(!data){
            let password = await bcrypt.hash(req.body.password,10)
            let User = new user({
                password: password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                emailId: req.body.emailId,
                
            })
            User.save().then(doc => {
                if(doc){
                    res.json({
                        status: true,
                        message: "User registered succefully!"
                    })
                }else{
                    res.json({
                        status: false,
                        message: "Something went wrong"
                    })
                    console.log(doc)
                }
            })
        }else{
            res.json({
                status: false,
                message: "User already exist"
            })
        }

    }).catch(err => {
        res.json({
            status: false,
            message: "Something went wrong"
        })
        console.log(err)
    })

})

app.post('/login',(req,res) => {
    user.findOne({
        emailId:req.body.emailId
    }).then(async (data) => {
        if(data){
            bcrypt.compare(req.body.password, data.password, (err,result) => {
                if(result){
                    let userPayload = {
                        emailId: data.emailId,
                        id : data._id,
                      
                    }
                    jwt.sign(userPayload, "abcd" ,(err,token) => {
                        if(err){
                            res.json({
                                status: false,
                                message: "Incorrect Username or Password!"
                            })
                        }else{
                            res.json({
                                status: true,
                                message: "Logged in Successfully!",
                                token: token
                            })
                        }
                    })
                }
                else{
                    res.json({
                        status: false,
                        message: "Incorrect Username or Password!"
                    }) 
                }
            })
        }else{
            res.json({
                status: false,
                message: "Incorrect Username or Password!"
            })
        }
    }).catch(err => {
        res.json({
            status: false,
            message: "Something went wrong"
        })
    })
})


module.exports = app