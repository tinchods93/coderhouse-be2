import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import userModel from '../models/userModel.js';
import DbService from '../services/dbService.js';

// Consultar todos los usuarios
class UserDomain {
  static async getUsers(inputData) {
    // inputData puede contener filtros para la consulta
    try {
      const result = await DbService.getItems(userModel, inputData);
      return {
        status: StatusCodes.OK,
        payload:
          result?.map((user) => ({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            role: user.role,
          })) || [],
      };
    } catch (error) {
      return {
        message: error.message || 'Error al consultar los usuarios',
      };
    }
  }

  // Consultar un usuario por id
  static async getUserById(id) {
    try {
      const user = await DbService.getItem(id, userModel);

      return {
        status: StatusCodes.OK,
        payload: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: error.message || 'Usuario no encontrado',
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
  static async createUser(inputData) {
    try {
      await userModel.validate(inputData);

      const user = {
        ...inputData,
        password: bcrypt.hashSync(inputData.password, 10),
      };

      const result = await DbService.createItem(user, userModel);
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
  static async updateUser(id, inputData) {
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
  static async deleteUser(id) {
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

  static async login(inputData) {
    try {
      const user = await userModel.findOne({ email: inputData.email });
      if (!user) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: 'Usuario no encontrado',
        };
      }

      if (!bcrypt.compareSync(inputData.password, user.password)) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: 'Contraseña incorrecta',
        };
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      return {
        status: StatusCodes.OK,
        access_token: token,
      };
    } catch (error) {
      console.error('login error', error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || 'Error al iniciar sesión',
      };
    }
  }
}

export default UserDomain;
