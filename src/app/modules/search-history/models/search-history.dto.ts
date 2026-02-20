export interface SearchHistoryMessageDto {
    id: number;
    orderId: number;
    messageAt: string;          // ISO date
    messageType: string;
    searchCriteria?: string | null; // or a "text" field if you have it
    fromWa?: string;
}

export interface MessagesByOrderResponse {
  // key = orderId, value = messages
  [orderId: number]: SearchHistoryMessageDto[];
}