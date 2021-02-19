import { KafkaConsumer } from "node-rdkafka"

export default function checkConnectionInInterval(consumer: KafkaConsumer) {
  let minutesDisconnected = 0
  setInterval(() => {
    if (consumer.isConnected()) {
      minutesDisconnected = 0
      return
    }
    console.log(`Consumer disconnected for ${minutesDisconnected} minutes`)
    if (minutesDisconnected >= 5) {
      // Lets exit the process so that process can be restarted
      process.exit(-1)
    }
    minutesDisconnected += 1
  }, 1000)
}
