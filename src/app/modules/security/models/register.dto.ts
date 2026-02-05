export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  userName: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword?: string;
  rolName: string;
}
