import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roundNumber',
    standalone: true
})
export class RoundNumberPipe implements PipeTransform {
    transform(number: number, tipoRedondeo: string): string {
        let resultado: string = '';

        if (number != null) {
            if (tipoRedondeo == 'up') {
                resultado = Math.ceil(number).toString();
            } else if (tipoRedondeo == 'down') {
                resultado = Math.floor(number).toString();
            } else {
                //nada
            }
        }

        return resultado;
    }
}
