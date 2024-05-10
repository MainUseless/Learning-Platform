docker build -t jboss-learn -f dockerfile.mono .
docker run -v ./mono:/application -p 8080:8080 -p 9990:9990 --name jboss-learn jboss-learn