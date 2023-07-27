let amqp = require('amqplib');
let functions = require('./functions')
let logger = require('./logger');

module.exports = {

    queueSend: "",
    queueReceive: "",

    async initialize(queueSend, queueReceive, url) {
        try {
            this.queueSend = queueSend
            this.queueReceive = queueReceive
            this.url = url

        } catch (error) {
            console.error(error);
        }
    },

    async createChannel(queueSend, queueReceive) {
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueSend, {
            durable: false
        });
        await channel.assertQueue(queueReceive, {
            durable: false
        });
        /*setTimeout(function() {
            connection.close();
        }, 500);*/
        return channel
    },

    async receive() {
        try {
            let channel = await this.createChannel(this.queueSend, this.queueReceive)
            channel.consume(this.queueReceive, (msg) => {
                let res = msg.content.toString()
                logger.info("Receive from RabbitMQ: ", res)
                this.send(channel, functions.getProcessTaskResult(res))
            })

        } catch (error) {
            console.error(error);
        }
    },

    send(channel, msg) {
        try {
            logger.info("Send to RabbitMQ: ", msg)
            channel.sendToQueue(this.queueSend, Buffer.from(JSON.stringify(msg)));
        } catch (error) {
            console.error(error);
        }
    }
}



