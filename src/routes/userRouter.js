import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserDomain from '../domain/userDomain.js';
import { StatusMessages } from '../common/statusMessages.js';
import ErrorEntity from '../common/ErrorEntity.js';
import passportAuth from '../middlewares/passportAuth.js';

const userRouter = Router();

userRouter.get('/profile', passportAuth, async (req, res) => {
  try {
    const result = await UserDomain.getUserById(req.user.id);

    if (result.message) {
      const { statusCode, ...errorPayload } = ErrorEntity.getByCode(
        result.status,
        result
      );
      return res.status(result.status).send(errorPayload);
    }

    res.status(StatusCodes.OK).send({
      status: StatusMessages.SUCCESS,
      payload: result.payload,
    });
  } catch (error) {
    const { statusCode, ...errorPayload } =
      ErrorEntity.InternalServerError(error);
    return res.status(statusCode).send(errorPayload);
  }
});

// Registra un usuario
userRouter.post('/signup', async (req, res) => {
  try {
    // borramos el campo role para que no se pueda registrar como admin
    delete req.body.role;
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
});

// Login de usuario
userRouter.post('/signin', async (req, res) => {
  try {
    const result = await UserDomain.login(req.body);

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
      access_token: result.access_token,
    });
  } catch (error) {
    console.error(error);
    const { statusCode, ...errorPayload } =
      ErrorEntity.InternalServerError(error);
    return res.status(statusCode).send(errorPayload);
  }
});

// Actualizar un usuario
userRouter.put('/:uid', passportAuth, async (req, res) => {
  try {
    delete req.body.role;
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
});

export default userRouter;
