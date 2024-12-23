const mongoose=require('mongoose');
const connectToMongo=(URI)=>{
    return mongoose.connect(URI);
}
module.exports={
    connectToMongo
}