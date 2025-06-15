import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionService } from '../../../../shared/services/connection/connection.service';

@Component({
  selector: 'app-connection-new',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connection-new.component.html',
})
export class ConnectionNewComponent {

  readonly #formBuilder= inject(FormBuilder);
  readonly #connectionService= inject(ConnectionService)
  readonly #router= inject(Router)

  formError: string[] | null = null;

  relationshipOptions = [
    { value: 'familiar', label: 'Familiar', emoji: '🧑‍🤝‍🧑' },
    { value: 'pareja', label: 'Pareja', emoji: '👩‍❤️‍👩' },
    { value: 'amigo', label: 'Amigo/a', emoji: '🧑‍🤝‍🧑' }
  ];

  selectedType: string = '';

  connectionForm : FormGroup= this.#formBuilder.group({
    type: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  selectType(value: string) {
    this.selectedType = value;
    this.connectionForm.get('type')?.setValue(value);
  }

  createConnection() {
    this.formError = null;

    if (this.connectionForm.valid && this.selectedType) {
      const connectionData = {
        ...this.connectionForm.value,
        type: this.selectedType
      };
  
      console.log('Intentando crear conexión');
      console.log('Datos que envío al backend:', connectionData);

      this.#connectionService.createConnection(connectionData).subscribe({
        next: () => this.#router.navigate(['/home']),
        error: err => {
          if (err.error?.message) {
            this.formError = [err.error.message];
          } else if (err.error?.errors) {
            this.formError = Object.values(err.error.errors)
              .flatMap(error => Array.isArray(error) ? error : [error]);
          } else {
            this.formError = ['Error inesperado del servidor.'];
          }
          console.error(err); 
        }
      });
  
    } else {
      this.formError = ['Por favor, completa todos los campos obligatorios y selecciona un tipo.'];
      console.warn('Formulario no válido o tipo no seleccionado');
    }
  
  }
}