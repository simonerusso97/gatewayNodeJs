var express = require("express");
const mqtt = require("mqtt");

const host = '10.3.141.1'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${port}`
const subTopic = "stat/tasmota_8231A8/POWER1";
var status;

var app = express();

app.listen(3000, () => {
    console.log("server running on port 3000")
});

app.use(
    express.urlencoded({
            extended: true
        }
    )
)

app.use(express.json());

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

client.subscribe(subTopic, () => {
    console.log(`Subscribe to topic '${subTopic}'`)
});




