import { StatusCodes } from 'http-status-codes';
import userModel from '../models/userModel.js';
import DbService from '../services/dbService.js';

// Consultar todos los usuarios

class UserDomain {
  async getUsers(inputData) {
    // inputData puede contener filtros para la consulta
    try {
      const result = await DbService.getItems(userModel, inputData);
      return {
        status: StatusCodes.OK,
        payload: result,
      };
    } catch (error) {
      return {
        message: error.message || 'Error al consultar los usuarios',
      };
    }
  }

  // Crear un usuario
  /**
        inputData: {
          first_name: string
          last_name: string
          age:number
          email: string
          password: string
          cart: string
          role: string
       }
       */
  async createUser(inputData) {
    try {
      const result = await DbService.createItem(inputData, userModel);
      return {
        status: StatusCodes.CREATED,
        payload: result,
      };
    } catch (error) {
      return {
        status:
          error?.name === 'ValidationError'
            ? StatusCodes.BAD_REQUEST
            : StatusCodes.CONFLICT,
        message: error.message || 'Error al crear el usuario',
      };
    }
  }
  // Actualizar un usuario
  async updateUser(id, inputData) {
    try {
      const updatedUser = await DbService.updateItem(id, inputData, userModel);
      return {
        status: StatusCodes.OK,
        payload: updatedUser,
      };
    } catch (error) {
      return {
        status: StatusCodes.CONFLICT,
        message: error.message || 'Error al actualizar el usuario',
      };
    }
  }

  // Eliminar un usuario
  async deleteUser(id) {
    try {
      const deletedUser = await DbService.deleteItem(id, userModel);
      return {
        status: StatusCodes.OK,
        payload: deletedUser,
      };
    } catch (error) {
      return {
        status: StatusCodes.CONFLICT,
        message: error.message || 'Error al eliminar el usuario',
      };
    }
  }
}

export default UserDomain;
