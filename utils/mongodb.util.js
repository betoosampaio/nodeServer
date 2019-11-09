
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = process.env.MONGODB;


let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports.ObjectId = ObjectId;

module.exports.find = async (database, collection, obj) => {
    let cli = await MongoClient.connect(url, options);
    let col = cli.db(database).collection(collection);
    let res = await col.find(obj).toArray();
    cli.close();
    return res;
}

module.exports.findOne = async (database, collection, obj) => {
    let cli = await MongoClient.connect(url, options);
    let col = cli.db(database).collection(collection);
    let res = await col.findOne(obj);
    cli.close();
    return res;
}

module.exports.insertOne = async (database, collection, obj) => {
    let cli = await MongoClient.connect(url, options);
    let col = cli.db(database).collection(collection);
    let res = await col.insertOne(obj);
    cli.close();
    return res;
}

module.exports.updateOne = async (database, collection, filter, obj, options) => {
    let cli = await MongoClient.connect(url, options);
    let col = cli.db(database).collection(collection);
    let res = await col.updateOne(filter, obj, options);
    cli.close();
    return res;
}

module.exports.findOneAndUpdate = async (database, collection, filter, obj, options) => {
    let cli = await MongoClient.connect(url, options);
    let col = cli.db(database).collection(collection);
    let res = await col.findOneAndUpdate(filter, obj, options);
    cli.close();
    return res;
}

module.exports.aggregate = async (database, collection, obj) => {
    let cli = await MongoClient.connect(url, options);
    let col = cli.db(database).collection(collection);
    let res = await col.aggregate(obj);
    cli.close();
    return res;
}
