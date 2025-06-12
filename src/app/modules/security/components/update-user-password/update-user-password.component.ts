import { Component, Inject, OnInit } from '@angular/core';
import { CoreModule } from '../../../../core/modules/core.module';
import { MaterialFormModule } from '../../../../core/modules/material-form.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../user/services/user.service';
import { DialogMessageService } from '../../../../core/services/dialog-message.service';
import { DefaultMessageService } from '../../../../core/services/default-message.service';
import { SecurityService } from '../../services/security.service';
import { LoginResponseDTO } from '../../models/user-login-response.dto';
import { UpdateUserPasswordDTO } from '../../../user/models/update-user-password.dto';

@Component({
  selector: 'app-update-user-password',
  standalone: true,
  imports: [
    CoreModule,
    MaterialFormModule,
    MatDialogModule,
    DragDropModule,
  ],
  templateUrl: './update-user-password.component.html',
  styleUrl: './update-user-password.component.css'
})
export class UpdateUserPasswordComponent implements OnInit {

  entityName: string = 'contraseña';

  entityForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UpdateUserPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: null,
    private dialogMessageService: DialogMessageService,
    private defaulMessage: DefaultMessageService,
    private securityService: SecurityService
  ) {
  }

  ngOnInit(): void {
    this.createFormControls();
  }

  createFormControls() {
    this.entityForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    },
      { validators: this.passwordMatchValidator });
  }
  private passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  save() {

    if (this.entityForm.hasError('mismatch')) {
      this.dialogMessageService.showErrorDialog('Las contraseñas no coinciden.');
      return;
    }

    if (!this.password?.valid) {
      this.dialogMessageService.showErrorDialog('Ingrese la nueva contraseña.');
      return;
    }
    if (!this.password?.valid) {
      this.dialogMessageService.showErrorDialog('Confirme la nueva contraseña.');
      return;
    }

    this.executeSave();
  }

  executeSave() {
    let currentUser: LoginResponseDTO = this.securityService.getCurrentUser()!;
    if (currentUser) {
      const entityAux: UpdateUserPasswordDTO = {
        id: currentUser.id!,
        newPassword: this.password?.value.trim()
      };

      this.userService.updateUserPassword(entityAux).subscribe({
        next: response => {
          if (response.status) {
            this.dialogMessageService.showSuccessDialog(response.message.description)
              .afterClosed().subscribe(result => {
                this.dialogRef.close({ status: response.status, data: null });
              });
          } else {
            this.dialogMessageService.showErrorDialog(response.message.description);
          }
        },
        error: error => {
          this.dialogMessageService.showErrorDialog(error.error.message.description);
        }
      });

    }
  }

  //#region GETTERS
  get password() {
    return this.entityForm.get('password');
  }
  get confirmPassword() {
    return this.entityForm.get('confirmPassword');
  }
  //#endregion

}
