FROM alpine:3.20
RUN apk update && apk add --no-cache bash ca-certificates curl tzdata mysql-client postgresql-client dcron
WORKDIR /app
COPY crontab /etc/crontabs/root
COPY scripts/ /app/scripts/
RUN chmod +x /app/scripts/*.sh
CMD ["crond", "-f", "-l", "8"]

