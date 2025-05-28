import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maskGuid',
    standalone: true
})
export class MaskGuidPipe implements PipeTransform {
    transform(guid: string, prefijo: string): string {
        let maskAux: string = '';

        if (guid != null) {
            if (guid.trim() != '') {
                maskAux = `${prefijo.toUpperCase()}-${guid
                    .substring(guid.length - 4, guid.length)
                    .toUpperCase()}`;
            }
        }

        return maskAux;
    }
}
