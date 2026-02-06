import { SecurityService } from './../../services/security.service';
import { Component, DestroyRef, inject } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';

import { NgxMaskDirective } from 'ngx-mask';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { noExtraSpaces, vePhoneComplete } from '../../../../core/validators/ve-phone.validators';
import { RegisterRequestDto } from '../../models/register.dto';
import { VehicleCatalogService } from '../../../vehicle/services/vehicle-catalog/vehicle-catalog.service';


/* ---------------------------------------------
 * Types
 * --------------------------------------------- */
export type LookupItem = {
    id: number | string;
    name: string;
};

/* ---------------------------------------------
 * Validators
 * --------------------------------------------- */
function matchPasswordsValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value ?? '';
    const confirm = group.get('confirmPassword')?.value ?? '';
    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
}

/* ---------------------------------------------
 * Component
 * --------------------------------------------- */
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
        MatSelectModule,
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
    private destroyRef = inject(DestroyRef);

    isSubmitting = false;
    isLoadingCatalog = false;
    isLoadingModels = false;

    passwordVisible = false;
    confirmPasswordVisible = false;

    /* ---------------------------------------------
     * Dropdown data (fed by services)
     * --------------------------------------------- */
    makes: LookupItem[] = [];
    models: LookupItem[] = [];
    bodyStyles: LookupItem[] = [];
    colors: LookupItem[] = [];
    engines: LookupItem[] = [];
    transmissions: LookupItem[] = [];
    driveTypes: LookupItem[] = [];
    fuelTypes: LookupItem[] = [];

    /* ---------------------------------------------
     * Form
     * --------------------------------------------- */
    form = this.fb.group(
        {
            firstName: ['', [Validators.required, Validators.maxLength(60)]],
            lastName: ['', [Validators.required, Validators.maxLength(60)]],
            userNameOrEmail: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],

            phone: [
                '',
                [
                    Validators.required,
                    vePhoneComplete,
                    noExtraSpaces,
                    Validators.maxLength(20),
                ],
            ],

            address: ['', [Validators.required, Validators.maxLength(200)]],

            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
                    Validators.maxLength(64),
                ],
            ],

            confirmPassword: ['', [Validators.required, Validators.maxLength(64)]],

            // 🚗 Vehicle (IDs from DB)
            make: ['', Validators.required],
            model: ['', Validators.required],
            bodyStyle: ['', Validators.required],
            color: ['', Validators.required],
            engine: ['', Validators.required],
            transmission: ['', Validators.required],
            driveType: ['', Validators.required],
            fuelType: ['', Validators.required],

            vin: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(17),
                    Validators.pattern(/^[A-Za-z0-9]+$/),
                ],
            ],
        },
        { validators: [matchPasswordsValidator] }
    );

    constructor(
        private fb: FormBuilder,
        private authService: SecurityService,
        private vehicleCatalog: VehicleCatalogService
    ) {
        this.loadCatalog();
        this.listenMakeChanges();
    }

    /* ---------------------------------------------
     * Getters
     * --------------------------------------------- */
    get f() {
        return this.form.controls;
    }

    get passwordMismatch(): boolean {
        return (
            this.form.hasError('passwordMismatch') &&
            (this.f.password.touched || this.f.confirmPassword.touched)
        );
    }

    /* ---------------------------------------------
     * UI helpers
     * --------------------------------------------- */
    togglePassword() {
        this.passwordVisible = !this.passwordVisible;
    }

    toggleConfirmPassword() {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }

    /* ---------------------------------------------
     * Catalog loading
     * --------------------------------------------- */
    private loadCatalog(): void {
        this.isLoadingCatalog = true;

        forkJoin({
            // makes: this.vehicleCatalog.getMakes(),
            bodyStyles: this.vehicleCatalog.getBodyStyles(),
            // colors: this.vehicleCatalog.getColors(),
            // engines: this.vehicleCatalog.getEngines(),
            // transmissions: this.vehicleCatalog.getTransmissions(),
            // driveTypes: this.vehicleCatalog.getDriveTypes(),
            // fuelTypes: this.vehicleCatalog.getFuelTypes(),
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    // this.makes = res.makes ?? [];
                    this.bodyStyles = res.bodyStyles ?? [];
                    // this.colors = res.colors ?? [];
                    // this.engines = res.engines ?? [];
                    // this.transmissions = res.transmissions ?? [];
                    // this.driveTypes = res.driveTypes ?? [];
                    // this.fuelTypes = res.fuelTypes ?? [];
                    // this.isLoadingCatalog = false;
                },
                error: (err) => {
                    console.error('Catalog load error', err);
                    this.isLoadingCatalog = false;
                },
            });
    }

    private listenMakeChanges(): void {
        this.f.make.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((makeId) => {
                this.models = [];
                this.f.model.reset();

                if (!makeId) return;

                this.loadModelsByMake(makeId);
            });
    }

    private loadModelsByMake(makeId: string | number): void {
        this.isLoadingModels = true;

        this.vehicleCatalog
            .getModelsByMake(makeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (items) => {
                    this.models = items ?? [];
                    this.isLoadingModels = false;
                },
                error: (err) => {
                    console.error('Models load error', err);
                    this.isLoadingModels = false;
                },
            });
    }

    /* ---------------------------------------------
     * Submit
     * --------------------------------------------- */
    submit() {
        this.form.markAllAsTouched();
        if (this.form.invalid) return;

        this.isSubmitting = true;

        try {
            const rawPhone = this.f.phone.value as string;
            const digits = rawPhone.replace(/[^\d]/g, '');
            const local = digits.startsWith('58') ? digits.substring(2) : digits;
            const phoneE164 = `+58${local}`;

            const payload: RegisterRequestDto = {
                firstName: this.f.firstName.value!.trim(),
                lastName: this.f.lastName.value!.trim(),
                userName: this.f.userNameOrEmail.value!.trim().toLowerCase(),
                phone: phoneE164,
                address: this.f.address.value!.trim(),
                password: this.f.password.value!,
                confirmPassword: this.f.confirmPassword.value!,
                rolName: 'CUSTOMER',

                // Vehicle IDs (adjust to backend contract)
                // makeId: this.f.make.value!,
                // modelId: this.f.model.value!,
                // bodyStyleId: this.f.bodyStyle.value!,
                // colorId: this.f.color.value!,
                // engineId: this.f.engine.value!,
                // transmissionId: this.f.transmission.value!,
                // driveTypeId: this.f.driveType.value!,
                // fuelTypeId: this.f.fuelType.value!,
                // vin: this.f.vin.value!.toUpperCase(),
            };

            this.authService.register(payload).subscribe({
                next: () => (this.isSubmitting = false),
                error: (err) => {
                    this.isSubmitting = false;
                    this.handleBackendErrors(err);
                },
            });
        } catch (e) {
            console.error('Register error', e);
            this.isSubmitting = false;
        }
    }

    /* ---------------------------------------------
     * Backend errors
     * --------------------------------------------- */
    private handleBackendErrors(error: any): void {
        if (error?.error?.errors) {
            Object.keys(error.error.errors).forEach((field) => {
                const control = this.form.get(this.normalizeFieldName(field));
                if (control) {
                    control.setErrors({ backend: error.error.errors[field][0] });
                }
            });
        }
    }

    private normalizeFieldName(apiField: string): string {
        return apiField.charAt(0).toLowerCase() + apiField.slice(1);
    }
}
