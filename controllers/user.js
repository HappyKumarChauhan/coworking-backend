const User=require('../models/user')
const handleUserSignup=async (req,res)=>{
    try{
        const {username,password}=req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
        }
        const newUser=new User({
            username,
            password
        })
        const savedUser = await newUser.save();
        res.status(201).json({newUser});
    }catch(err){
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports={
    handleUserSignup
}