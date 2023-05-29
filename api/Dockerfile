FROM node:18.16.0 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm i

COPY . .

RUN npm run build

FROM node:18.16.0

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/ ./prisma

EXPOSE 3000

CMD [ "npm", "run", "start:prisma:dev" ]
