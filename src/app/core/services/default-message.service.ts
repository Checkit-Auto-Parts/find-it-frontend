import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root'
})
export class DefaultMessageService {
    catchError: string = "Error interno al ejecutar la acción.";
    invalidForm: string = "Complete los valores del formulario.";
    listEmpty = (listName: string) => `Lista de ${listName} vacía.`;
}
