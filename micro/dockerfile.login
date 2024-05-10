#1st stage
FROM golang:1.21.3-bullseye as go-builder

WORKDIR /usr/src/app
EXPOSE 8081
ENV PORT=8081
ENV SERVICE_URL="http://localhost:8080/"
ENV JWT_SECRET="ws-ws-ws-w"

RUN echo "while true; do sleep 1000; done" > /test.sh
CMD ["sh","/test.sh"]

#docker build -t go-builder .
# RUN go mod download && go mod verify && go build -o main .


#2nd stage
# FROM bitnami/minideb:stretch

# WORKDIR /

# COPY --from=go-builder /usr/src/app/main .

# ARG port=9999

# ENV port=${port}\
#     mysql_url="root:password@tcp(localhost:3306)/clinic"\
#     rabbitmq_url="amqp://guest:guest@localhost:5672/"\
#     jwt_secret="ws-ws-ws-wsssssb"

# # EXPOSE ${port}

# CMD [ "./main" ]