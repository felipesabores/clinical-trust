FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ARGs are passed at build time
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TENANT_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_TENANT_ID=$NEXT_PUBLIC_TENANT_ID

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
