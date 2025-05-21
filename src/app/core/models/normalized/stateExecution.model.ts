import { Message } from "./message.model";
import { State } from "./state.model";

export interface StateExecution<T> {
    /** Tipo de respuesta http */
    stateType?: State;
    /** Indica si el Task se ejecutó correctamente o no */
    status: boolean;
    /** Mensaje al usuario */
    message: Message;
    /** lista de detalles adicionales */
    details?: string[];

    // Este atributo es opcional para los casos donde no se requiere un tipo genérico
    /** Generic a devolver */
    data?: T;
    results?: T;
}