const mongoose=require('mongoose');
const connectDataBase= async ()=>{
    try{
        const connnection=await mongoose.connect('mongodb://127.0.0.1:27017/SlooKin',{
            useNewUrlParser: "true",

        })
    }catch(error){
    }
}

module.exports = connectDataBase;