const mongoose=require('mongoose');
const connectDataBase= async ()=>{
    try{
        const connnection=await mongoose.connect('mongodb://127.0.0.1:27017/SlooKin',{
            useNewUrlParser: "true",

        })
        console.log("MongoDB data base connected")
    }catch(error){
        console.log(error);

    }
}

module.exports = connectDataBase;