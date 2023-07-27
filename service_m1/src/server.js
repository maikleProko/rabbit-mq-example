const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const logger = require("./logger")
const routes = require("./routes/index")
const app = express();
const corsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_HOST || "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
        "Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept,Access-Control-Allow-Origin",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", express.static("public"));
app.use("/", routes);

const port = +process.env.PORT || 1350;

http.createServer(app).listen(port)
logger.info(`Server launched on port ${port}`)

