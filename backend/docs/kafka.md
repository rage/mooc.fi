{"name":"RDD","id":"b925ec4a-4c68-41ad-9fce-0bb6f3f480b1","part":2,"section":0,"max_points":1,"deleted":false}{"name":"RDD","id":"b925ec4a-4c68-41ad-9fce-0bb6f3f480b1","part":2,"section":0,"max_points":1,"deleted":false}`Feel free to edit this documentation for better language`
# Kafka
https://kafka.apache.org/intro
>Apache Kafka® is a distributed streaming platform. 
> 
>A streaming platform has three key capabilities:
>
>   * Publish and subscribe to streams of records, similar to a message queue or enterprise messaging system.
>   * Store streams of records in a fault-tolerant durable way.
>   * Process streams of records as they occur. 

Kafka is a excellent tool for building data pipelines because it minimizes data loss and is fault-tolerant. When a producers submits data to Kafka, Kafka stores the data and keeps it as long as it is set to keep it. Now if a consumer is offline when the data is submitted, the data will not be lost and can be consumed when the consumer comes online. **Kafka does not know nor care if the data is consumed by some consumer.** Consumers have to store this information themselves (but this data can be submitted to server or just store locally). This can be done with `committing offsets`.

mooc.fi uses Kafka for real-time data pipeline between different `services` and mooc.fi. Services `produce` data for Kafka server for a specific `topic`. Points `consumes` those topics and processed data when it occurs or as fast as points can. Points also produces data to different topics, which services are consuming.

## Topics, partitions and consumer groups
A topic in Kafka is like a channel in your television. Producer produces data to a specific topic and does not know or care how many consumers are consuming. Consumers choose which topics to watch and get all data from those topics. (But unlike in kafka, in television there is no server between producer and consumer so unconsumed data will be lost.)

A topic can be divided in n `partitions`. When a message is produced it will be pushed to one partition and will be received only by those consumers that are listening to that partition. This allows effective distributing of consumers and prevents that one message is consumed multiple times by different consumers (if wanted so).

If you want some consumers to listen the same partition but not all, you can use `consumer groups`. You assign specific consumers to a specific group and that group will listen some partition and all consumers in that group will get all messages from that partition.

Kafka will (unless told not to) assign partitions automatically and will `rebalance` every time new consumer joins or some leaves. If there are less consumers (or consumer groups) than there are partitions Kafka will assign multiple partitions to one consumer. If there are equal number if consumers and partitions, each consumer will have exactly one partition. If there are more consumers than there are paritions, some consumers will idle.

Kafka cluster will mirror topics/partitions to multiple brokers for better fault-tolerancy. One of the brokers will act as a leader for some partition and mirror others. The leader is in charge and mirros are for backup. If the leaders goes down, one mirror will take the role.

What is the right amount of partitions per topic? According to `Jun Rao` in https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster you need at least `max(t/p, t/c)` partitions where `p` is production troughout with one partition, `c` is same for consuption and `t` is your target troughput. You can read more in his blog post linked above.

## Commits
In Kafka, committing means storing which message is the latest that has been processed by a specific consumer. This is done by saving the message offset. Originally offset was saved locally to a file but in newer versions of kafka it is possible to commit to server. Server will save the submitted offset per consumer.

Keep in mind that you can only commit the latest offset so any message with smaller offset is considered to be committed even if you use function like commitMessage(message).

Committing can be rather heavy operation to be used after every message. This is why we have defined `commit interval` and set it to `100`. We wont commit every message but once in 100 messages. The downside is that if our consumer goes down it will re-handle some messages. However this should not cause problems because we include a timestamp with every message and wont save anything to database if messages timestamp is older than latest timestamp in database.

### Autocommit
Some libraries allow to use autocommit feature. Autocommit with commit every message, once in n seconds or once in n messages, depending on the setup. The problem with autocommit is that it commits all consumed messages, not those that have been handled. This may cause data loss.


---
>From a certain point onward there is no longer any turning back. That is the point that must be reached.  
> ~ Franz Kafka
---
## In Points.mooc.fi

At the moment we have six topics in mooc.fi kafka:

* user-course-progress-realtime
* user-course-progress-batch
* user-points-realtime
* user-points-batch
* exercise
* course

First sive are meant to be consumed by us and the last is produced by us. The topics ending with `-realtime` are meant for events that are supposed to processed right away. The topics ending with `-batch` are for events don't have to be processed right away. Use the batch topics if you're going to produce a large number of events

---
### user-course-progress-realtime / user-course-progress-batch
`Current message format version is: 1`  

This is for submitting users progress in a specific course from a specific service. In typescript the message format looks like this: 
```Typescript
export interface Message {
  timestamp: string
  user_id: number
  course_id: string
  service_id: string
  progress: [PointsByGroup]
  message_format_version: Number
}

export interface PointsByGroup {
  group: string
  max_points: number
  n_points: number
  progress: number
}
```

Description of message format version `1`:  

Message  :
| varibale | description | more info |
| ----------|----------------------------|----|
| timestamp | when the message was sent | |
| user_id   | user id from tmc | can be queryed from tmc api with email |
| course_id | course id from points db | this is broadcasted in kafka topic courses when a course is created
| service_id | service_id from points db | each service has one id and this should be stored in services own db
| progress | Array of PointsByGroup | see below
| message_format_version | which version of message format is used | messages with wrong number are not processed

PointsByGroup:  
| variable | description | more info |
| -------- | ----------- | --------- |
| group |
| max_points | groups max points
| n_points | how many points user have
| progress | users progress | `(n_points/max_points)` usually

---
### exercise
`Current message format version is: 1`  

This is for submitting services exercise data to points. (What exerices are in a course). You provide us a list
of exercises and we add them to our db. We will delete existing exercies if they are not included in newest exercise update.
In typescript the message format is: 
```Typescript
export interface Message {
  timestamp: string
  course_id: string
  service_id: string
  data: [ExerciseData]
  message_format_version: Number
}

export interface ExerciseData {
  name: string
  id: string
  part: Number
  section: Number
  max_points: Number
}
```

Description of message format version `1`:

Message:

| variable | description | more info |
| -------- | ----------- | --------- |
| timestamp | when the message was sent |
| course_id | course id from points db | this is broadcasted in kafka topic courses when a course is created
| service_id | service_id from points db | each service has one id and this should be stored in services own db
| data | Array of exercises (ExerciseData) | see below
| message_format_version | which version of message format is used | messages with wrong number are not processed

ExerciseData:

| variable | description | more info |
| -------- | ----------- | --------- |
| name | Exercise name | service chooses the name
| id | any string | service chooses the exercise id (for identifying exercises, keep it consistent!)
| part | which part of the course
| section | which section of the part
| max_points | exercises max points

---
### user-points-realtime / user-points-batch
`Current message format version is: 1`

This is for submitting users points in single exercise.

In typescript the message format is:
```Typescript
export interface Message {
  timestamp: string
  exercise_id: string
  n_points: Number
  completed: boolean
  attempted: boolean
  user_id: Number
  course_id: string
  service_id: string
  required_actions: [string]
  message_format_version: Number
}
```

Description of message format version `1`:

Message: 

| variable | description | more info |
| -------- | ----------- | --------- |
| timestamp | when the message was sent |
| exercise_id | string for identifying the exercise | see exercise topic ExerciseData.id
| n_points | how much points user has currently 
| completed | is the exercise completed or not
| user_id | user id from tmc | can be queryed from tmc api with email
| course_id | course id from points db | this is broadcasted in kafka topic courses when a course is created
| service_id | service_id from points db | each service has one id and this should be stored in services own db
| required_actions | what user needs to do to complete the exercise | this field is optional
| message_format_version | which version of message format is used | messages with wrong number are not processed









