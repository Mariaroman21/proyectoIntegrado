import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { User } from '../../../../shared/interfaces/user.interface';


@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  
  #message = "";

  readonly #formBuilder = inject(FormBuilder);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  //submitted: boolean = false;
  formError: string[] | null = null;

  loginForm: FormGroup = this.#formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  

  loginUser(){
    //this.submitted = true;
    this.formError = null;

    if (this.loginForm.invalid) {
      this.formError = ['Por favor, completa todos los campos correctamente.'];
      return;
    }
  
      const user: User ={
        ...this.loginForm.value
      }
      this.#authService.login(user.username, user.password).subscribe({
        next: (response) => {
          this.#authService.saveToken(response.token);
          this.#router.navigate(['/home']);
          console.log('Token guardado, navegando a /home');
        },
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
      console.log("Logueado corectamente", user.username);
    
    
  }
}
