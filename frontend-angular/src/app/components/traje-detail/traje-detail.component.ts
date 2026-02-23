import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TrajeService } from '../../services/product.service';
import { Traje, MaterialInfo } from '../../models/interfaces';

@Component({
  selector: 'app-traje-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Navegación -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a routerLink="/">Inicio</a></li>
        <li class="breadcrumb-item"><a routerLink="/trajes">Trajes</a></li>
        <li class="breadcrumb-item active" *ngIf="traje">{{ traje.nombre }}</li>
      </ol>
    </nav>

    <!-- Detalle del traje -->
    <div class="row" *ngIf="traje">
      <div class="col-lg-6">
        <!-- Imagen/Vista del traje -->
        <div class="card mb-4">
          <div class="traje-visualization d-flex flex-column justify-content-center align-items-center"
               style="height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <i class="fas fa-tshirt fa-5x text-white mb-3"></i>
            <h4 class="text-white text-center">{{ traje.nombre }}</h4>
            <span class="badge bg-light text-dark fs-6 mt-2">{{ getMaterialLabel(traje.material) }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <!-- Información del traje -->
        <div class="card">
          <div class="card-header">
            <h2 class="mb-0">{{ traje.nombre }}</h2>
          </div>
          <div class="card-body">
            <!-- Información básica -->
            <div class="row mb-3">
              <div class="col-sm-4">
                <strong>Material:</strong>
              </div>
              <div class="col-sm-8">
                <span class="badge"
                      [ngClass]="'bg-' + getMaterialColor(traje.material)">
                  <i [class]="getMaterialIcon(traje.material)" class="me-1"></i>
                  {{ getMaterialLabel(traje.material) }}
                </span>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-sm-4">
                <strong>Propietario:</strong>
              </div>
              <div class="col-sm-8">
                <i class="fas fa-user me-2 text-muted"></i>
                {{ traje.propietario }}
              </div>
            </div>

            <!-- Descripción -->
            <div class="row mb-3">
              <div class="col-sm-4">
                <strong>Descripción:</strong>
              </div>
              <div class="col-sm-8">
                <i class="fas fa-file-alt me-2 text-muted"></i>
                <span>{{ traje.descripcion }}</span>
              </div>
            </div>

            <!-- Precio -->
            <div class="row mb-3">
              <div class="col-sm-4">
                <strong>Precio:</strong>
              </div>
              <div class="col-sm-8">
                <i class="fas fa-euro-sign me-2 text-success"></i>
                <span class="text-success fw-bold fs-5">{{ traje.precio | currency:'EUR':'symbol':'1.2-2' }}</span>
              </div>
            </div>

            <!-- Disponibilidad -->
            <div class="row mb-3">
              <div class="col-sm-4">
                <strong>Disponibilidad:</strong>
              </div>
              <div class="col-sm-8">
                <span *ngIf="traje.disponible" class="badge bg-success">
                  <i class="fas fa-check me-1"></i>Disponible
                </span>
                <span *ngIf="!traje.disponible" class="badge bg-danger">
                  <i class="fas fa-times me-1"></i>No disponible
                </span>
              </div>
            </div>
            <div class="row mb-3" *ngIf="traje.createdAt">
              <div class="col-sm-4">
                <strong>Registrado:</strong>
              </div>
              <div class="col-sm-8">
                <i class="fas fa-calendar-plus me-2 text-muted"></i>
                {{ formatDate(traje.createdAt) }}
              </div>
            </div>

            <div class="row mb-3" *ngIf="traje.updatedAt && traje.updatedAt !== traje.createdAt">
              <div class="col-sm-4">
                <strong>Última modificación:</strong>
              </div>
              <div class="col-sm-8">
                <i class="fas fa-edit me-2 text-muted"></i>
                {{ formatDate(traje.updatedAt) }}
              </div>
            </div>

            <!-- ID del traje (para referencia) -->
            <div class="row mb-3" *ngIf="traje._id">
              <div class="col-sm-4">
                <strong>ID:</strong>
              </div>
              <div class="col-sm-8">
                <code class="text-muted small">{{ traje._id }}</code>
              </div>
            </div>

            <!-- Acciones -->
            <div class="d-flex gap-2 mt-4">
              <a [routerLink]="['/trajes/edit', traje._id]" 
                 class="btn btn-warning">
                <i class="fas fa-edit me-2"></i>
                Editar
              </a>
              <button class="btn btn-danger" 
                      (click)="deleteTraje()">
                <i class="fas fa-trash me-2"></i>
                Eliminar
              </button>
              <a routerLink="/trajes" 
                 class="btn btn-secondary ms-auto">
                <i class="fas fa-arrow-left me-2"></i>
                Volver
              </a>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="card mt-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-info-circle me-2"></i>
              Información adicional
            </h5>
          </div>
          <div class="card-body">
            <p class="text-muted mb-2">
              <strong>Cuidados del material:</strong>
            </p>
            <div class="alert alert-info">
              {{ getMaterialCare(traje.material) }}
            </div>
            
            <p class="text-muted mb-2 mt-3">
              <strong>Historia del traje:</strong>
            </p>
            <div class="timeline">
              <div class="timeline-item" *ngIf="traje.createdAt">
                <div class="timeline-marker bg-success"></div>
                <div class="timeline-content">
                  <h6>Registro inicial</h6>
                  <p class="text-muted small">{{ formatDate(traje.createdAt) }}</p>
                </div>
              </div>
              <div class="timeline-item" *ngIf="traje.updatedAt && traje.updatedAt !== traje.createdAt">
                <div class="timeline-marker bg-warning"></div>
                <div class="timeline-content">
                  <h6>Última modificación</h6>
                  <p class="text-muted small">{{ formatDate(traje.updatedAt) }}</p>
                </div>
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
          <span class="visually-hidden">Cargando traje...</span>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div class="text-center py-5" *ngIf="!loading && !traje">
      <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
      <h4>Traje no encontrado</h4>
      <p class="text-muted">El traje que buscas no existe o ha sido eliminado.</p>
      <a routerLink="/trajes" class="btn btn-primary">
        <i class="fas fa-arrow-left me-2"></i>
        Volver a Trajes
      </a>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: none;
    }
    
    .traje-visualization {
      border-radius: 0.375rem;
    }
    
    .loading-spinner {
      padding: 3rem;
    }
    
    .timeline {
      position: relative;
      padding-left: 30px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #dee2e6;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 20px;
    }
    
    .timeline-marker {
      position: absolute;
      left: -23px;
      top: 5px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      z-index: 1;
    }
    
    .timeline-content {
      background: #f8f9fa;
      padding: 10px 15px;
      border-radius: 5px;
    }
    
    .timeline-content h6 {
      margin: 0 0 5px 0;
    }
    
    .breadcrumb-item + .breadcrumb-item::before {
      content: ">";
    }
    
    .breadcrumb a {
      text-decoration: none;
    }
    
    .breadcrumb a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .d-flex.gap-2 {
        flex-direction: column;
      }
      
      .ms-auto {
        margin-left: auto !important;
        margin-top: 10px;
      }
    }
  `]
})
export class TrajeDetailComponent implements OnInit {
  traje: Traje | null = null;
  loading = true;
  materiales: MaterialInfo[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trajeService: TrajeService
  ) {}

  ngOnInit(): void {
    this.loadMateriales();
    this.loadTraje();
  }

  loadMateriales(): void {
    this.materiales = this.trajeService.getMateriales();
  }

  loadTraje(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/trajes']);
      return;
    }

    this.loading = true;
    this.trajeService.getTrajeById(id).subscribe({
      next: (traje) => {
        this.traje = traje;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading traje:', error);
        this.loading = false;
      }
    });
  }

  getMaterialLabel(material: string): string {
    const mat = this.materiales.find(m => 
      m.key === material.toLowerCase() || m.label.toLowerCase() === material.toLowerCase()
    );
    return mat ? mat.label : material;
  }

  getMaterialColor(material: string): string {
    const mat = this.materiales.find(m => 
      m.key === material.toLowerCase() || m.label.toLowerCase() === material.toLowerCase()
    );
    return mat ? mat.color : 'secondary';
  }

  getMaterialIcon(material: string): string {
    const mat = this.materiales.find(m => 
      m.key === material.toLowerCase() || m.label.toLowerCase() === material.toLowerCase()
    );
    return mat ? mat.icon : 'fas fa-question';
  }

  getMaterialCare(material: string): string {
    const careInstructions: { [key: string]: string } = {
      'seda': 'Lavado en seco únicamente. Evitar la exposición directa al sol. Planchar a temperatura baja.',
      'brocado': 'Lavado profesional recomendado. Guardar en lugar seco y ventilado. Evitar doblar los bordados.',
      'terciopelo': 'Lavado en seco. Cepillar suavemente en dirección del pelo. Colgar para evitar aplastamiento.',
      'raso': 'Lavado delicado o en seco. Planchar del revés a temperatura media. Evitar el contacto con objetos rugosos.',
      'tafetan': 'Lavado en seco recomendado. Planchar mientras esté ligeramente húmedo. Guardar colgado.',
      'damasco': 'Lavado profesional. Evitar frotar los dibujos. Planchar del revés a temperatura baja.',
      'algodon': 'Lavado a máquina permitido. Planchar a temperatura alta. Fácil mantenimiento.',
      'lino': 'Lavado a máquina o manual. Se arruga fácilmente, planchar húmedo. Muy duradero.'
    };

    const key = material.toLowerCase();
    return careInstructions[key] || 'Seguir las instrucciones de cuidado del fabricante. Consultar con un especialista en textiles si tiene dudas.';
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

  deleteTraje(): void {
    if (!this.traje) return;

    if (confirm(`¿Estás seguro de que quieres eliminar el traje "${this.traje.nombre}"?\\n\\nEsta acción no se puede deshacer.`)) {
      this.trajeService.deleteTraje(this.traje._id!).subscribe({
        next: (success) => {
          if (success) {
            alert('Traje eliminado correctamente');
            this.router.navigate(['/trajes']);
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