FROM node

WORKDIR /

COPY package*.json ./
COPY . .
RUN npm ci

CMD ["npm", "run", "dev"]