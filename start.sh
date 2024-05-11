docker build -t go-learn -f ./login/dockerfile .
docker run -d -p 8081:8081 -e JWT_SECRET="lmaoi" -v ./login:/usr/src/app --name go-learn go-learn

docker build -t python-learn -f ./notification/dockerfile .
docker run -d -p 8082:8082 -v ./notification:/usr/src/app --name python-learn python-learn

docker build -t jboss-learn -f ./learn/dockerfile .
docker run -d -v ./learn:/application -e NOTIFICATION_URL="http://localhost:8082/notification" -e AUTH_URL="http://localhost:8081/auth" -p 8080:8080 -p 9990:9990 --name jboss-learn jboss-learn
