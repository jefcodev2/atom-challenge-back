import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { HttpResponse } from '../helpers/http-response.helper';

export class AuthMiddleware {
  static async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      HttpResponse.unauthorized(res, 'No se proporcionó token');
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const tokenParts = token.split('.');
      
      if (tokenParts.length !== 3) {
        HttpResponse.unauthorized(res, 'Formato de token inválido');
        return;
      }

      const payload = JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString()
      );

      if (!payload.uid) {
        HttpResponse.unauthorized(res, 'Token sin UID');
        return;
      }

      const auth = getAuth();
      const userRecord = await auth.getUser(payload.uid);
      
      (req as any).authenticatedUser = {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
      };
      
      next();
    } catch (error) {
      console.error("Error verificando token:", error);
      HttpResponse.unauthorized(res, 'Token inválido o usuario no encontrado');
    }
  }

}

