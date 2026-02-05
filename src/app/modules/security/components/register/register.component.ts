import { SecurityService } from './../../services/security.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    FormBuilder,
    ValidationErrors,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { noExtraSpaces, vePhoneComplete } from '../../../../core/validators/ve-phone.validators';
import { NgxMaskDirective } from 'ngx-mask';
import { RegisterRequestDto } from '../../models/register.dto';


function matchPasswordsValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value ?? '';
    const confirm = group.get('confirmPassword')?.value ?? '';

    // Don't show mismatch while empty; let required handle it.
    if (!password || !confirm) return null;

    return password === confirm ? null : { passwordMismatch: true };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
    isSubmitting = false;

    passwordVisible = false;
    confirmPasswordVisible = false;

    form = this.fb.group(
        {
            firstName: ['', [Validators.required, Validators.maxLength(60)]],
            lastName: ['', [Validators.required, Validators.maxLength(60)]],
            userNameOrEmail: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
            phone: ['', [Validators.required,
                vePhoneComplete,
                noExtraSpaces,      // optional (paste/autofill edge cases)
            Validators.maxLength(20)]],
            address: ['', [Validators.required, Validators.maxLength(200)]],

            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    // at least 1 upper, 1 lower, 1 number
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
                    Validators.maxLength(64),
                ],
            ],
            confirmPassword: ['', [Validators.required, Validators.maxLength(64)]],
        },
        { validators: [matchPasswordsValidator] }
    );

    constructor(private fb: FormBuilder, private authService: SecurityService) {
    }

    get f() {
        return this.form.controls;
    }

    get passwordMismatch(): boolean {
        return (
            this.form.hasError('passwordMismatch') &&
            (this.f.confirmPassword.touched || this.f.password.touched)
        );
    }

    togglePassword() {
        this.passwordVisible = !this.passwordVisible;
    }

    toggleConfirmPassword() {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }

    submit() {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            return;
        }

        this.isSubmitting = true;

        try {
            // 2. Normalize phone to E.164 (+584XXXXXXXXX)
            const rawPhone = this.f.phone.value as string;

            const digitsOnly = rawPhone.replace(/[^\d]/g, '');

            // Remove leading 58 if already included
            const localNumber = digitsOnly.startsWith('58')
                ? digitsOnly.substring(2)
                : digitsOnly;

            const phoneE164 = `+58${localNumber}`;

            // 3. Build DTO (what backend expects)
            const payload: RegisterRequestDto = {
                firstName: this.f.firstName.value!.trim(),
                lastName: this.f.lastName.value!.trim(),
                userName: this.f.userNameOrEmail.value!.trim().toLowerCase(),
                phone: phoneE164,
                address: this.f.address.value!.trim(),
                password: this.f.password.value!,
                confirmPassword: this.f.confirmPassword.value!,
                rolName: 'CUSTOMER',
                
            };

            // 4. Call backend (example)
            this.authService.register(payload).subscribe({
                next: () => {
                    this.isSubmitting = false;
                    // TODO: redirect to login / dashboard
                },
                error: (err) => {
                    this.isSubmitting = false;
                    this.handleBackendErrors(err);
                },
            });

        } catch (e) {
            this.isSubmitting = false;
            console.error('Register submit error', e);
        }
    }

    private handleBackendErrors(error: any): void {
        if (error?.error?.errors) {
            const errors = error.error.errors;

            Object.keys(errors).forEach((field) => {
                const control = this.form.get(this.normalizeFieldName(field));
                if (control) {
                    control.setErrors({ backend: errors[field][0] });
                }
            });
        }
    }

    private normalizeFieldName(apiField: string): string {
        return apiField.charAt(0).toLowerCase() + apiField.slice(1);
    }
}
