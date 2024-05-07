docker build -t jboss-learn -f dockerfile.mono .
docker run --name jboss-learn -p 8080:8080 jboss-learn