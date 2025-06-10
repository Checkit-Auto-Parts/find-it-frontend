import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor(private crypto: CryptoService) { }

    /**Guarda un elemento en el localstorage */
    set = (key: string, data: any) => {
        try {
            // localStorage.setItem(key, JSON.stringify(data));
            // //!IMPORTANTE DESCOMENTAR CUANDO SALGA A PRUEBAS DE USUARIO
            localStorage.setItem(key, JSON.stringify(this.crypto.encrypt(data)));
        } catch (e) {
        }
    }

    /**Obtiene un elemento del localstorage */
    get<T>(key: string): T {
        try {
            let data = JSON.parse(localStorage.getItem(key)!);
            if (!data) { return null!; }
            //  return data;
            // //!IMPORTANTE DESCOMENTAR CUANDO SALGA A PRUEBAS DE USUARIO            
            return this.crypto.decrypt<T>(data);
        } catch (e) {
            return null!;
        }
    }

    /**Elimina un elemento del localstorage */
    remove = (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            // return null;
        }
    }

    /**Elimina todos los elementos del localstorage */
    clear = () => {
        try {
            localStorage.clear();
        } catch (e) {
            // return null;
        }
    }

    /**Valida si una llave especifica existe o no en el localstorage */
    validateExists(key: string) {
        if (localStorage.getItem(key) == null || localStorage.getItem(key) == '') {
            return false;
        } else {
            return true;
        }
    }
}
