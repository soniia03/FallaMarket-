import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrajeService } from '../../services/product.service';
import { Traje, MaterialInfo } from '../../models/interfaces';

@Component({
  selector: 'app-traje-list',
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
            <span class="badge position-absolute top-0 end-0 m-2"
                  [ngClass]="'bg-' + getMaterialColor(traje.material)">
              {{ getMaterialLabel(traje.material) }}
            </span>
          </div>
          
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">{{ traje.nombre }}</h6>
            <p class="card-text text-muted small">
              <strong>Material:</strong> {{ getMaterialLabel(traje.material) }}<br>
              <strong>Propietario:</strong> {{ traje.propietario }}<br>
              <strong>Precio:</strong> <span class="text-success fw-bold">{{ traje.precio | currency:'EUR':'symbol':'1.2-2' }}</span>
            </p>
            
            <!-- Descripción -->
            <p class="card-text small text-muted flex-grow-1">
              <i class="fas fa-file-alt me-1"></i>
              {{ traje.descripcion }}
            </p>
            
            <!-- Estado de disponibilidad -->
            <div class="mb-2">
              <span *ngIf="traje.disponible" class="badge bg-success">
                <i class="fas fa-check me-1"></i>Disponible
              </span>
              <span *ngIf="!traje.disponible" class="badge bg-danger">
                <i class="fas fa-times me-1"></i>No disponible
              </span>
            </div>
            
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="text-muted" *ngIf="traje.createdAt">
                  <i class="fas fa-calendar me-1"></i>
                  {{ formatDate(traje.createdAt) }}
                </small>
                <small class="text-muted" *ngIf="traje.updatedAt && traje.updatedAt !== traje.createdAt">
                  <i class="fas fa-edit me-1"></i>
                  {{ formatDate(traje.updatedAt) }}
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
  `,
  styles: [`
    .btn-fallero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
    }
    
    .btn-fallero:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      color: white;
    }
    
    .traje-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .traje-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }
    
    .traje-placeholder {
      border-radius: 0.375rem 0.375rem 0 0;
    }
    
    .loading-spinner {
      padding: 3rem;
    }
    
    @media (max-width: 768px) {
      .d-flex.justify-content-between {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class TrajeListComponent implements OnInit {
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

  getMaterialColor(material: string): string {
    const mat = this.materiales.find(m => m.key === material.toLowerCase());
    return mat ? mat.color : 'secondary';
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