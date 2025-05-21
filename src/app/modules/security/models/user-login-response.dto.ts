import { Guid } from "guid-typescript";
import { RoleDTO } from "../../user/models/role.dto";

export interface LoginResponseDTO {
    id: Guid;
    userName: string;
    fullName: string; //?luis esta llegando null en la respuesta del login
    succeeded: boolean;
    token: string;
    result: SignInResult;
    roleId: string[]; //?luis esto por ahora no lo usare
    roles: RoleDTO[];
}

export interface SignInResult {
    succeeded: boolean;
    isLockedOut: boolean;
    isNotAllowed: boolean;
    requiresTwoFactor: boolean;
}