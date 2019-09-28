
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
            url: this.req.url,
            method: this.req.method,
            httpVersion: this.req.httpVersion,
            query: this.req.query,
            headers: this.req.headers,
            body: this.req.body,
            statusMessage: this.statusMessage,
            statusCode: this.statusCode,
            responseBody: this.responseBody.toString()
        };

        try {
            console.log(log);
        }
        catch{ }
               
    });

    next();

}