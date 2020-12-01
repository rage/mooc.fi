export const queueProducerMessage = jest.fn()
export const disconnect = jest.fn()
export const kafkaProducer = jest.fn(() => ({
  queueProducerMessage,
  disconnect,
}))

const mock = jest.fn().mockImplementation(kafkaProducer)

export default mock
