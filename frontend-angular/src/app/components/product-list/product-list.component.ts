import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrajeService } from '../../services/product.service';
import { Traje, MaterialInfo } from '../../models/interfaces';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>
        <i class="fas fa-tshirt me-2"></i>
        Trajes Disponibles
        <span class="badge bg-primary ms-2" *ngIf="filteredTrajes.length > 0">
          {{ filteredTrajes.length }}
        </span>
      </h2>
      <a routerLink="/trajes/add" class="btn btn-fallero">
        <i class="fas fa-plus me-2"></i>
        Nuevo Traje
      </a>
    </div>

    <!-- Filtros -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="fas fa-filter me-2"></i>
          Filtros
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <label class="form-label">Buscar por nombre</label>
            <input type="text" 
                   class="form-control" 
                   [(ngModel)]="searchTerm"
                   (input)="applyFilters()"
                   placeholder="Escribir para buscar...">
          </div>
          <div class="col-md-4">
            <label class="form-label">Material</label>
            <select class="form-select" 
                    [(ngModel)]="selectedMaterial"
                    (change)="applyFilters()">
              <option value="">Todos los materiales</option>
              <option *ngFor="let material of materiales" [value]="material.key">
                {{ material.label }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Propietario</label>
            <input type="text" 
                   class="form-control" 
                   [(ngModel)]="searchPropietario"
                   (input)="applyFilters()"
                   placeholder="Buscar por propietario...">
          </div>
        </div>
        <div class="mt-3">
          <button class="btn btn-outline-secondary" (click)="clearFilters()">
            <i class="fas fa-times me-2"></i>
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de trajes -->
    <div class="row" *ngIf="filteredTrajes.length > 0">
      <div class="col-md-6 col-lg-4 col-xl-3 mb-4" *ngFor="let traje of filteredTrajes">
        <div class="card traje-card h-100">
          <div class="position-relative">
            <div class="card-img-top traje-placeholder d-flex flex-column justify-content-center align-items-center"
                 style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <i class="fas fa-tshirt fa-3x text-white mb-2"></i>
              <small class="text-white">{{ traje.nombre }}</small>
            </div>
            <span class="badge position-absolute top-0 end-0 m-2 bg-info">
              {{ getMaterialLabel(traje.material) }}
            </span>
          </div>
          
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">{{ traje.nombre }}</h6>
            <p class="card-text text-muted small flex-grow-1">
              <strong>Material:</strong> {{ getMaterialLabel(traje.material) }}<br>
              <strong>Propietario:</strong> {{ traje.propietario }}
            </p>
            
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="text-muted" *ngIf="traje.createdAt">
                  <i class="fas fa-calendar me-1"></i>
                  {{ formatDate(traje.createdAt) }}
                </small>
              </div>
              
              <div class="d-flex gap-2">
                <a [routerLink]="['/trajes', traje._id]" 
                   class="btn btn-primary btn-sm flex-fill">
                  <i class="fas fa-eye me-1"></i>
                  Ver Detalles
                </a>
                <a [routerLink]="['/trajes/edit', traje._id]" 
                   class="btn btn-outline-warning btn-sm">
                  <i class="fas fa-edit"></i>
                </a>
                <button class="btn btn-outline-danger btn-sm" 
                        (click)="deleteTraje(traje)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div class="text-center" *ngIf="loading">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando trajes...</span>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div class="text-center py-5" *ngIf="!loading && filteredTrajes.length === 0">
      <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No se encontraron trajes</h4>
      <p class="text-muted mb-4">
        Intenta ajustar los filtros o 
        <a routerLink="/trajes/add" class="text-decoration-none">
          crear el primer traje
        </a>
      </p>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  trajes: Traje[] = [];
  filteredTrajes: Traje[] = [];
  materiales: MaterialInfo[] = [];
  loading = true;

  // Filtros
  searchTerm = '';
  selectedMaterial = '';
  searchPropietario = '';

  constructor(
    private trajeService: TrajeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMateriales();
    this.loadTrajes();
    this.checkQueryParams();
  }

  loadMateriales(): void {
    this.materiales = this.trajeService.getMateriales();
  }

  checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['material']) {
        this.selectedMaterial = params['material'];
        this.applyFilters();
      }
    });
  }

  loadTrajes(): void {
    this.loading = true;
    this.trajeService.getAllTrajes().subscribe({
      next: (trajes) => {
        this.trajes = trajes;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading trajes:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTrajes = this.trajes.filter(traje => {
      // Filtro por término de búsqueda
      const matchesSearch = !this.searchTerm || 
        traje.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        traje.material.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        traje.propietario.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por material
      const matchesMaterial = !this.selectedMaterial || 
        traje.material.toLowerCase().includes(this.selectedMaterial.toLowerCase());

      // Filtro por propietario
      const matchesPropietario = !this.searchPropietario || 
        traje.propietario.toLowerCase().includes(this.searchPropietario.toLowerCase());

      return matchesSearch && matchesMaterial && matchesPropietario;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedMaterial = '';
    this.searchPropietario = '';
    this.applyFilters();
  }

  getMaterialLabel(material: string): string {
    const mat = this.materiales.find(m => m.key === material.toLowerCase());
    return mat ? mat.label : material;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  deleteTraje(traje: Traje): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el traje "${traje.nombre}"?`)) {
      this.trajeService.deleteTraje(traje._id!).subscribe({
        next: (success) => {
          if (success) {
            this.loadTrajes(); // Recargar la lista
            alert('Traje eliminado correctamente');
          } else {
            alert('Error al eliminar el traje');
          }
        },
        error: (error) => {
          console.error('Error deleting traje:', error);
          alert('Error al eliminar el traje');
        }
      });
    }
  }
}
          <div class="position-relative">
            <img 
              [src]="product.images && product.images[0] ? product.images[0] : '/assets/images/no-image.jpg'" 
              class="card-img-top product-image"
              [alt]="product.name"
              style="height: 200px; object-fit: cover;">
            <span class="badge position-absolute top-0 end-0 m-2"
                  [ngClass]="getConditionClass(product.condition)">
              {{ getConditionLabel(product.condition) }}
            </span>
            <span class="badge position-absolute top-0 start-0 m-2"
                  [ngClass]="'bg-' + getCategoryColor(product.category)">
              {{ getCategoryLabel(product.category) }}
            </span>
          </div>
          
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">{{ product.name }}</h6>
            <p class="card-text text-muted small flex-grow-1">
              {{ product.description.length > 80 ? (product.description | slice:0:80) + '...' : product.description }}
            </p>
            
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="price-tag fs-5">{{ formatPrice(product.price) }}</span>
                <small class="text-muted" *ngIf="product.seller && typeof product.seller === 'object'">
                  <i class="fas fa-user me-1"></i>
                  {{ product.seller.name }}
                </small>
              </div>
              
              <div class="d-flex gap-2">
                <a [routerLink]="['/products', product._id]" 
                   class="btn btn-primary btn-sm flex-fill">
                  <i class="fas fa-eye me-1"></i>
                  Ver Detalles
                </a>
                <button class="btn btn-outline-danger btn-sm" 
                        (click)="deleteProduct(product)"
                        *ngIf="canDelete(product)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div class="text-center" *ngIf="loading">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div class="text-center py-5" *ngIf="!loading && filteredProducts.length === 0">
      <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No se encontraron productos</h4>
      <p class="text-muted mb-4">
        Intenta ajustar los filtros o 
        <a routerLink="/products/add" class="text-decoration-none">
          crear el primer producto
        </a>
      </p>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: any[] = [];
  conditions: any[] = [];
  loading = true;

  // Filtros
  searchTerm = '';
  selectedCategory = '';
  selectedCondition = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadConditions();
    this.loadProducts();
    this.checkQueryParams();
  }

  loadCategories(): void {
    this.categories = this.productService.getCategories();
  }

  loadConditions(): void {
    this.conditions = this.productService.getConditions();
  }

  checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.applyFilters();
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data;
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      // Filtro por término de búsqueda
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por categoría
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;

      // Filtro por condición
      const matchesCondition = !this.selectedCondition || 
        product.condition === this.selectedCondition;

      // Filtro por precio mínimo
      const matchesMinPrice = this.minPrice === null || 
        product.price >= this.minPrice;

      // Filtro por precio máximo
      const matchesMaxPrice = this.maxPrice === null || 
        product.price <= this.maxPrice;

      return matchesSearch && matchesCategory && matchesCondition && 
             matchesMinPrice && matchesMaxPrice;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedCondition = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.applyFilters();
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

  canDelete(product: Product): boolean {
    // Lógica para determinar si se puede eliminar
    // Por ahora, permitir eliminar todos los productos
    return true;
  }

  deleteProduct(product: Product): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      this.productService.deleteProduct(product._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts(); // Recargar la lista
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