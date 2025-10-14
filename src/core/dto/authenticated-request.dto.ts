export interface AuthenticatedRequest {
  user: {
    uid: string;
    email?: string;
    emailVerified?: boolean;
  };
}

export interface AuthenticatedRequestData {
  uid: string;
  email?: string;
  emailVerified?: boolean;
}
