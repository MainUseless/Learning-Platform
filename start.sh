docker build -t go-learn -f dockerfile.login .
docker run -d -p 8081:8081 -e JWT_SECRET="lmaoi" -v ./login:/usr/src/app --name go-learn go-learn

docker build -t jboss-learn -f dockerfile.learn .
docker run -d -v ./learn:/application -e NOTIFICATION_URL="http://localhost:8082/notification" -e AUTH_URL="http://localhost:8081/auth" -p 8080:8080 -p 9990:9990 --name jboss-learn jboss-learn
