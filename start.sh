cd login
docker build -t go-learn .
docker run -d -p 8081:8081 --net ALL -e JWT_SECRET="lmaoi" -v ./login:/usr/src/app --name go-learn go-learn

cd ../notification
docker build -t python-learn .
docker run -d -p 8082:8082 --net ALL -e AUTH_URL="http://go-learn:8081/auth" --name python-learn python-learn

cd ../learn
docker build -t jboss-learn .
docker run -d -v ./learn:/application --net ALL -e NOTIFICATION_URL="http://python-learn:8082/notification" -e AUTH_URL="http://go-learn:8081/auth" -p 8080:8080 -p 9990:9990 --name jboss-learn jboss-learn
 