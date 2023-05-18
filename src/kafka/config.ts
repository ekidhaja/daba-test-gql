import fs from "fs";
import Kafka from "node-rdkafka";

function readConfigFile(fileName: any) {
	const data = fs.readFileSync(fileName, "utf8").toString().split("\n");
	return data.reduce((config: any, line: any) => {
		const [key, value] = line.split("=");
		if (key && value) {
			config[key] = value;
		}
		return config;
	}, {});
}

const producer: any = new Kafka.Producer(readConfigFile("client.properties"));
producer.connect();
producer.on("ready", () => {
	producer.produce("my-topic", -1, Buffer.from("value"), Buffer.from("key"));
});

// const config: any = readConfigFile("client.properties");
// config["group.id"] = "node-group";

// const consumer = new Kafka.KafkaConsumer(config, { "auto.offset.reset": "earliest" });
// consumer.connect();
// consumer
// 	.on("ready", () => {
// 		consumer.subscribe(["my-topic"]);
// 		consumer.consume();
// 	})
// 	.on("data", (message) => {
// 		console.log("Consumed message", message);
// 	});
