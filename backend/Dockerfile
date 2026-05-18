FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "server.js"]
