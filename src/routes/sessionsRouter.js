import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StatusMessages } from '../common/statusMessages.js';
import passportAuth from '../middlewares/passportAuth.js';
import ErrorEntity from '../common/ErrorEntity.js';

const router = Router();

router.get('/current', passportAuth, async (req, res) => {
  try {
    res.status(StatusCodes.OK).send({
      status: StatusMessages.SUCCESS,
      payload: req.user,
    });
  } catch (error) {
    const { statusCode, ...errorPayload } =
      ErrorEntity.InternalServerError(error);
    return res.status(statusCode).send(errorPayload);
  }
});

export default router;
