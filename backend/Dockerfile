FROM node:20-alpine
RUN apk add --no-cache bash ca-certificates tzdata mysql-client postgresql-client
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci --ignore-scripts || npm install --ignore-scripts
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

