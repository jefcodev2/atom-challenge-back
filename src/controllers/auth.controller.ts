import { Request, Response } from 'express';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { AuthValidator } from '../validators/auth.validator';
import { HttpResponse } from '../helpers/http-response.helper';

export class AuthController {
  private firebaseAuthService: FirebaseAuthService;

  constructor() {
    this.firebaseAuthService = FirebaseAuthService.getInstance();
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const validation = AuthValidator.validateLogin(req.body);
      
      if (!validation.valid) {
        return HttpResponse.badRequest(res, validation.errors.join(', '));
      }

      const { email } = req.body;

      const userExists = await this.firebaseAuthService.userExists(email);
      
      if (!userExists) {
        return HttpResponse.badRequest(
          res,
          'Usuario no encontrado'
        );
      }

      const loginResult = await this.firebaseAuthService.loginWithEmail({
        email,
      });

      return HttpResponse.success(
        res, 
        loginResult as unknown as Record<string, unknown>, 
        'Login exitoso'
      );
    } catch (error) {
      console.error('Error al hacer login:', error);
      
      const errorDetail = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);

      return HttpResponse.serverError(
        res, 
        'Error al procesar el login',
        errorDetail
      );
    }
  };



}

