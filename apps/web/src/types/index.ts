export enum UserRole {
    ADMIN = 'admin',
    PROVIDER = 'provider',
    CLIENT = 'client',
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
}
