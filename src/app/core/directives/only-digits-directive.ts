import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[onlyDigits]',
    standalone: true,
})
export class OnlyDigitsDirective {

    @HostListener('input', ['$event'])
    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const cleanValue = input.value.replace(/\D/g, '');
        if (input.value !== cleanValue) {
            input.value = cleanValue;
            input.dispatchEvent(new Event('input')); // updates Angular form binding
        }
    }
}
