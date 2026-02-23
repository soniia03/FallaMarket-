import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrajeService } from '../../services/product.service';
import { Traje, MaterialInfo } from '../../models/interfaces';

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
              {{ isEditMode ? 'Editar Traje' : 'Nuevo Traje' }}
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
                  <div *ngIf="trajeForm.get('nombre')?.errors?.['required']">
                    El nombre es obligatorio
                  </div>
                  <div *ngIf="trajeForm.get('nombre')?.errors?.['minlength']">
                    El nombre debe tener al menos 3 caracteres
                  </div>
                  <div *ngIf="trajeForm.get('nombre')?.errors?.['maxlength']">
                    El nombre no puede superar los 100 caracteres
                  </div>
                </div>
              </div>

              <!-- Material -->
              <div class="mb-3">
                <label for="material" class="form-label">
                  Material *
                </label>
                <div class="row">
                  <div class="col-md-8">
                    <select id="material"
                            class="form-select"
                            formControlName="material"
                            (change)="onMaterialChange($event)"
                            [class.is-invalid]="trajeForm.get('material')?.invalid && trajeForm.get('material')?.touched">
                      <option value="">Selecciona un material</option>
                      <option *ngFor="let material of materiales" [value]="material.key">
                        {{ material.label }}
                      </option>
                      <option value="custom">Otro (escribir manualmente)</option>
                    </select>
                  </div>
                  <div class="col-md-4" *ngIf="showCustomMaterial">
                    <input type="text" 
                           class="form-control"
                           formControlName="customMaterial"
                           placeholder="Material personalizado">
                  </div>
                </div>
                <div class="invalid-feedback" 
                     *ngIf="trajeForm.get('material')?.invalid && trajeForm.get('material')?.touched">
                  El material es obligatorio
                </div>
                <div class="form-text">
                  Selecciona el material principal del traje
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
                       placeholder="Nombre del propietario del traje"
                       [class.is-invalid]="trajeForm.get('propietario')?.invalid && trajeForm.get('propietario')?.touched">
                <div class="invalid-feedback" 
                     *ngIf="trajeForm.get('propietario')?.invalid && trajeForm.get('propietario')?.touched">
                  <div *ngIf="trajeForm.get('propietario')?.errors?.['required']">
                    El propietario es obligatorio
                  </div>
                  <div *ngIf="trajeForm.get('propietario')?.errors?.['minlength']">
                    El nombre del propietario debe tener al menos 2 caracteres
                  </div>
                  <div *ngIf="trajeForm.get('propietario')?.errors?.['maxlength']">
                    El nombre del propietario no puede superar los 100 caracteres
                  </div>
                </div>
                <div class="form-text">
                  Persona responsable del traje
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
                          rows="3"
                          placeholder="Describe el traje, sus características, historia, etc."
                          [class.is-invalid]="trajeForm.get('descripcion')?.invalid && trajeForm.get('descripcion')?.touched"></textarea>
                <div class="invalid-feedback" 
                     *ngIf="trajeForm.get('descripcion')?.invalid && trajeForm.get('descripcion')?.touched">
                  <div *ngIf="trajeForm.get('descripcion')?.errors?.['required']">
                    La descripción es obligatoria
                  </div>
                  <div *ngIf="trajeForm.get('descripcion')?.errors?.['minlength']">
                    La descripción debe tener al menos 10 caracteres
                  </div>
                  <div *ngIf="trajeForm.get('descripcion')?.errors?.['maxlength']">
                    La descripción no puede superar los 1000 caracteres
                  </div>
                </div>
              </div>

              <!-- Precio -->
              <div class="mb-3">
                <label for="precio" class="form-label">
                  Precio (€) *
                </label>
                <div class="input-group">
                  <span class="input-group-text">€</span>
                  <input type="number" 
                         id="precio"
                         class="form-control"
                         formControlName="precio"
                         placeholder="0.00"
                         step="0.01"
                         min="0"
                         [class.is-invalid]="trajeForm.get('precio')?.invalid && trajeForm.get('precio')?.touched">
                </div>
                <div class="invalid-feedback d-block" 
                     *ngIf="trajeForm.get('precio')?.invalid && trajeForm.get('precio')?.touched">
                  <div *ngIf="trajeForm.get('precio')?.errors?.['required']">
                    El precio es obligatorio
                  </div>
                  <div *ngIf="trajeForm.get('precio')?.errors?.['min']">
                    El precio no puede ser negativo
                  </div>
                </div>
              </div>

              <!-- Disponibilidad -->
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input class="form-check-input" 
                         type="checkbox" 
                         id="disponible"
                         formControlName="disponible">
                  <label class="form-check-label" for="disponible">
                    <strong>Disponible</strong>
                    <small class="text-muted d-block">Marca si el traje está disponible para compra o intercambio</small>
                  </label>
                </div>
              </div>

              <!-- Información adicional (solo visual) -->
              <div class="alert alert-info" *ngIf="isEditMode">
                <h6><i class="fas fa-info-circle me-2"></i>Información del registro</h6>
                <div class="row">
                  <div class="col-md-6" *ngIf="existingTraje?.createdAt">
                    <small>
                      <strong>Creado:</strong><br>
                      {{ formatDate(existingTraje?.createdAt!) }}
                    </small>
                  </div>
                  <div class="col-md-6" *ngIf="existingTraje?.updatedAt && existingTraje?.updatedAt !== existingTraje?.createdAt">
                    <small>
                      <strong>Última modificación:</strong><br>
                      {{ formatDate(existingTraje?.updatedAt!) }}
                    </small>
                  </div>
                </div>
              </div>

              <!-- Botones -->
              <div class="d-flex gap-2 justify-content-end">
                <button type="button" 
                        class="btn btn-secondary"
                        (click)="cancel()"
                        [disabled]="submitting">
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
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: none;
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom: none;
    }
    
    .loading-spinner {
      padding: 3rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }
    
    .form-control:focus, .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    
    .alert-info {
      background-color: #f8f9ff;
      border-color: #667eea;
      color: #495057;
    }
  `]
})
export class TrajeFormComponent implements OnInit {
  trajeForm: FormGroup;
  materiales: MaterialInfo[] = [];
  isEditMode = false;
  trajeId: string | null = null;
  existingTraje: Traje | null = null;
  loading = false;
  submitting = false;
  showCustomMaterial = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private trajeService: TrajeService
  ) {
    this.trajeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadMateriales();
    this.checkEditMode();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      material: ['', Validators.required],
      customMaterial: [''],
      propietario: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      precio: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      disponible: [true]
    });
  }

  loadMateriales(): void {
    this.materiales = this.trajeService.getMateriales();
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
        if (traje) {
          this.existingTraje = traje;
          
          // Verificar si el material está en la lista predefinida
          const materialExists = this.materiales.some(m => 
            m.key === traje.material.toLowerCase() || m.label.toLowerCase() === traje.material.toLowerCase()
          );
          
          if (materialExists) {
            const material = this.materiales.find(m => 
              m.key === traje.material.toLowerCase() || m.label.toLowerCase() === traje.material.toLowerCase()
            );
            this.trajeForm.patchValue({
              nombre: traje.nombre,
              material: material?.key || traje.material,
              propietario: traje.propietario,
              descripcion: traje.descripcion,
              precio: traje.precio,
              disponible: traje.disponible
            });
          } else {
            // Material personalizado
            this.showCustomMaterial = true;
            this.trajeForm.patchValue({
              nombre: traje.nombre,
              material: 'custom',
              customMaterial: traje.material,
              propietario: traje.propietario,
              descripcion: traje.descripcion,
              precio: traje.precio,
              disponible: traje.disponible
            });
          }
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

  onMaterialChange(event: any): void {
    const selectedValue = event.target.value;
    this.showCustomMaterial = selectedValue === 'custom';
    
    if (selectedValue !== 'custom') {
      this.trajeForm.get('customMaterial')?.setValue('');
    }
  }

  onSubmit(): void {
    if (this.trajeForm.valid && !this.submitting) {
      this.submitting = true;
      
      const formData = this.trajeForm.value;
      
      // Determinar el material final
      let finalMaterial = formData.material;
      if (formData.material === 'custom' && formData.customMaterial) {
        finalMaterial = formData.customMaterial.trim();
      } else if (formData.material !== 'custom') {
        // Buscar el label del material seleccionado
        const selectedMaterial = this.materiales.find(m => m.key === formData.material);
        finalMaterial = selectedMaterial ? selectedMaterial.label : formData.material;
      }

      const trajeData: Omit<Traje, '_id' | 'createdAt' | 'updatedAt'> = {
        nombre: formData.nombre.trim(),
        material: finalMaterial,
        propietario: formData.propietario.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        disponible: formData.disponible
      };

      if (this.isEditMode) {
        this.updateTraje(trajeData);
      } else {
        this.createTraje(trajeData);
      }
    }
  }

  createTraje(trajeData: Omit<Traje, '_id' | 'createdAt' | 'updatedAt'>): void {
    this.trajeService.createTraje(trajeData).subscribe({
      next: (traje) => {
        if (traje && traje._id) {
          this.router.navigate(['/trajes', traje._id]);
        } else {
          this.router.navigate(['/trajes']);
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error creating traje:', error);
        alert('Error al crear el traje. Verifica que todos los campos estén llenos correctamente.');
        this.submitting = false;
      }
    });
  }

  updateTraje(trajeData: Omit<Traje, '_id' | 'createdAt' | 'updatedAt'>): void {
    if (!this.trajeId) return;

    this.trajeService.updateTraje(this.trajeId, trajeData).subscribe({
      next: (traje) => {
        if (traje && traje._id) {
          this.router.navigate(['/trajes', this.trajeId]);
        } else {
          this.router.navigate(['/trajes']);
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error updating traje:', error);
        alert('Error al actualizar el traje. Verifica que todos los campos estén llenos correctamente.');
        this.submitting = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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