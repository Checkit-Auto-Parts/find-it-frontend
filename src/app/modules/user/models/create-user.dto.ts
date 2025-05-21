export interface CreatedUserDto {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    roleIds: string[];
    supplierId?: number;
}