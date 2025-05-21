import { Guid } from "guid-typescript";
import { RoleDTO } from "./role.dto";

export interface UserDTO {
    id: string;
    firstName: string;
    lastName?: string;
    email?: string;
    userName?: string;
    createdAt?: Date;
    createdByFullName?: string;
    modifiedAt?: Date;
    modifiedByFullName?: string;
    // createdBy?: Guid;
    isActive?: boolean;
    roles?: RoleDTO[];

    //variables de manipulacion de interfaz
    idFormatted?: string;
    isAlreadyOnList?: boolean;

}