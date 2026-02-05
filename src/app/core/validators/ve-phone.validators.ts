import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noExtraSpaces(control: AbstractControl): ValidationErrors | null {
    const v = (control.value ?? '') as string;
    if (!v) return null;

    if (v.trim() !== v) return { spaces: 'leadingOrTrailing' };
    if (/\s{2,}/.test(v)) return { spaces: 'multiple' };

    return null;
}

/**
 * Validates the final Venezuelan format produced by the mask:
 * +58 000 0000000  (exactly two single spaces)
 */
export function vePhoneComplete(control: AbstractControl): ValidationErrors | null {
    const raw = (control.value ?? '') as string;
    if (!raw) return null;

    // normalize: keep digits and optional leading +
    const normalized = raw.replace(/[^\d+]/g, '');

    // Accept:
    // +58XXXXXXXXXX (12 digits including country code, plus sign optional)
    // 58XXXXXXXXXX
    // XXXXXXXXXX (local 10 digits: 3 prefix + 7 number)
    // Where prefix commonly starts with 2xx (landline) or 4xx (mobile)
    const ok =
        /^(\+?58)?(2\d{2}|4\d{2})\d{7}$/.test(normalized);

    return ok ? null : { phoneIncomplete: true };
}