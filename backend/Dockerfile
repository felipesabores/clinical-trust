FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

# Usa migrações do Prisma no padrão de Produção
CMD ["sh", "-c", "npx prisma migrate resolve --rolled-back 20260223003847_missing_relations_and_tables || true && npx prisma migrate deploy && npm run start"]
