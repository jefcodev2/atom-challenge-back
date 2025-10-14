import { Request, Response } from 'express';
import { FirebaseAuthService } from '../../auth/services/firebase-auth.service';
import { UserValidator } from '../validators/user.validator';
import { HttpResponse } from '../../../core/helpers/http-response.helper';

export class UserController {
  private firebaseAuthService: FirebaseAuthService;

  constructor() {
    this.firebaseAuthService = FirebaseAuthService.getInstance();
  }

  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const validation = UserValidator.validateCreateUser(req.body);
      
      if (!validation.valid) {
        return HttpResponse.badRequest(res, validation.errors.join(', '));
      }

      const { email, displayName } = req.body;

      const userExists = await this.firebaseAuthService.userExists(email);
      
      if (userExists) {
        return HttpResponse.badRequest(
          res,
          'El usuario con este email ya existe'
        );
      }

      // Crear usuario
      const newUser = await this.firebaseAuthService.createUserWithoutPassword({
        email,
      });

      return HttpResponse.created(res, newUser, 'Usuario creado exitosamente');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      
      const errorDetail = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);

      return HttpResponse.serverError(
        res, 
        'Error al crear el usuario',
        errorDetail
      );
    }
  };



}

