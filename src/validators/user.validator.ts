import { ValidationHelper } from '../helpers/validation.helper';
import { CreateUserDto } from '../dto/user.dto';

export class UserValidator {
  static validateCreateUser(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Los datos del usuario son requeridos');
      return { valid: false, errors };
    }

    const userData = data as Partial<CreateUserDto>;

    if (!userData.email) {
      errors.push('El email es requerido');
    } else if (!ValidationHelper.isValidEmail(userData.email)) {
      errors.push('El formato del email es inválido');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

