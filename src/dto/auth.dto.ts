  
  export interface LoginDto {
    email: string;
  }

  export interface LoginResponseDto {
    uid: string;
    email: string;
    customToken: string;
  }
  