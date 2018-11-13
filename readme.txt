Preparation:

- get access to a Kafka Cluster instance; create a topic
- on a host with Node & npm runtime and Java and Maven installed

update KafkaEventProducer.js and  App.java with the Kafka endpoint, port and topic name

in simple-node-kafka-producer
run 
node KafkaEventProducer.js 

to publish a single event to the Kafka topic

in simple-java-kafka-consumer\kafka-consumer

run

mvn package

to build the application

then

mvn exec:java -Dexec.mainClass="nl.amis.kafkaConsumer.App" 

to run the application. It will start the event consumptiopn from Kafka topic

it will continue to read.

Note:
- if you stop the Java consumer
- then publish some more events with the Node producer
- then restart the Java consumer : you will get all events published when the consumer was away

if you change the value of group.id in App.java and rerun the application, you will get all messages on the topic - since the beginning of time
(group.id == consumer group identifier)



