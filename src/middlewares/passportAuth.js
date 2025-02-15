import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import ErrorEntity from '../common/ErrorEntity.js';

// Middleware para llamar a Passport con una estrategia específica.
// esta aproximacion es similar a una inyeccion de dependencias
const passportAuth = async (req, res, next) => {
  passport.authenticate('jwt', function (err, user, info) {
    if (err) return next(err);
    if (!user) {
      const { statusCode, ...error } = ErrorEntity.Unauthorized();
      return res.status(statusCode).send(error);
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default passportAuth;
