
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB;

let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports.find = async (database, collection, obj) =>{
    let cli = await MongoClient.connect(url, options);
    let col = cli.db(database).collection(collection);
    let res = await col.find(obj).toArray();
    cli.close(); 
    return res;
}

module.exports.insertOne = async (database, collection, obj) =>{
    let cli = await MongoClient.connect(url, options);
    let col = cli.db(database).collection(collection);
    let res = await col.insertOne(obj);
    cli.close(); 
    return res;
}