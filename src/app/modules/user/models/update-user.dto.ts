export interface UpdateUserDTO {
    id: string;
    firstName: string;
    lastName: string;
    roleIds: string[];
    supplierId?: number;
}