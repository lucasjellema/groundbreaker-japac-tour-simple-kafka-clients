var kafka = require('kafka-node');

var kafkaConnectDescriptor = "xxx"; // from the Oracle Event Hub - Platform Cluster Connect Descriptor
var topicName = "topic-name";

var Producer = kafka.Producer
var producer;

function initializeKafkaProducer(attempt) {
    try {
        console.log(`Try to initialize Kafka Client at ${kafkaConnectDescriptor} and Producer, attempt ${attempt}`);
        client = new kafka.Client(kafkaConnectDescriptor);
        producer = new Producer(client);
        producer.on('ready', function () {
            console.log("Producer is ready");
        });
        producer.on('error', function (err) {
            //if (err) console.log("failed to create the client or the producer " + JSON.stringify(err));
        })
    }
    catch (e) {
        console.log("Exception in initializeKafkaProducer" + e);
        setTimeout(initializeKafkaProducer, 5000, ++attempt); // try again after 5 secs
    }
}//initializeKafkaProducer

function publishEvent (eventKey, event, topic) {
    payloads = [
        { topic: topic
        , messages: [new kafka.KeyedMessage(eventKey, JSON.stringify(event))]
        , partition: 0 }
    ];
    producer.send(payloads, function (err, data) {
        if (err) {
            console.error("Failed to publish event with key " + eventKey + " to topic " + topic + " :" + JSON.stringify(err));
        }
        console.log("Published event with key " + eventKey + " to topic " + topic + " :" + JSON.stringify(data));
    });
}

initializeKafkaProducer(1);
setTimeout(  function() {publishEvent("SimpleEvent", {
    "eventType": "SimpleJJUGEvent"
    , "message": "one more extra extra special message!"
    , "module": "simple-producer"
    , "timestamp": Date.now()
}, topicName)}, 5000);

console.log("Published Kafka Event of type SimpleJJUGEvent to Event Hub topic "+topicName)