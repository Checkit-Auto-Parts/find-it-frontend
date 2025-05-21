import { Guid } from 'guid-typescript';

export interface UserRegisterModel {
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  password: string;
  rolName: string;
  customer: CustomerModel;
}

export interface CustomerModel {
  name: string;
  rnc: string;
  address: string;
  phones: PhoneModel[];
}

export interface PhoneModel {
  number: string;
  phoneType: PhoneTypeModel;
}

export interface PhoneTypeModel {
  id: Guid;
  name: string;
}
