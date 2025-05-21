export interface RoleDTO {
    id: string;
    name: string;
    enumId?: RoleEnum
}


export enum RoleEnum {
    Ninguno = 0,
    Administrator = 1
}