import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageKeysService {
    //Almacenar aqui todas las llaves que se quieran guardar en el LocalStorage
    public TOKEN_KEY: string = 'token';
    public USER_KEY: string = 'user';
    public USER_PERMISSIONS: string = 'permissions';
    public USER_PERMISSIONSPARAMETERS: string = 'permissionsparameters';

    //objetos auxiliares
    public REQUESTIDSLIST: string = 'requestIdsList';
    public REQUESTDETAILIDSLIST: string = 'requestDetailIdsList';

    public URL_REDIRECT: string = 'url_redirect';

    public PREFERRED_LANG: string = 'preferredLang';
}   