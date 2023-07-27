let amqp = require('amqplib/callback_api');
let functions = require('./functions')
let constants = require('./constants');
let logger = require('./logger');


function doAction(queue, amqp, handler) {
    amqp.connect(constants.url, function(error0, connection) {
        if (error0) {
            console.error(error0);
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.error(error1);
                throw error1;
            }

            channel.assertQueue(queue, {
                durable: false
            });

            handler(channel, connection)
        });
    });
}


function send(queue, msg, amqp) {
    doAction(queue, amqp, (channel, connection) => {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        logger.info("Send to RabbitMQ: ", msg)

        setTimeout(function() {
            connection.close();
        }, 500);
    })
}

function receive(queue, amqp) {
    doAction(queue, amqp, (channel, connection) => {
        channel.consume(queue, function(msg) {
            var task = JSON.parse(msg.content.toString())
            logger.info("Receive from RabbitMQ: ", task)
            send(constants.queueSecond, functions.getProcessTaskResult(task), amqp)
        }, {
            noAck: true
        });
    })
}

receive(constants.queueFirst, amqp)


