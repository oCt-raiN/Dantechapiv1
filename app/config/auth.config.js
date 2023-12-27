const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });

const authSchema = Joi.object()
  .keys({
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(8400).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),

  })
  .unknown();

  const { value: authVars, error } = authSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

module.exports = {
   secret: authVars.JWT_SECRET,
   accessExpirationMinutes: authVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: authVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: authVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: authVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  };