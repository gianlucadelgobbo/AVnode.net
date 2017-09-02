const Joi = require('joi');
const Boom = require('boom');
const _ = require('lodash');

module.exports.validate = function(schema) {
  return function validateRequest(req, res, next) {
    if (!schema) {
      return next();
    }
    let params = {};
    ['params', 'body', 'query'].forEach(function (key) {
      if (schema[key]) {
        params[key] = req[key];
      }
    });
    return Joi.validate(params, schema, onValidationComplete);

    function onValidationComplete(err, _validated) {
      if (err) {
        return next(Boom.badRequest(err.message, err.details));
      }
      _.assignIn(req, params);
      return next();
    }
  };
};
