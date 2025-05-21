import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

// const encryptKey: string = 'bcQVGrUmPXL7ICbUsmioe4KoQjTpVlQa';
const encryptKey: string = '9&*ooytr[4=Vtd#u';
const encryptIV: string = "AXm88y_]I>$h/v{+";

@Injectable({
    providedIn: 'root'
})
export class CryptoService {
    private key = CryptoJS.enc.Utf8.parse(encryptKey);
    private iv = CryptoJS.enc.Utf8.parse(encryptIV);

    constructor() { }
    // #region Usar estos para manejar encriptacion que se manejara solo dentro del FE
    encrypt(data: any): string {
        return CryptoJS.AES.encrypt(JSON.stringify(data), encryptKey).toString();
    }

    decrypt<T>(data: string): T {
        const bytes = CryptoJS.AES.decrypt(data, encryptKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    // #endregion

    // #region Usar estos para enviar datos encriptados al BE
    encryptUsingAES256(text: any): any {
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    decryptUsingAES256(decString: any) {
        var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    // #endregion
}
