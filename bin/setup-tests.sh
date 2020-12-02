#!/bin/bash
set -eo pipefail

cd backend

echo "Launching services"

docker-compose up -d

attempt=0

until docker-compose exec postgres pg_isready; do
  printf '.'
  sleep 2
  attempt=$(( $attempt + 1 ))
  if [ $attempt -gt 15 ]; then
    echo "Services not ready - too many attempts, quitting"
    exit 1
  fi
done

echo "Services ready"

echo "Creating Kafka topics"

TOPICS=( "exercise" "user-points-batch" "user-course-progress-batch" "user-points-realtime" "user-course-progress-realtime" )
for TOPIC in ${TOPICS[@]};
do
  docker exec -it backend_kafka_1 bin/kafka-topics.sh --create --topic $TOPIC --if-not-exists --bootstrap-server 0.0.0.0:9092
  if [[ $? != 0 ]]; then
    echo -e "Topic $TOPIC already exists"
  fi
done

echo "Done!"

cd ..
