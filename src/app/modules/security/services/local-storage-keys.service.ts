import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageKeysService {
    //Almacenar aqui todas las llaves que se quieran guardar en el LocalStorage
    public TOKEN_KEY: string = 'token';
    public USER_KEY: string = 'user';
    public USER_PERMISSIONS: string ='permissions';
}