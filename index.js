var express = require("express");
const mqtt = require("mqtt");

const host = 'localhost';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${port}`;
const subTopic = "stat/tasmota_8231A8/POWER1";

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



app.get("/changeStatusON", (req, res) => {
    const changeStatusTopic = "cmnd/tasmota_8231A8/POWER1";
    client.publish(changeStatusTopic, "ON", { qos: 2, retain: false }, (error) => {
        if (error) {
            console.error(error);
        }
    })
    res.sendStatus(200);
});

app.get("/changeStatusOFF", (req, res) => {
    const changeStatusTopic = "cmnd/tasmota_8231A8/POWER1";
    client.publish(changeStatusTopic, "OFF", { qos: 2, retain: false }, (error) => {
        if (error) {
            console.error(error);
        }
    })
    res.sendStatus(200);
});

app.get("/getStatus", (req, res ) => {
    const getStatusTopic = "cmnd/tasmota_8231A8/Power1"
    let status;
    client.once('message', (subTopic, payload) => {
        return new Promise((resolve, reject) => {
            console.log('Received Message (ON):', subTopic, payload.toString())
            status = payload.toString();
            console.log('status', status);
            res.send(status)
            resolve();
        })
    });
    client.publish(getStatusTopic, "", {qos: 2, retain: false},  (error) => {
        if (error) {
            console.error(error)
        }
    });
});

