import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrajeService } from '../../services/product.service';
import { Traje } from '../../models/interfaces';

@Component({
  selector: 'app-traje-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">
              <i [class]="isEditMode ? 'fas fa-edit' : 'fas fa-plus'" class="me-2"></i>
              {{ isEditMode ? 'Editar Traje' : 'Nuevo Traje Fallero' }}
            </h3>
          </div>
          <div class="card-body">
            <form [formGroup]="trajeForm" (ngSubmit)="onSubmit()">
              <!-- Nombre del traje -->
              <div class="mb-3">
                <label for="nombre" class="form-label">
                  Nombre del traje *
                </label>
                <input type="text" 
                       id="nombre"
                       class="form-control"
                       formControlName="nombre"
                       placeholder="Ej: Traje Fallero Siglo XVIII"
                       [class.is-invalid]="trajeForm.get('nombre')?.invalid && trajeForm.get('nombre')?.touched">
                <div class="invalid-feedback" 
                     *ngIf="trajeForm.get('nombre')?.invalid && trajeForm.get('nombre')?.touched">
                  El nombre es obligatorio (mínimo 3 caracteres)
                </div>
              </div>

              <!-- Material -->
              <div class="mb-3">
                <label for="material" class="form-label">
                  Material *
                </label>
                <select id="material"
                        class="form-select"
                        formControlName="material"
                        [class.is-invalid]="trajeForm.get('material')?.invalid && trajeForm.get('material')?.touched">
                  <option value="">Selecciona un material</option>
                  <option value="Seda">Seda</option>
                  <option value="Terciopelo">Terciopelo</option>
                  <option value="Brocado">Brocado</option>
                  <option value="Tafetán">Tafetán</option>
                  <option value="Raso">Raso</option>
                  <option value="Algodón">Algodón</option>
                  <option value="Otro">Otro</option>
                </select>
                <div class="invalid-feedback" 
                     *ngIf="trajeForm.get('material')?.invalid && trajeForm.get('material')?.touched">
                  El material es obligatorio
                </div>
              </div>

              <!-- Propietario -->
              <div class="mb-3">
                <label for="propietario" class="form-label">
                  Propietario *
                </label>
                <input type="text" 
                       id="propietario"
                       class="form-control"
                       formControlName="propietario"
                       placeholder="Nombre del propietario"
                       [class.is-invalid]="trajeForm.get('propietario')?.invalid && trajeForm.get('propietario')?.touched">
                <div class="invalid-feedback" 
                     *ngIf="trajeForm.get('propietario')?.invalid && trajeForm.get('propietario')?.touched">
                  El propietario es obligatorio
                </div>
              </div>

              <!-- Descripción -->
              <div class="mb-3">
                <label for="descripcion" class="form-label">
                  Descripción *
                </label>
                <textarea id="descripcion"
                          class="form-control"
                          formControlName="descripcion"
                          rows="4"
                          placeholder="Describe el traje fallero, su estilo, época histórica..."
                          [class.is-invalid]="trajeForm.get('descripcion')?.invalid && trajeForm.get('descripcion')?.touched"></textarea>
                <div class="form-text">
                  {{ trajeForm.get('descripcion')?.value?.length || 0 }}/500 caracteres
                </div>
                <div class="invalid-feedback" 
                     *ngIf="trajeForm.get('descripcion')?.invalid && trajeForm.get('descripcion')?.touched">
                  La descripción es obligatoria (mínimo 10 caracteres)
                </div>
              </div>

              <!-- Precio -->
              <div class="mb-3">
                <label for="precio" class="form-label">
                  Precio (€) *
                </label>
                <div class="input-group">
                  <input type="number" 
                         id="precio"
                         class="form-control"
                         formControlName="precio"
                         placeholder="0.00"
                         step="0.01"
                         min="0"
                         [class.is-invalid]="trajeForm.get('precio')?.invalid && trajeForm.get('precio')?.touched">
                  <span class="input-group-text">€</span>
                </div>
                <div class="invalid-feedback" 
                     *ngIf="trajeForm.get('precio')?.invalid && trajeForm.get('precio')?.touched">
                  El precio es obligatorio y debe ser mayor a 0
                </div>
              </div>

              <!-- Disponible -->
              <div class="mb-4">
                <div class="form-check">
                  <input class="form-check-input" 
                         type="checkbox" 
                         id="disponible"
                         formControlName="disponible">
                  <label class="form-check-label" for="disponible">
                    <i class="fas fa-crown me-2"></i>
                    Traje disponible
                  </label>
                  <small class="form-text text-muted d-block">
                    Marca si el traje está disponible para alquiler o venta
                  </small>
                </div>
              </div>

              <!-- Botones -->
              <div class="d-flex gap-2 justify-content-end">
                <button type="button" 
                        class="btn btn-secondary"
                        (click)="cancel()">
                  <i class="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button type="submit" 
                        class="btn btn-primary"
                        [disabled]="!trajeForm.valid || submitting">
                  <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!submitting" [class]="isEditMode ? 'fas fa-save' : 'fas fa-plus'" class="me-2"></i>
                  {{ isEditMode ? 'Actualizar' : 'Crear' }} Traje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div class="text-center" *ngIf="loading">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando traje...</span>
        </div>
      </div>
    </div>
  `
})
export class TrajeFormComponent implements OnInit {
  trajeForm: FormGroup;
  isEditMode = false;
  trajeId: string | null = null;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private trajeService: TrajeService
  ) {
    this.trajeForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      material: ['', Validators.required],
      propietario: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      disponible: [true]
    });
  }

  checkEditMode(): void {
    this.trajeId = this.route.snapshot.paramMap.get('id');
    if (this.trajeId) {
      this.isEditMode = true;
      this.loadTrajeForEdit();
    }
  }

  loadTrajeForEdit(): void {
    if (!this.trajeId) return;

    this.loading = true;
    this.trajeService.getTrajeById(this.trajeId).subscribe({
      next: (traje) => {
        if (traje && traje._id) {
          // Rellenar el formulario con los datos del traje
          this.trajeForm.patchValue({
            nombre: traje.nombre,
            material: traje.material,
            propietario: traje.propietario,
            descripcion: traje.descripcion,
            precio: traje.precio,
            disponible: traje.disponible
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading traje for edit:', error);
        this.loading = false;
        this.router.navigate(['/trajes']);
      }
    });
  }

  onSubmit(): void {
    if (this.trajeForm.valid && !this.submitting) {
      this.submitting = true;
      
      const formData = this.trajeForm.value;
      
      const trajeData: Traje = {
        nombre: formData.nombre.trim(),
        material: formData.material.trim(),
        propietario: formData.propietario.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        disponible: formData.disponible
      };

      if (this.isEditMode) {
        this.updateTraje(trajeData);
      } else {
        this.createTraje(trajeData);
      }
    }
  }

  createTraje(trajeData: Traje): void {
    this.trajeService.createTraje(trajeData).subscribe({
      next: (traje) => {
        if (traje && traje._id) {
          alert('Traje creado exitosamente');
          this.router.navigate(['/trajes', traje._id]);
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error creating traje:', error);
        alert('Error al crear el traje');
        this.submitting = false;
      }
    });
  }

  updateTraje(trajeData: Traje): void {
    if (!this.trajeId) return;

    this.trajeService.updateTraje(this.trajeId, trajeData).subscribe({
      next: (traje) => {
        if (traje && traje._id) {
          alert('Traje actualizado exitosamente');
          this.router.navigate(['/trajes', this.trajeId]);
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error updating traje:', error);
        alert('Error al actualizar el traje');
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.trajeId) {
      this.router.navigate(['/trajes', this.trajeId]);
    } else {
      this.router.navigate(['/trajes']);
    }
  }
}