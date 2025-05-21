import { OperationAreaUserDto } from "../../operation-area/models/operation-area.dto";

export interface UserRoleDialogConfig {
    isNew: boolean;
    byRole: boolean;
    roleId?: string;

    //*este Set me ayudara hacer una comparacion mas eficiente entre el array que ya existe en la lista y la lista que retorna de la BD
    userIdsInList?: Set<string | undefined>;
    //*esta lista es la que se ira modificando segun de click en el checkbox y es la que retornara al dar aceptar
    operationAreaUserList?: OperationAreaUserDto[];
}