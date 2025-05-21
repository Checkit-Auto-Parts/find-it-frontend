export interface InfoMessageModel {
    title?: string;
    status: boolean;
    messageBody: string;
    detailsList?: string[];
}
export interface DecisionMessageModel {
    messageBody: string;
}