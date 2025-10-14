export class ValidationHelper {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    return this.EMAIL_REGEX.test(email.trim());
  }
}

