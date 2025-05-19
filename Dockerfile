FROM node:18

WORKDIR /app

# wait-for.sh 복사
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

# 전체 소스 복사 먼저
COPY . .

# 의존성 설치
RUN npm install

# NestJS 빌드 (dist 생성)
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]