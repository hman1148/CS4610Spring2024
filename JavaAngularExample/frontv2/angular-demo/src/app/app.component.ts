import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserStore } from './stores/user.store';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { patchState, signalState } from '@ngrx/signals';
import { initialState } from './app.component.state';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TableModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly userStore = inject(UserStore);
  readonly formBuilder = inject(FormBuilder);

  readonly state = signalState(initialState());

  ngOnInit(): void {
    patchState(this.state, {
      userForm: this.formBuilder.group({
        id: [''],
        name: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        age: [0],
      }) as FormGroup,
    });
  }
  showAddDialog(): void {
    patchState(this.state, {
      dialogTitle: 'Add User',
      isDialogVisible: true,
      userForm: this.formBuilder.group({
        id: [''],
        name: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        age: [0],
      }),
    });
  }

  showEditDialog(user: User): void {
    patchState(this.state, {
      dialogTitle: 'Edit User',
      isDialogVisible: true,
      userForm: this.formBuilder.group({
        id: [user.id],
        name: [user.name, Validators.required],
        email: [user.email, Validators.required, Validators.email],
        age: [user.age],
      }),
    });
  }

  hideDialog(): void {
    patchState(this.state, {
      isDialogVisible: false,
    });
  }
}
