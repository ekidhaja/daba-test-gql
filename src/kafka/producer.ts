import { Kafka, Producer, Message } from "kafkajs";

class KafkaProducer {
	private producer: Producer;

	constructor(
		brokers: string[],
		ssl: boolean,
		sasl: { mechanism: "plain"; username: string; password: string }
	) {
		const kafka = new Kafka({
			clientId: "my-producer",
			brokers,
			ssl,
			sasl,
		});

		this.producer = kafka.producer();
	}

	public async connect(): Promise<void> {
		await this.producer.connect();
	}

	public async disconnect(): Promise<void> {
		await this.producer.disconnect();
	}

	public async produceMessage(topic: string, key: string, value: any): Promise<void> {
		const message: Message = {
			key,
			value: JSON.stringify(value),
		};

		await this.producer.send({
			topic,
			messages: [message],
		});

		console.log("Message sent successfully");
	}
}

export async function publishMessage(topic: string, key: string, message: any) {
	const producer = new KafkaProducer(
		["https://pkc-ymrq7.us-east-2.aws.confluent.cloud:443"],
		true,
		{
			mechanism: "plain",
			username: "Y4UTATE6L7ZZUVH3",
			password: "nHRJ4SLjSk3ghWCRAIIMF1MGwvIHUrODg8HPcZKCcowiDtXhwmDpF5eISIEmgnM0",
		}
	);

	await producer.connect();

	// Publish transaction as a message to Kafka
	await producer.produceMessage(topic, key, message);

	await producer.disconnect();

	console.log("Transaction inserted and message published");
}
