var express = require("express");
const mqtt = require("mqtt");

const host = '172.20.10.4'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${port}`
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

client.on('message', (subTopic, payload) => {
    console.log('Received Message:', subTopic, payload.toString())
})

app.post("/changeStatus", (req, res) => {
    const changeStatusTopic = "cmnd/tasmota_8231A8/POWER1";
    client.publish(changeStatusTopic, req.body.status, { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error)
        }
    })
    res.sendStatus(200)
});

app.get("/getStatus", (req, res ) => {
    const getStatusTopic = "cmnd/tasmota_8231A8/Power1"
    client.publish(getStatusTopic, "", { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error)
        }
    })
    res.sendStatus(200);
});
