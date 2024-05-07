docker build -t jboss-learn -f dockerfile.mono .
docker run -d --name jboss-learn -v ./mono:/application -p 8080:8080 jboss-learn