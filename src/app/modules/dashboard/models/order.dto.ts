import { Guid } from "guid-typescript";
import { SearchHistoryMessageDto } from "../../search-history/models/search-history.dto";

export interface OrderDTO {
    id: number;
    name: string;
    lastName: string;
    createdAt: Date;
    createdBy: Guid;
    modifiedAt?: Date | null;
    modifiedBy?: Guid | null;
    isDeleted: boolean;
    isAllow: boolean;
    vehiculeId: number;
    vehiculeMakeName: string;
    vehiculeModelName: string;
    vehiculeBodyStyleName: string;
    vehiculeEngineNumberOfCylinders: string;
    vehiculeTransmissionName: string;
    vehiculeDriveTypeName: string;
    vehiculeFuelTypeName: string;
    vehiculeYear: number;
    languageId: number;
    comments: string;
    messagesCount?: number;
    lastMessageText?: string;
    lastMessageAt?: string;
    messagesPreview?: SearchHistoryMessageDto[];
}