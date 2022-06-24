# Edamama Test

### Prerequisite

1. Docker
2. Docker Compose
3. NodeJS version 16
4. Yarn

### Setup

1. Run `yarn install`
2. Run the `docker-compose up -d` on the root folder.
3. Run `docker-compose exec mongo mongo --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]});"`
4. Then `cd packages/db`.
5. Please check the video regarding the DB setup.
We need to add the DB manually, add `edamama` as schema name, then add 3 collections:
- users
- products
- usercarts

6. Then `npx prisma db seed`

### Run the backend

1. `cd apps/api/`
2. `yarn start`

### Run the Frontend

1. `cd apps/webapp`
2. `yarn start`
3. Browse `http://localhost:4200`
