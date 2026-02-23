import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { Product, User } from '../../models/interfaces';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">
              <i [class]="isEditMode ? 'fas fa-edit' : 'fas fa-plus'" class="me-2"></i>
              {{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}
            </h3>
          </div>
          <div class="card-body">
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
              <!-- Nombre del producto -->
              <div class="mb-3">
                <label for="name" class="form-label">
                  Nombre del producto *
                </label>
                <input type="text" 
                       id="name"
                       class="form-control"
                       formControlName="name"
                       placeholder="Ej: Traje Fallero Siglo XVIII"
                       [class.is-invalid]="productForm.get('name')?.invalid && productForm.get('name')?.touched">
                <div class="invalid-feedback" 
                     *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched">
                  El nombre es obligatorio (mínimo 3 caracteres)
                </div>
              </div>

              <!-- Descripción -->
              <div class="mb-3">
                <label for="description" class="form-label">
                  Descripción *
                </label>
                <textarea id="description"
                          class="form-control"
                          formControlName="description"
                          rows="4"
                          placeholder="Describe el producto, su estado, incluye detalles..."
                          [class.is-invalid]="productForm.get('description')?.invalid && productForm.get('description')?.touched"></textarea>
                <div class="form-text">
                  {{ productForm.get('description')?.value?.length || 0 }}/500 caracteres
                </div>
                <div class="invalid-feedback" 
                     *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched">
                  La descripción es obligatoria (mínimo 10 caracteres)
                </div>
              </div>

              <!-- Precio -->
              <div class="mb-3">
                <label for="price" class="form-label">
                  Precio (€) *
                </label>
                <div class="input-group">
                  <input type="number" 
                         id="price"
                         class="form-control"
                         formControlName="price"
                         placeholder="0.00"
                         step="0.01"
                         min="0"
                         [class.is-invalid]="productForm.get('price')?.invalid && productForm.get('price')?.touched">
                  <span class="input-group-text">€</span>
                </div>
                <div class="invalid-feedback" 
                     *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched">
                  El precio es obligatorio y debe ser mayor a 0
                </div>
              </div>

              <!-- Categoría -->
              <div class="mb-3">
                <label for="category" class="form-label">
                  Categoría *
                </label>
                <select id="category"
                        class="form-select"
                        formControlName="category"
                        [class.is-invalid]="productForm.get('category')?.invalid && productForm.get('category')?.touched">
                  <option value="">Selecciona una categoría</option>
                  <option *ngFor="let category of categories" [value]="category.key">
                    <i [class]="category.icon"></i>
                    {{ category.label }}
                  </option>
                </select>
                <div class="invalid-feedback" 
                     *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched">
                  La categoría es obligatoria
                </div>
              </div>

              <!-- Estado/Condición -->
              <div class="mb-3">
                <label for="condition" class="form-label">
                  Estado del producto *
                </label>
                <select id="condition"
                        class="form-select"
                        formControlName="condition"
                        [class.is-invalid]="productForm.get('condition')?.invalid && productForm.get('condition')?.touched">
                  <option value="">Selecciona el estado</option>
                  <option *ngFor="let condition of conditions" [value]="condition.key">
                    {{ condition.label }}
                  </option>
                </select>
                <div class="invalid-feedback" 
                     *ngIf="productForm.get('condition')?.invalid && productForm.get('condition')?.touched">
                  El estado es obligatorio
                </div>
              </div>

              <!-- Vendedor -->
              <div class="mb-3">
                <label for="seller" class="form-label">
                  Vendedor *
                </label>
                <select id="seller"
                        class="form-select"
                        formControlName="seller"
                        [class.is-invalid]="productForm.get('seller')?.invalid && productForm.get('seller')?.touched">
                  <option value="">Selecciona un vendedor</option>
                  <option *ngFor="let user of users" [value]="user._id">
                    {{ user.name }} - {{ user.email }}
                  </option>
                </select>
                <div class="invalid-feedback" 
                     *ngIf="productForm.get('seller')?.invalid && productForm.get('seller')?.touched">
                  El vendedor es obligatorio
                </div>
              </div>

              <!-- Imágenes -->
              <div class="mb-3">
                <label class="form-label">
                  URLs de Imágenes (opcional)
                </label>
                <div class="image-inputs">
                  <div class="input-group mb-2" *ngFor="let imageControl of imageControls; let i = index">
                    <input type="url" 
                           class="form-control"
                           [formControlName]="'image' + i"
                           placeholder="https://ejemplo.com/imagen.jpg">
                    <button type="button" 
                            class="btn btn-outline-danger"
                            (click)="removeImageField(i)"
                            *ngIf="imageControls.length > 1">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <button type="button" 
                          class="btn btn-outline-secondary btn-sm"
                          (click)="addImageField()"
                          *ngIf="imageControls.length < 5">
                    <i class="fas fa-plus me-1"></i>
                    Agregar imagen
                  </button>
                </div>
              </div>

              <!-- Disponible -->
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" 
                         type="checkbox" 
                         id="available"
                         formControlName="available">
                  <label class="form-check-label" for="available">
                    Producto disponible para la venta
                  </label>
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
                        [disabled]="!productForm.valid || submitting">
                  <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!submitting" [class]="isEditMode ? 'fas fa-save' : 'fas fa-plus'" class="me-2"></i>
                  {{ isEditMode ? 'Actualizar' : 'Crear' }} Producto
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
  `
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];
  conditions: any[] = [];
  users: User[] = [];
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  submitting = false;
  imageControls: any[] = [0]; // Array para controlar inputs de imágenes

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadConditions();
    this.loadUsers();
    this.checkEditMode();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      condition: ['nuevo', Validators.required],
      seller: ['', Validators.required],
      available: [true],
      image0: [''],
      image1: [''],
      image2: [''],
      image3: [''],
      image4: ['']
    });
  }

  loadCategories(): void {
    this.categories = this.productService.getCategories();
  }

  loadConditions(): void {
    this.conditions = this.productService.getConditions();
  }

  loadUsers(): void {
    this.userService.getActiveUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
        }
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  checkEditMode(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProductForEdit();
    }
  }

  loadProductForEdit(): void {
    if (!this.productId) return;

    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const product = response.data;
          
          // Rellenar el formulario con los datos del producto
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            condition: product.condition,
            seller: typeof product.seller === 'string' ? product.seller : product.seller._id,
            available: product.available
          });

          // Rellenar las imágenes
          if (product.images && product.images.length > 0) {
            this.imageControls = new Array(Math.max(1, product.images.length));
            product.images.forEach((image, index) => {
              if (index < 5) {
                this.productForm.get(`image${index}`)?.setValue(image);
              }
            });
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product for edit:', error);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  addImageField(): void {
    if (this.imageControls.length < 5) {
      this.imageControls.push(this.imageControls.length);
    }
  }

  removeImageField(index: number): void {
    if (this.imageControls.length > 1) {
      this.imageControls.splice(index, 1);
      // Reorganizar los valores de las imágenes
      const imageValues = this.imageControls.map((_, i) => 
        this.productForm.get(`image${i}`)?.value || ''
      );
      
      // Limpiar todos los campos de imagen
      for (let i = 0; i < 5; i++) {
        this.productForm.get(`image${i}`)?.setValue('');
      }
      
      // Volver a asignar los valores reorganizados
      imageValues.forEach((value, i) => {
        this.productForm.get(`image${i}`)?.setValue(value);
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.submitting) {
      this.submitting = true;
      
      const formData = this.productForm.value;
      
      // Recopilar las imágenes que no estén vacías
      const images = [];
      for (let i = 0; i < 5; i++) {
        const imageUrl = formData[`image${i}`];
        if (imageUrl && imageUrl.trim()) {
          images.push(imageUrl.trim());
        }
      }

      const productData: Product = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        seller: formData.seller,
        images: images,
        available: formData.available
      };

      if (this.isEditMode) {
        this.updateProduct(productData);
      } else {
        this.createProduct(productData);
      }
    }
  }

  createProduct(productData: Product): void {
    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.router.navigate(['/products', response.data._id]);
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error creating product:', error);
        alert('Error al crear el producto');
        this.submitting = false;
      }
    });
  }

  updateProduct(productData: Product): void {
    if (!this.productId) return;

    this.productService.updateProduct(this.productId, productData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.router.navigate(['/products', this.productId]);
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Error al actualizar el producto');
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.productId) {
      this.router.navigate(['/products', this.productId]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}