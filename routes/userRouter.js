const express=require('express')
const {handleUserSignup}=require('../controllers/user')
const router=express.Router()
router.get('/',(req,res)=>{
    res.send("Welcome User");
})
router.get('/signup',(req,res)=>{
    res.send("Sign up form")
})
router.post('/signup',handleUserSignup)
module.exports=router

