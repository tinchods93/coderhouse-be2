import { StatusCodes } from 'http-status-codes';
import { StatusMessages } from './statusMessages.js';

// Con esta clase, puedo manejar los errores de forma organizada y centralizada
class ErrorEntity {
  static getByCode(statusCode, errorPayload) {
    const errors = {
      [StatusCodes.UNAUTHORIZED]: ErrorEntity.Unauthorized,
      [StatusCodes.FORBIDDEN]: ErrorEntity.Forbidden,
      [StatusCodes.INTERNAL_SERVER_ERROR]: ErrorEntity.InternalServerError,
      [StatusCodes.BAD_REQUEST]: ErrorEntity.BadRequest,
      [StatusCodes.NOT_FOUND]: ErrorEntity.NotFound,
      [StatusCodes.CONFLICT]: ErrorEntity.Conflict,
    };

    return (
      errors[statusCode]?.(errorPayload) ||
      ErrorEntity.InternalServerError(errorPayload)
    );
  }
  static Unauthorized() {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      status: StatusMessages.ERROR,
      message: 'Unauthorized',
    };
  }

  static Forbidden() {
    return {
      statusCode: StatusCodes.FORBIDDEN,
      status: StatusMessages.ERROR,
      message: 'Forbidden Access',
    };
  }

  static Conflict(error) {
    return {
      statusCode: StatusCodes.CONFLICT,
      status: StatusMessages.ERROR,
      message: error.message,
    };
  }

  static InternalServerError(error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: StatusMessages.FAULT,
      message: error.message,
    };
  }

  static BadRequest(error) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      status: StatusMessages.ERROR,
      message: error.message,
    };
  }

  static NotFound(error) {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      status: StatusMessages.ERROR,
      message: error.message,
    };
  }
}

export default ErrorEntity;
