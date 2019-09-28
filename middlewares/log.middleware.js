
const MongoClient = require('mongodb').MongoClient;

module.exports = (req, res, next) => {
    let start = new Date();
    let originalSend = res.end;

    res.end = function (body) {
        originalSend.call(this, body);
        this.responseBody = body;
    }

    res.on("finish", function () {
        let responseTime = new Date() - start;
        let log = {
            start: start,
            responseTime: responseTime,
            ip: this.req.ip,
            hostname: this.req.hostname,
            originalUrl: this.req.originalUrl,
            path: this.req.path,
            method: this.req.method,
            httpVersion: this.req.httpVersion,
            query: this.req.query,
            headers: this.req.headers,
            body: this.req.body,
            statusMessage: this.statusMessage,
            statusCode: this.statusCode,
            responseBody: this.responseBody.toString(),
            token: this.req.token
        };


        console.log(log);

        let opt = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        MongoClient.connect(process.env.MONGODB_LOG, opt, function (err, client) {
            if (err) return;
            let collection = client.db('logdb').collection('logs');
            collection.insertOne(log, function (err, dbs) {
                client.close();
            });
        });


    });

    next();

}