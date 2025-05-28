import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'excludeDefaultDate',
    standalone: true
})
export class ExcludeDefaultDatePipe implements PipeTransform {
    transform(value: string | Date, locale: string = 'es-DO'): string | null {
        if (!value) return null;

        const defaultDate = new Date('0001-01-01T00:00:00');
        const date = new Date(value);

        if (date.getTime() === defaultDate.getTime()) return null;

        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        return new Intl.DateTimeFormat(locale, options).format(date);
    }
}
