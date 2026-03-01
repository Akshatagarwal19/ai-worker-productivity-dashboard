# -------- Stage 1: Build Frontend --------
FROM node:18 AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# -------- Stage 2: Backend --------
FROM node:18

WORKDIR /app

COPY Backend/package*.json ./Backend/
RUN cd Backend && npm install

COPY Backend ./Backend
COPY --from=frontend-build /app/frontend/dist ./Backend/public

WORKDIR /app/Backend

EXPOSE 5000

CMD ["node", "server.js"]