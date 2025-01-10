FROM alpine:latest

LABEL authors="Hunter Peart"
RUN apk update && apk add --no-cache openjdk17-jre

RUN java -version

ENTRYPOINT ["top", "-b"]
