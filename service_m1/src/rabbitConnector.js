const amqp = require('amqplib');
module.exports = {

    channel: null,
    queueSend: "",
    queueReceive: "",

    async initialize(queueSend, queueReceive, url) {
        try {
            const connection = await amqp.connect(url);
            this.channel = await connection.createChannel();
            this.queueSend = queueSend
            this.queueReceive = queueReceive

            await this.channel.assertQueue(this.queueSend, {
                durable: false
            });

            await this.channel.assertQueue(this.queueReceive, {
                durable: false
            });
        } catch (error) {
            console.error(error);
        }

    },

    async send(msg) {
        try {
            console.log("send: " + JSON.stringify(msg))
            this.channel.sendToQueue(this.queueSend, Buffer.from(JSON.stringify(msg)));
        } catch (error) {
            console.error(error);
        }
    },

    async receive() {
        try {
            let res = null
            await new Promise((resolve) => {
                this.channel.consume(this.queueReceive, (msg) => {
                    res = msg.content.toString()
                    console.log("Receive: " + res)
                    resolve(msg);
                })
            })
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



