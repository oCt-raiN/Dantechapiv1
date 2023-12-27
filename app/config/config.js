const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');


dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    SMTP_HOST: Joi.string().description('SMTP host from env file'),
    SMTP_PORT: Joi.number().description('SMTP port from env file'),
    SMTP_USERNAME: Joi.string().description('SMTP user from env file'),
    SMTP_PASSWORD: Joi.string().description('SMTP password from env file'),
    EMAIL_FROM: Joi.string().description('Email from address from env file'),
    APP_URL: Joi.string().description('Application path from address from env file'),
    SMTP_SERVICE: Joi.string().description('SMTP Service from env file'),
    
})
.unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    email: {
      smtp: {
        service: envVars.SMTP_SERVICE,
        auth: {
          user: envVars.SMTP_USERNAME,
          pass: envVars.SMTP_PASSWORD,
        },
      },
        from: envVars.EMAIL_FROM,
    },
    APP_URL:envVars.APP_URL,
};