import { Guid } from "guid-typescript";

export interface RegisterResponseDto {
    userId: Guid | undefined;
    userName: string;
    successed: boolean;
    errorList: ErrorList;
    userProfileSuccessed: boolean;
    userProfileErrors: string;
}

export interface ErrorList {
    item1: Item1[]
    item2: string
}

export interface Item1 {
    code: string
    description: string
}
