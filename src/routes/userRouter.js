import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserDomain from '../domain/userDomain.js';
import { StatusMessages } from '../common/statusMessages.js';

const router = Router();

const Domain = new UserDomain();

// Consultar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await Domain.getUsers(req.query);

    if (result.message) {
      return res.status(result.status).send({
        status: StatusMessages.ERROR,
        message: result.message,
      });
    }

    res.status(result.status).send({
      status: StatusMessages.SUCCESS,
      payload: result.payload,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: StatusMessages.FAULT,
      message: error.message,
    });
  }
});

// Crear un usuario
router.post('/', async (req, res) => {
  try {
    const result = await Domain.createUser(req.body);
    if (result.message) {
      return res.status(result.status).send({
        status: StatusMessages.ERROR,
        message: result.message,
      });
    }

    res.status(result.status).send({
      status: StatusMessages.SUCCESS,
      payload: result.payload,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: StatusMessages.FAULT,
      message: error.message,
    });
  }
});

// Actualizar un usuario
router.put('/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const result = await Domain.updateUser(uid, req.body);

    if (result.message) {
      return res.status(result.status).send({
        status: StatusMessages.ERROR,
        message: result.message,
      });
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

// Eliminar un usuario
router.delete('/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const result = await Domain.deleteUser(uid);

    if (result.message) {
      return res.status(result.status).send({
        status: StatusMessages.ERROR,
        message: result.message,
      });
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
});

export default router;
