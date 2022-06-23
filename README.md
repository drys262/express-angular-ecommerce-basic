# Edamama Test

### Prerequisite

1. Docker
2. Docker Compose
3. NodeJS version 16
4. Yarn

### Setup

1. Run `yarn install`
1. Run the `docker-compose up -d` on the root folder.
1. Then `cd packages/db`.
1. Then `npx prisma db seed`

### Run the backend

1. `cd apps/api/`
2. `yarn start`

### Run the Frontend

1. `cd apps/webapp`
2. `yarn start`
3. Browse `http://localhost:4200`
