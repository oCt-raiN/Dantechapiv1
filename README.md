# Dantech_api

If just creating api tips:
start and follow the order with the help of other files present

.model.js

<!-- import model in index.js (place it above the profile table) -->

_.service.js
_.controller.js
.routes.js
import route in service.js

    ALTER TABLE `dantech`.`statusdescs`
    CHANGE COLUMN `createdAt` `createdAt` DATETIME NULL ,
    CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NULL ;
    insert into statusdescs (id,statuscode,description) VALUE (1,"WA4000","Waiting");
    insert into statusdescs (id,statuscode,description) VALUE (2,"AC2000","Accepted");
    insert into statusdescs (id,statuscode,description) VALUE (3,"RJ5000","Rejected");

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
INSERT INTO `dantech`.`workflows` (`id`, `workflowid`, `workflowType`) VALUES ('1', 'W0001', 'Crown & Bridge');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('1', 'W0001', '1', 'ST001', 'Mold Creation', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('2', 'W0001', '2', 'ST002', 'Ditching/Die cut', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('3', 'W0001', '3', 'ST003', 'Quality Check', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('4', 'W0001', '4', 'ST004', 'Articulation', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('5', 'W0001', '5', 'ST005', 'Scanning', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('6', 'W0001', '6', 'ST006', 'Designing', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('7', 'W0001', '7', 'ST007', 'Milling', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('8', 'W0001', '8', 'ST008', 'Sintering', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('9', 'W0001', '9', 'ST009', 'Layering / Trimming', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('10', 'W0001', '10', 'ST010', 'Glazing', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('11', 'W0001', '11', 'ST011', 'Production Check', 'Sequential', '1');
INSERT INTO `dantech`.`workflowdetails` (`id`, `workflowid`, `stepid`, `stepcode`, `description`, `workflowType`, `workId`) VALUES ('12', 'W0001', '12', 'ST012', 'Dispatch', 'Sequential', '1');
INSERT INTO `dantech`.`workflowowners` (`id`, `workflowid`, `owner`, `workId`) VALUES ('1', 'W0001', 'Supervisor', '1');

INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('1', 'W0001', 'ST001', 'Plaster team', 'PLS', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('2', 'W0001', 'ST002', 'Plaster team', 'PLS', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('3', 'W0001', 'ST003', 'Plaster team', 'PLS', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('4', 'W0001', 'ST004', 'Plaster team', 'PLS', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('5', 'W0001', 'ST005', 'Designer team', 'DSG', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('6', 'W0001', 'ST006', 'Designer team', 'DSG', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('7', 'W0001', 'ST007', 'Production team', 'PRD', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('8', 'W0001', 'ST008', 'Production team', 'PRD', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('9', 'W0001', 'ST009', 'Ceramic team', 'CER', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('10', 'W0001', 'ST010', 'Ceramic team', 'CER', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('11', 'W0001', 'ST011', 'Ceramic team', 'CER', '1');
INSERT INTO `dantech`.`workflowassigns` (`id`, `workflowid`, `stepid`, `assignmentdept`, `departmentid`, `workId`) VALUES ('12', 'W0001', 'ST012', 'Admin team', 'ADM', '1');

INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('1', 'Varun', 'PLS', 'PLS01');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('2', 'Hari', 'PLS', 'PLS02');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('3', 'Dhamu', 'PLS', 'PLS03');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('4', 'Lakshmi', 'DSG', 'DSG01');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('5', 'Jasvin', 'DSG', 'DSG02');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('6', 'Maharoof', 'DSG', 'DSG03');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('7', 'Sandesh', 'DSG', 'DSG04');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('8', 'Athira', 'DSG', 'DSG05');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('9', 'Sridhar', 'PRD', 'PRD01');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('10', 'Murugesh', 'CER', 'CER01');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('11', 'Ruban', 'CER', 'CER02');
INSERT INTO `dantech`.`assignes` (`id`, `assignee`, `departmentid`, `assigneeid`) VALUES ('12', 'Karthikeya', 'CER', 'CER03');

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
