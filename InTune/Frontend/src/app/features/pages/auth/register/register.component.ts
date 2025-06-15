import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  readonly #auth = inject(AuthService);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  
  //submitted: boolean = false;
  formError: string[] | null = null;

  registerForm: FormGroup = this.#formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    lastname: ['', Validators.required],
    birthdate: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

registerUser() {
  //this.submitted = true;
  this.formError = null;

  if (this.registerForm.invalid) {
    this.formError = ['Por favor, completa todos los campos correctamente.'];
    return;
  }

  this.formError = null;

  this.#auth.register(this.registerForm.value).subscribe({
    next: res => {this.#auth.saveToken(res.token),
    this.#router.navigate(['/home'])},
    error: err => {
      if (err.error?.message) {
        this.formError = [err.error.message];
      } else if (err.error?.errors) {
        this.formError = Object.values(err.error.errors)
          .flatMap(error => Array.isArray(error) ? error : [error]);
      } else {
        this.formError = ['Error inesperado del servidor.'];
      }
    }
  });
}

}
