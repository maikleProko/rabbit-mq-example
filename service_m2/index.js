let amqp = require('amqplib/callback_api');
let functions = require('./functions')
let constants = require('./constants');


function send(queue, msg, amqp) {
    amqp.connect(constants.url, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);

            setTimeout(function() {
                connection.close();
            }, 500);
        });
    });
}


amqp.connect(constants.url, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = constants.queueFirst;

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            var task = JSON.parse(msg.content.toString())
            send(constants.queueSecond, functions.getProcessTaskResult(task), amqp)
        }, {
            noAck: true
        });

    });
});


