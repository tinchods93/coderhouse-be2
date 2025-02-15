import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserDomain from '../domain/userDomain.js';
import { StatusMessages } from '../common/statusMessages.js';
import ErrorEntity from '../common/ErrorEntity.js';
import authorizeUser from '../middlewares/auth.js';
import UserRoles from '../common/userRoles.js';
import passportAuth from '../middlewares/passportAuth.js';

const adminRouter = Router();

// Consultar todos los usuarios
adminRouter.get(
  '/users',
  passportAuth,
  authorizeUser(UserRoles.ADMIN),
  async (req, res) => {
    try {
      const result = await UserDomain.getUsers({ role: UserRoles.USER });

      if (result.message) {
        const { statusCode, ...errorPayload } = ErrorEntity.getByCode(
          result.status,
          result
        );
        return res.status(result.status).send(errorPayload);
      }

      if (result.payload.length === 0) {
        const { statusCode, ...errorPayload } = ErrorEntity.NotFound({
          message: 'No se encontraron usuarios',
        });
        return res.status(statusCode).send(errorPayload);
      }

      res.status(result.status).send({
        status: StatusMessages.SUCCESS,
        payload: result.payload,
      });
    } catch (error) {
      const { statusCode, ...errorPayload } =
        ErrorEntity.InternalServerError(error);
      return res.status(statusCode).send(errorPayload);
    }
  }
);

// Eliminar un usuario
adminRouter.delete(
  '/users/:uid',
  authorizeUser(UserRoles.ADMIN),
  async (req, res) => {
    try {
      const uid = req.params.uid;
      const result = await UserDomain.deleteUser(uid);

      if (result.message) {
        const { statusCode, ...errorPayload } = ErrorEntity.getByCode(
          result.status,
          result
        );
        return res.status(result.status).send(errorPayload);
      }

      res.status(result.status).send({
        status: StatusMessages.SUCCESS,
        payload: result,
      });
    } catch (error) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: StatusMessages.FAULT,
        message: error.message,
      });
    }
  }
);

// Crear un usuario
adminRouter.post(
  '/users',
  passportAuth,
  authorizeUser(UserRoles.ADMIN),
  async (req, res) => {
    try {
      const result = await UserDomain.createUser(req.body);
      if (result.message) {
        const { statusCode, ...errorPayload } = ErrorEntity.getByCode(
          result.status,
          result
        );

        return res.status(result.status).send(errorPayload);
      }

      res.status(result.status).send({
        status: StatusMessages.SUCCESS,
        payload: result.payload,
      });
    } catch (error) {
      // console.error(error);
      const { statusCode, ...errorPayload } =
        ErrorEntity.InternalServerError(error);
      return res.status(statusCode).send(errorPayload);
    }
  }
);

// Actualizar un usuario
adminRouter.put(
  '/users/:uid',
  authorizeUser(UserRoles.ADMIN),
  async (req, res) => {
    try {
      const uid = req.params.uid;
      const result = await UserDomain.updateUser(uid, req.body);

      if (result.message) {
        const { statusCode, ...errorPayload } = ErrorEntity.getByCode(
          result.status,
          result
        );
        return res.status(result.status).send(errorPayload);
      }

      res.status(result.status).send({
        status: StatusMessages.SUCCESS,
        payload: result.payload,
      });
    } catch (error) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: StatusMessages.FAULT,
        message: error.message,
      });
    }
  }
);
export default adminRouter;
