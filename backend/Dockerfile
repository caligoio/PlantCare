FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install dependency dulu supaya layer bisa di-cache
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
USER node
CMD ["node", "src/server.js"]
