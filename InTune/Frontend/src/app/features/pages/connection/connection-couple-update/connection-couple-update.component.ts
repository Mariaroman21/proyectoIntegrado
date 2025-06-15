import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ConnectionService } from '../../../../shared/services/connection/connection.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-couple-update',
  imports: [ReactiveFormsModule, RouterLink, CommonModule,],
  templateUrl: './connection-couple-update.component.html',
})
export class ConnectionCoupleUpdateComponent {
  readonly #connectionService = inject(ConnectionService);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #formBuilder = inject(FormBuilder);

  coupleId = this.#route.snapshot.paramMap.get('id')!;

  form = signal<FormGroup>(this.createEmptyForm());

  loadResource = rxResource({
    loader: () => this.#connectionService.getConnectionById(this.coupleId)
  });


  loadEffect = effect(() => {
    const couple = this.loadResource.value();
    if (couple) {
      const fg = this.#formBuilder.group({
        start_date: [couple.start_date, Validators.required],
        plans: this.#formBuilder.array(
          (couple.plans.length ? couple.plans : [{}]).map((plan: any) =>
            this.#formBuilder.group({
              id: [plan.id ?? ''],
              plan: [plan.plan ?? '', Validators.required],
              photo: [plan.photo ?? ''],
            })
          )
        ),
      });
      this.form.set(fg);
    }
  });

  get plans(): FormArray {
    return this.form().get('plans') as FormArray;
  }

  addPlan() {
    this.plans.push(this.#formBuilder.group({
      id: [''],
      plan: ['', Validators.required],
      photo: [''],
    }));
  }

  removePlan(index: number) {
    this.plans.removeAt(index);
  }

  onSubmit() {
    if (this.form().invalid) return;
    const updatedCouple = this.form().value;
    this.#connectionService.updateConnection(this.coupleId, updatedCouple).subscribe(() => {
      this.#router.navigate(['/connections', this.coupleId, 'couple']);
    });
  }

  createEmptyForm(): FormGroup {
    return this.#formBuilder.group({
      start_date: ['', Validators.required],
      plans: this.#formBuilder.array([]),
    });
  }
}
