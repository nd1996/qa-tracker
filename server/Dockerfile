FROM node:20-alpine

# Install OpenSSL and compatibility libraries required by Prisma engine on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 5000

# Push schema to SQLite, seed default users, and start server
CMD ["sh", "-c", "npx prisma db push && node prisma/seed.js && npm start"]
