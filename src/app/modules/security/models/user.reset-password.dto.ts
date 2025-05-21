import { Guid } from "guid-typescript";

export interface ResetPasswordDTO {
    email?: string;
    id?: string;
    code?: string;
    restoreLink?: string;
}

export interface ChangePasswordDTO {
    userId?: Guid;
    password: string;
    confirmPassword: string;
}