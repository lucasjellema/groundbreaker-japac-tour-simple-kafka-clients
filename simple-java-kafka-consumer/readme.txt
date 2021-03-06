initialize Maven project:

mvn -B archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes 
       -DgroupId=nl.amis.kafkaConsumer -DartifactId=kafka-consumer

cd kafka-consumer

Add properties to force Java 8:
<properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

Add Kafka Maven dependency to pom.xml:

<dependency>
	<groupId>org.apache.kafka</groupId>
	<artifactId>kafka_2.12</artifactId>
	<version>1.0.1</version>
</dependency>

Modify App.java

package nl.amis.kafkaConsumer;

import java.util.Properties;
import java.util.List;
import java.util.ArrayList;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;

public class App {
    public static void main(String[] args) {
        Properties properties = new Properties();
        properties.put("bootstrap.servers", "endpoint-eventhub:6667");
        properties.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        properties.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        properties.put("group.id", "simple-producer-group-2");
        properties.put("auto.offset.reset", "earliest");
        KafkaConsumer kafkaConsumer = new KafkaConsumer(properties);
        List topics = new ArrayList();
        topics.add("topic");
        kafkaConsumer.subscribe(topics);
        try {
            while (true) {
                ConsumerRecords<String, String> records = kafkaConsumer.poll(100);
                for (ConsumerRecord<String, String> record : records)
                    System.out.println(String.format("Topic - %s, Partition - %d, Offset - %d, Value: %s",
                            record.topic(), record.partition(), record.offset(), record.value()));

            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        } finally {
            kafkaConsumer.close();
        }
    }

}


To build :

mvn package

To run:

mvn exec:java -Dexec.mainClass="nl.amis.kafkaConsumer.App" 


