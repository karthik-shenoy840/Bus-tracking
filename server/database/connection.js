const mongoose = require('mongoose')

function RunServer()
{
    try{
        // ?
        mongoose.connect('mongodb+srv://karthikshenoy48:Wvzy3iKv72ZlTk5B@cluster0.9s3nitn.mongodb.net/bus?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Connected to MongoDB successfully')
        }
    catch(error){
        console.log('mongodb not connected')
    }
}
module.exports = RunServer;