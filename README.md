# Dantech_api

If just creating api tips:
start and follow the order with the help of other files present

.model.js

<!-- import model in index.js (place it above the profile table) -->

_.service.js
_.controller.js
.routes.js
import route in service.js

ALTER TABLE `dantech`.`assignes`
CHANGE COLUMN `createdAt` `createdAt` DATETIME NULL ,
CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NULL ;

ALTER TABLE `dantech`.`workflowassigns`
CHANGE COLUMN `createdAt` `createdAt` DATETIME NULL ,
CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NULL ;

ALTER TABLE `dantech`.`workflowdetails`
CHANGE COLUMN `createdAt` `createdAt` DATETIME NULL ,
CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NULL ;

ALTER TABLE `dantech`.`workflowowners`
CHANGE COLUMN `createdAt` `createdAt` DATETIME NULL ,
CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NULL ;

ALTER TABLE `dantech`.`workflows`
CHANGE COLUMN `createdAt` `createdAt` DATETIME NULL ,
CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NULL ;

For more detail, please visit:

> [Build Node.js Rest APIs with Express, Sequelize & MySQL](https://www.bezkoder.com/node-js-express-sequelize-mysql/)

> [Node.js Express File Upload Rest API example](https://www.bezkoder.com/node-js-express-file-upload/)

> [Server side Pagination in Node.js with Sequelize and MySQL](https://www.bezkoder.com/node-js-sequelize-pagination-mysql/)

> [Deploying/Hosting Node.js app on Heroku with MySQL database](https://www.bezkoder.com/deploy-node-js-app-heroku-cleardb-mysql/)

Security:

> [Node.js Express: JWT example | Token Based Authentication & Authorization](https://www.bezkoder.com/node-js-jwt-authentication-mysql/)

Associations:

> [Sequelize Associations: One-to-Many Relationship example](https://www.bezkoder.com/sequelize-associate-one-to-many/)

> [Sequelize Associations: Many-to-Many Relationship example](https://www.bezkoder.com/sequelize-associate-many-to-many/)

Fullstack:

> [Vue.js + Node.js + Express + MySQL example](https://www.bezkoder.com/vue-js-node-js-express-mysql-crud-example/)

> [Vue.js + Node.js + Express + MongoDB example](https://www.bezkoder.com/vue-node-express-mongodb-mevn-crud/)

> [Angular 8 + Node.js + Express + MySQL example](https://www.bezkoder.com/angular-node-express-mysql/)

> [Angular 10 + Node.js + Express + MySQL example](https://www.bezkoder.com/angular-10-node-js-express-mysql/)

> [Angular 11 + Node.js + Express + MySQL example](https://www.bezkoder.com/angular-11-node-js-express-mysql/)

> [Angular 12 + Node.js + Express + MySQL example](https://www.bezkoder.com/angular-12-node-js-express-mysql/)

> [Angular 13 + Node.js + Express + MySQL example](https://www.bezkoder.com/angular-13-node-js-express-mysql/)

> [Angular 14 + Node.js + Express + MySQL example](https://www.bezkoder.com/angular-14-node-js-express-mysql/)

> [React + Node.js + Express + MySQL example](https://www.bezkoder.com/react-node-express-mysql/)

Integration (run back-end & front-end on same server/port)

> [Integrate React with Node.js Restful Services](https://www.bezkoder.com/integrate-react-express-same-server-port/)

> [Integrate Angular with Node.js Restful Services](https://www.bezkoder.com/integrate-angular-10-node-js/)

> [Integrate Vue with Node.js Restful Services](https://www.bezkoder.com/serve-vue-app-express/)

## Project setup

```
npm install
```

### Run

```
node server.js
```
