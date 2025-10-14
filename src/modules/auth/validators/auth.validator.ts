import { ValidationHelper } from '../../../core/helpers/validation.helper';
import { LoginDto } from '../dto/auth.dto';

export class AuthValidator {

  static validateLogin(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Los datos de login son requeridos');
      return { valid: false, errors };
    }

    const loginData = data as Partial<LoginDto>;

    if (!loginData.email) {
      errors.push('El email es requerido');
    } else if (!ValidationHelper.isValidEmail(loginData.email)) {
      errors.push('El formato del email es inválido');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

