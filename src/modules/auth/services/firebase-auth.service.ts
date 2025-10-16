import { getAuth, UserRecord } from 'firebase-admin/auth';
import { initializeApp, cert, App } from 'firebase-admin/app';
import {LoginDto, LoginResponseDto } from '../dto/auth.dto';
import { CreateUserDto, UserResponseDto } from '../../user/dto/user.dto';
import { firebaseConfig } from '../../../core/config/env.config';


export class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  private app: App;
  private auth;

  private constructor() {
    // Inicializar Firebase Admin
    this.app = initializeApp({
      credential: cert({
        projectId: firebaseConfig.projectId,
        clientEmail: firebaseConfig.clientEmail,
        privateKey: firebaseConfig.privateKey?.replace(/\\n/g, '\n'),
      }),
    });
    
    this.auth = getAuth(this.app);
  }

  public static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }


  async createUserWithoutPassword(
    userData: CreateUserDto
  ): Promise<UserResponseDto> {
    try {
      const userRecord: UserRecord = await this.auth.createUser({
        email: userData.email.trim().toLowerCase(),
        emailVerified: false,
        disabled: false,
      });

      const customToken = await this.auth.createCustomToken(userRecord.uid);

      return {
        ...this.mapUserRecordToDto(userRecord),
        customToken,
      };
    } catch (error) {
      this.handleFirebaseError(error);
      throw error; 
    }
  }

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    try {
      const userRecord = await this.auth.getUserByEmail(email.trim().toLowerCase());
      return this.mapUserRecordToDto(userRecord);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/user-not-found') {
        return null;
      }
      throw error;
    }
  }


  async userExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return user !== null;
  }

  async loginWithEmail(loginData: LoginDto): Promise<LoginResponseDto> {
    try {
      const email = loginData.email.trim().toLowerCase();
      const userRecord = await this.auth.getUserByEmail(email);

      // Generar un custom token para el usuario
      const customToken = await this.auth.createCustomToken(userRecord.uid);

      return {
        uid: userRecord.uid,
        email: userRecord.email || '',
        customToken,
      };
    } catch (error) {
      this.handleFirebaseError(error);
      throw error;
    }
  }

  private mapUserRecordToDto(userRecord: UserRecord): UserResponseDto {
    return {
      uid: userRecord.uid,
      email: userRecord.email || '',
      createdAt: userRecord.metadata.creationTime,
    };
  }


  private handleFirebaseError(error: unknown): never {
    const firebaseError = error as { code?: string; message?: string };
    
    const errorMessages: Record<string, string> = {
      'auth/email-already-exists': 'El email ya está registrado',
      'auth/invalid-email': 'El formato del email es inválido',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/invalid-uid': 'ID de usuario inválido',
    };

    const message =
      errorMessages[firebaseError.code || ''] ||
      firebaseError.message ||
      'Error al procesar la solicitud en Firebase';

    throw new Error(message);
  }
}

