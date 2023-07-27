const amqp = require('amqplib');
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

    async send(msg) {
        try {
            const connection = await amqp.connect(this.url);
            const channel = await connection.createChannel();
            await channel.assertQueue(this.queueSend, {
                durable: false
            });
            console.log("Send: " + JSON.stringify(msg))
            channel.sendToQueue(this.queueSend, Buffer.from(JSON.stringify(msg)));
            setTimeout(function() {
                connection.close();
            }, 500);
        } catch (error) {
            console.error(error);
        }
    },

    async receive() {
        try {
            const connection = await amqp.connect(this.url);
            const channel = await connection.createChannel();
            await channel.assertQueue(this.queueReceive, {
                durable: false
            });
            let res = null

            await new Promise((resolve, reject) => {
                channel.consume(this.queueReceive, (msg) => {
                    res = msg.content.toString()
                    resolve(msg);
                })
            })
            setTimeout(function() {
                connection.close();
            }, 500);
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



