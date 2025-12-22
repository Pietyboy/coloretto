export type AuthMode = 'login' | 'register';

export type LoginFormValues = {
  username: string;
  password: string;
  confirmPassword?: string;
};
