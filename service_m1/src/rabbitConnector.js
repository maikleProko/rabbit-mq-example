const amqp = require('amqplib');
const logger = require('./logger');

module.exports = {
    channel: null,
    queueSend: "",
    queueReceive: "",
    url: "",

    async initialize(queueSend, queueReceive, url) {
        try {
            this.queueSend = queueSend
            this.queueReceive = queueReceive
            this.url = url

        } catch (error) {
            console.error(error);
        }
    },

    async createChannel(queue) {
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, {
            durable: false
        });
        setTimeout(function() {
            connection.close();
        }, 500);
        return channel
    },

    async send(msg) {
        try {
            const channel = await this.createChannel(this.queueSend)
            logger.info("Send to RabbitMQ: ", msg)
            channel.sendToQueue(this.queueSend, Buffer.from(JSON.stringify(msg)));
        } catch (error) {
            console.error(error);
        }
    },

    async receive() {
        try {
            const channel = await this.createChannel(this.queueReceive)
            let res = null
            await new Promise((resolve, reject) => {
                channel.consume(this.queueReceive, (msg) => {
                    res = JSON.parse(msg.content.toString())
                    resolve(msg);
                })
            })
            logger.info("Receive from RabbitMQ: ", res)
            return res

        } catch (error) {
            console.error(error);
        }
    },

    async process(msg) {
        await this.send(msg)
        return await this.receive()
    },
}



