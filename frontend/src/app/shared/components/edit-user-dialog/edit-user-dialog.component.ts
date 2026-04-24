import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { UserDto, UserUpdateRequest } from '../../../core/models';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDto,
  ) {
    this.form = this.fb.group({
      fullName: [data.fullName, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
      role: [data.role, [Validators.required]],
      status: [data.status, [Validators.required]],
      teacherVerified: [data.teacherVerified],
      pirivenName: [data.pirivenName || ''],
      pirivenAddress: [data.pirivenAddress || ''],
      phoneNumber: [data.phoneNumber || ''],
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as UserUpdateRequest);
    }
  }
}
