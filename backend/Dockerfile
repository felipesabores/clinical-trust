FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

# Garante que o banco está sincronizado antes de iniciar
# 'db push' é ideal para protótipos e deploys isolados no Dokploy
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run start"]
