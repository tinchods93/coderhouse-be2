import ErrorEntity from '../common/ErrorEntity.js';

const authorizeUser = (role) => {
  return (req, res, next) => {
    if (req?.user?.role === role) {
      next();
    } else {
      const { statusCode, ...error } = ErrorEntity.Forbidden();
      return res.status(statusCode).send(error);
    }
  };
};

export default authorizeUser;
