const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    firstName: Joi.string().required().firstName,
    lastName: Joi.string().required().lastName,
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    
   
  }),
};
const getUser = {
    params: Joi.object().keys({
      userId: Joi.string().custom(objectId),
    }),
  };

module.exports = {
    createUser,
    getUser,
}