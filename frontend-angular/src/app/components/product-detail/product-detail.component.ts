import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TrajeService } from '../../services/product.service';
import { Traje, User } from '../../models/interfaces';

@Component({
  selector: 'app-traje-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="!loading && traje" class="row">
      <!-- Imagen del traje -->
      <div class="col-md-6">
        <div class="card">
          <div class="position-relative">
            <img 
              [src]="'/assets/images/traje-fallero.jpg'" 
              class="card-img-top"
              [alt]="traje.nombre"
              style="height: 400px; object-fit: cover;">
            <span class="badge position-absolute top-0 end-0 m-3 fs-6"
                  [class.bg-success]="traje.disponible"
                  [class.bg-danger]="!traje.disponible">
              {{ traje.disponible ? 'Disponible' : 'No Disponible' }}
            </span>
            <span class="badge position-absolute top-0 start-0 m-3 fs-6 bg-primary">
              Traje Fallero
            </span>
          </div>
          
          <!-- Información adicional -->
          <div class="card-body">
            <div class="row text-center">
              <div class="col-12">
                <p class="card-text text-muted">
                  <i class="fas fa-crown me-2"></i>
                  Traje Tradicional Fallero
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del traje -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">
            <h2 class="mb-0">{{ traje.nombre }}</h2>
          </div>
          <div class="card-body">
            <!-- Precio -->
            <div class="price-section mb-4">
              <span class="price-tag display-6">{{ formatPrice(traje.precio) }}</span>
              <span class="badge bg-success ms-2" *ngIf="traje.disponible">
                Disponible
              </span>
              <span class="badge bg-danger ms-2" *ngIf="!traje.disponible">
                No Disponible
              </span>
            </div>

            <!-- Descripción -->
            <div class="description-section mb-4">
              <h5>Descripción</h5>
              <p class="text-muted">{{ traje.descripcion }}</p>
            </div>

            <!-- Detalles del traje -->
            <div class="details-section mb-4">
              <h5>Detalles</h5>
              <table class="table table-borderless">
                <tr>
                  <td><strong>Material:</strong></td>
                  <td>
                    <span class="badge bg-info">
                      {{ traje.material }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><strong>Propietario:</strong></td>
                  <td>
                    <span class="badge bg-secondary">
                      {{ traje.propietario }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><strong>Disponible:</strong></td>
                  <td>
                    <i class="fas" 
                       [class.fa-check-circle]="traje.disponible"
                       [class.fa-times-circle]="!traje.disponible"
                       [class.text-success]="traje.disponible"
                       [class.text-danger]="!traje.disponible"></i>
                    {{ traje.disponible ? 'Sí' : 'No' }}
                  </td>
                </tr>
                <tr *ngIf="traje.createdAt">
                  <td><strong>Registrado:</strong></td>
                  <td>{{ formatDate(traje.createdAt) }}</td>
                </tr>
              </table>
            </div>

            <!-- Información del propietario -->
            <div class="owner-section mb-4">
              <h5>Información del Propietario</h5>
              <div class="card bg-light">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <i class="fas fa-user-circle fa-3x text-primary"></i>
                    </div>
                    <div class="col">
                      <h6 class="mb-1">{{ traje.propietario }}</h6>
                      <p class="mb-0 text-muted">
                        <i class="fas fa-crown me-1"></i>
                        Propietario del Traje Fallero
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
                        *ngIf="traje.disponible"
                        (click)="contactOwner()">
                  <i class="fas fa-envelope me-2"></i>
                  Contactar Propietario
                </button>
                
                <div class="row" *ngIf="canEdit()">
                  <div class="col-6">
                    <button class="btn btn-outline-primary w-100"
                            [routerLink]="['/trajes/edit', traje._id]">
                      <i class="fas fa-edit me-2"></i>
                      Editar
                    </button>
                  </div>
                  <div class="col-6">
                    <button class="btn btn-outline-danger w-100"
                            (click)="deleteTraje()">
                      <i class="fas fa-trash me-2"></i>
                      Eliminar
                    </button>
                  </div>
                </div>
                
                <button class="btn btn-secondary" 
                        *ngIf="!traje.disponible"
                        disabled>
                  <i class="fas fa-times me-2"></i>
                  Traje No Disponible
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-footer text-center">
            <a routerLink="/trajes" class="btn btn-outline-secondary">
              <i class="fas fa-arrow-left me-2"></i>
              Volver a Trajes
            </a>
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

    <!-- Traje no encontrado -->
    <div class="text-center py-5" *ngIf="!loading && !traje">
      <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
      <h4>Traje no encontrado</h4>
      <p class="text-muted mb-4">El traje que buscas no existe o ha sido eliminado.</p>
      <a routerLink="/trajes" class="btn btn-primary">
        <i class="fas fa-arrow-left me-2"></i>
        Volver a Trajes
      </a>
    </div>
  `
})
export class TrajeDetailComponent implements OnInit {
  traje: Traje | null = null;
  currentImage = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trajeService: TrajeService
  ) {}

  ngOnInit(): void {
    this.loadTraje();
  }

  loadTraje(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }

    this.trajeService.getTrajeById(id).subscribe({
      next: (response) => {
        if (response && response._id) {
          this.traje = response;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading traje:', error);
        this.loading = false;
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  contactOwner(): void {
    if (this.traje && this.traje.propietario) {
      const subject = `Interés en: ${this.traje.nombre}`;
      const body = `Hola ${this.traje.propietario},\n\nEstoy interesado en tu traje "${this.traje.nombre}" registrado en FallaMarket.\n\n¡Espero tu respuesta!`;
      alert(`Contactar con ${this.traje.propietario}:\n\nAsunto: ${subject}\n\nMensaje: ${body}`);
    }
  }

  canEdit(): boolean {
    // Por simplicidad, permitir edición a todos
    // En una aplicación real, verificar si es el owner
    return true;
  }

  deleteTraje(): void {
    if (this.traje && this.traje._id) {
      const confirmMessage = `¿Estás seguro de que quieres eliminar "${this.traje.nombre}"?`;
      if (confirm(confirmMessage)) {
        this.trajeService.deleteTraje(this.traje._id).subscribe({
          next: (response) => {
            alert('Traje eliminado exitosamente');
            this.router.navigate(['/trajes']);
          },
          error: (error) => {
            console.error('Error deleting traje:', error);
            alert('Error al eliminar el traje');
          }
        });
      }
    }
  }
}