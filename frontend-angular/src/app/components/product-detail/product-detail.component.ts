import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, User } from '../../models/interfaces';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="!loading && product" class="row">
      <!-- Imágenes del producto -->
      <div class="col-md-6">
        <div class="card">
          <div class="position-relative">
            <img 
              [src]="currentImage || '/assets/images/no-image.jpg'" 
              class="card-img-top"
              [alt]="product.name"
              style="height: 400px; object-fit: cover;">
            <span class="badge position-absolute top-0 end-0 m-3 fs-6"
                  [ngClass]="getConditionClass(product.condition)">
              {{ getConditionLabel(product.condition) }}
            </span>
            <span class="badge position-absolute top-0 start-0 m-3 fs-6"
                  [ngClass]="'bg-' + getCategoryColor(product.category)">
              {{ getCategoryLabel(product.category) }}
            </span>
          </div>
          
          <!-- Galería de imágenes -->
          <div class="card-body" *ngIf="product.images && product.images.length > 1">
            <div class="row">
              <div class="col-3" *ngFor="let image of product.images">
                <img 
                  [src]="image" 
                  class="img-thumbnail"
                  style="cursor: pointer; height: 80px; object-fit: cover;"
                  (click)="currentImage = image"
                  [class.border-primary]="currentImage === image">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del producto -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h2 class="mb-0">{{ product.name }}</h2>
          </div>
          <div class="card-body">
            <!-- Precio -->
            <div class="price-section mb-4">
              <span class="price-tag display-6">{{ formatPrice(product.price) }}</span>
              <span class="badge bg-success ms-2" *ngIf="product.available">
                Disponible
              </span>
              <span class="badge bg-danger ms-2" *ngIf="!product.available">
                No Disponible
              </span>
            </div>

            <!-- Descripción -->
            <div class="description-section mb-4">
              <h5>Descripción</h5>
              <p class="text-muted">{{ product.description }}</p>
            </div>

            <!-- Detalles del producto -->
            <div class="details-section mb-4">
              <h5>Detalles</h5>
              <table class="table table-borderless">
                <tr>
                  <td><strong>Categoría:</strong></td>
                  <td>
                    <span class="badge" [ngClass]="'bg-' + getCategoryColor(product.category)">
                      {{ getCategoryLabel(product.category) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><strong>Estado:</strong></td>
                  <td>
                    <span class="badge" [ngClass]="getConditionClass(product.condition)">
                      {{ getConditionLabel(product.condition) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><strong>Disponible:</strong></td>
                  <td>
                    <i class="fas" 
                       [class.fa-check-circle]="product.available"
                       [class.fa-times-circle]="!product.available"
                       [class.text-success]="product.available"
                       [class.text-danger]="!product.available"></i>
                    {{ product.available ? 'Sí' : 'No' }}
                  </td>
                </tr>
                <tr *ngIf="product.createdAt">
                  <td><strong>Publicado:</strong></td>
                  <td>{{ formatDate(product.createdAt) }}</td>
                </tr>
              </table>
            </div>

            <!-- Información del vendedor -->
            <div class="seller-section mb-4" *ngIf="seller">
              <h5>Información del Vendedor</h5>
              <div class="card bg-light">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <i class="fas fa-user-circle fa-3x text-primary"></i>
                    </div>
                    <div class="col">
                      <h6 class="mb-1">{{ seller.name }}</h6>
                      <p class="mb-1 text-muted">
                        <i class="fas fa-envelope me-1"></i>
                        {{ seller.email }}
                      </p>
                      <p class="mb-1 text-muted" *ngIf="seller.phone">
                        <i class="fas fa-phone me-1"></i>
                        {{ seller.phone }}
                      </p>
                      <p class="mb-0 text-muted" *ngIf="seller.location">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        {{ seller.location }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="actions-section">
              <div class="d-grid gap-2">
                <button class="btn btn-success btn-lg" 
                        *ngIf="product.available && product.condition !== 'vendido' && product.condition !== 'reservado'"
                        (click)="contactSeller()">
                  <i class="fas fa-envelope me-2"></i>
                  Contactar Vendedor
                </button>
                
                <button class="btn btn-warning" 
                        *ngIf="product.available && product.condition === 'nuevo'"
                        (click)="reserveProduct()">
                  <i class="fas fa-bookmark me-2"></i>
                  Reservar Producto
                </button>
                
                <div class="row" *ngIf="canEdit()">
                  <div class="col-6">
                    <button class="btn btn-outline-primary w-100"
                            [routerLink]="['/products/edit', product._id]">
                      <i class="fas fa-edit me-2"></i>
                      Editar
                    </button>
                  </div>
                  <div class="col-6">
                    <button class="btn btn-outline-danger w-100"
                            (click)="deleteProduct()">
                      <i class="fas fa-trash me-2"></i>
                      Eliminar
                    </button>
                  </div>
                </div>
                
                <button class="btn btn-secondary" 
                        *ngIf="product.condition === 'vendido'"
                        disabled>
                  <i class="fas fa-check me-2"></i>
                  Producto Vendido
                </button>
                
                <button class="btn btn-info" 
                        *ngIf="product.condition === 'reservado'"
                        disabled>
                  <i class="fas fa-bookmark me-2"></i>
                  Producto Reservado
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-footer text-center">
            <a routerLink="/products" class="btn btn-outline-secondary">
              <i class="fas fa-arrow-left me-2"></i>
              Volver a Productos
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div class="text-center" *ngIf="loading">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando producto...</span>
        </div>
      </div>
    </div>

    <!-- Producto no encontrado -->
    <div class="text-center py-5" *ngIf="!loading && !product">
      <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
      <h4>Producto no encontrado</h4>
      <p class="text-muted mb-4">El producto que buscas no existe o ha sido eliminado.</p>
      <a routerLink="/products" class="btn btn-primary">
        <i class="fas fa-arrow-left me-2"></i>
        Volver a Productos
      </a>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  seller: User | null = null;
  currentImage = '';
  loading = true;
  categories: any[] = [];
  conditions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadConditions();
    this.loadProduct();
  }

  loadCategories(): void {
    this.categories = this.productService.getCategories();
  }

  loadConditions(): void {
    this.conditions = this.productService.getConditions();
  }

  loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
          this.currentImage = this.product.images && this.product.images[0] ? 
            this.product.images[0] : '';
          
          // Extraer información del vendedor si está poblada
          if (this.product.seller && typeof this.product.seller === 'object') {
            this.seller = this.product.seller;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.key === category);
    return cat ? cat.label : category;
  }

  getCategoryColor(category: string): string {
    const cat = this.categories.find(c => c.key === category);
    return cat ? cat.color : 'secondary';
  }

  getConditionLabel(condition: string): string {
    const cond = this.conditions.find(c => c.key === condition);
    return cond ? cond.label : condition;
  }

  getConditionClass(condition: string): string {
    const cond = this.conditions.find(c => c.key === condition);
    return cond ? cond.class : 'bg-secondary';
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  contactSeller(): void {
    if (this.seller && this.seller.email) {
      const subject = `Interés en: ${this.product?.name}`;
      const body = `Hola ${this.seller.name},\\n\\nEstoy interesado en tu producto "${this.product?.name}" publicado en FallaMarket.\\n\\n¡Espero tu respuesta!`;
      const mailtoLink = `mailto:${this.seller.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    }
  }

  reserveProduct(): void {
    if (this.product && this.product._id) {
      if (confirm('¿Quieres reservar este producto?')) {
        this.productService.reserveProduct(this.product._id).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadProduct(); // Recargar para ver el cambio
              alert('Producto reservado exitosamente');
            }
          },
          error: (error) => {
            console.error('Error reserving product:', error);
            alert('Error al reservar el producto');
          }
        });
      }
    }
  }

  canEdit(): boolean {
    // Por simplicidad, permitir edición a todos
    // En una aplicación real, verificar si es el owner
    return true;
  }

  deleteProduct(): void {
    if (this.product && this.product._id) {
      if (confirm(`¿Estás seguro de que quieres eliminar "${this.product.name}"?`)) {
        this.productService.deleteProduct(this.product._id).subscribe({
          next: (response) => {
            if (response.success) {
              this.router.navigate(['/products']);
            }
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            alert('Error al eliminar el producto');
          }
        });
      }
    }
  }
}