import { Guid } from "guid-typescript";

export interface UserRegisterDTO {
    firstName: string;
    lastName: string;
    fullName: string;
    userName: string;
    password: string;
    rolName: string;
    customer: CustomerDto;
}

export interface CustomerDto {
    name: string;
    rnc: string;
    address: string;
    phones: PhoneDto[];
}

export interface PhoneDto {
    number: string;
    phoneType: PhoneTypeDto;
}

export interface PhoneTypeDto {
    id: Guid;
    name: string;
}