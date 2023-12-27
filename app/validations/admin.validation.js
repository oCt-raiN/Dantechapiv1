const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createAdmin = {
  body: Joi.object().keys({
    firstName: Joi.string().required().firstName,
    lastName: Joi.string().required().lastName,
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    
   
  }),
};
const getAdmin = {
    params: Joi.object().keys({
      adminId: Joi.string().custom(objectId),
    }),
  };

module.exports = {
    createAdmin,
    getAdmin,
}