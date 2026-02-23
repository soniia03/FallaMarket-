import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrajeService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { Traje, MaterialInfo, TipoTrajeInfo } from '../../models/interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero-section bg-primary text-white p-5 mb-5 rounded">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1 class="display-4 fw-bold mb-3">
            <i class="fas fa-crown me-3"></i>
            FallaMarket
          </h1>
          <p class="lead mb-4">
            El sistema de gestión especializado en trajes falleros valencianos. 
            Organiza y administra tu colección de trajes tradicionales falleros.
          </p>
          <div class="d-flex gap-3">
            <a routerLink="/trajes" class="btn btn-warning btn-lg">
              <i class="fas fa-tshirt me-2"></i>
              Ver Trajes
            </a>
            <a routerLink="/trajes/add" class="btn btn-outline-light btn-lg">
              <i class="fas fa-plus me-2"></i>
              Añadir Traje
            </a>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <i class="fas fa-crown" style="font-size: 150px; opacity: 0.3;"></i>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <i class="fas fa-tshirt fa-3x text-primary mb-3"></i>
            <h5 class="card-title">Trajes Registrados</h5>
            <p class="card-text">
              Total de trajes falleros registrados en el sistema.
            </p>
            <div class="text-primary fw-bold fs-4">{{ stats.totalTrajes }}</div>
            <small class="text-muted">trajes en colección</small>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <i class="fas fa-gem fa-3x text-success mb-3"></i>
            <h5 class="card-title">Materiales Únicos</h5>
            <p class="card-text">
              Variedad de materiales diferentes en la colección.
            </p>
            <div class="text-success fw-bold fs-4">{{ stats.uniqueMaterials }}</div>
            <small class="text-muted">tipos de material</small>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 text-center">
          <div class="card-body">
            <i class="fas fa-users fa-3x text-warning mb-3"></i>
            <h5 class="card-title">Propietarios</h5>
            <p class="card-text">
              Personas responsables de los trajes registrados.
            </p>
            <div class="text-warning fw-bold fs-4">{{ stats.uniquePropietarios }}</div>
            <small class="text-muted">propietarios diferentes</small>
          </div>
        </div>
      </div>
    </div>

    <h2 class="mb-4">Materiales Principales</h2>
    <div class="row mb-5">
      <div class="col-md-6 col-lg-3 mb-3" *ngFor="let material of topMateriales">
        <div class="card material-card h-100 border-0 shadow-sm" 
             [routerLink]="['/trajes']" 
             [queryParams]="{material: material.key}"
             style="cursor: pointer;">
          <div class="card-body text-center p-4">
            <i [class]="material.icon" 
               class="fa-3x mb-3"
               [ngClass]="'text-' + material.color"></i>
            <h5 class="card-title">{{ material.label }}</h5>
            <div class="fw-bold" [ngClass]="'text-' + material.color">
              {{ getMaterialCount(material.key) }}
            </div>
            <small class="text-muted">trajes</small>
          </div>
        </div>
      </div>
    </div>

    <h2 class="mb-4">Trajes Recientes</h2>
    <div class="row" *ngIf="recentTrajes.length > 0">
      <div class="col-md-6 col-lg-3 mb-4" *ngFor="let traje of recentTrajes">
        <div class="card traje-card h-100">
          <div class="position-relative">
            <div class="traje-placeholder d-flex flex-column justify-content-center align-items-center"
                 style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <i class="fas fa-tshirt fa-3x text-white mb-2"></i>
              <small class="text-white text-center">{{ traje.nombre }}</small>
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
              <strong>Propietario:</strong> {{ traje.propietario }}
            </p>
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <small class="text-muted" *ngIf="traje.createdAt">
                  <i class="fas fa-calendar me-1"></i>
                  {{ formatDate(traje.createdAt) }}
                </small>
              </div>
              <a [routerLink]="['/trajes', traje._id]" 
                 class="btn btn-primary btn-sm w-100">
                <i class="fas fa-eye me-1"></i>
                Ver Detalles
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-info mt-4" *ngIf="recentTrajes.length === 0 && !loading">
      <i class="fas fa-info-circle me-2"></i>
      No hay trajes registrados en este momento. 
      <a routerLink="/trajes/add" class="alert-link">¡Añade el primer traje!</a>
    </div>

    <div class="text-center" *ngIf="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .material-card:hover {
      transform: translateY(-5px);
      transition: transform 0.2s ease-in-out;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
    }
    
    .traje-card:hover {
      transform: translateY(-2px);
      transition: transform 0.2s ease-in-out;
    }
    
    .traje-placeholder {
      border-radius: 0.375rem 0.375rem 0 0;
    }
    
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class HomeComponent implements OnInit {
  recentTrajes: Traje[] = [];
  topMateriales: MaterialInfo[] = [];
  stats = {
    totalTrajes: 0,
    uniqueMaterials: 0,
    uniquePropietarios: 0
  };
  loading = true;
  private allTrajes: Traje[] = [];

  constructor(
    private trajeService: TrajeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadMateriales();
    this.loadTrajes();
  }

  loadMateriales(): void {
    const allMateriales = this.trajeService.getMateriales();
    // Mostrar los primeros 4 materiales como destacados
    this.topMateriales = allMateriales.slice(0, 4);
  }

  loadTrajes(): void {
    this.loading = true;
    this.trajeService.getAllTrajes().subscribe({
      next: (trajes) => {
        this.allTrajes = trajes;
        this.calculateStats(trajes);
        // Mostrar los 4 trajes más recientes
        this.recentTrajes = trajes
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 4);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading trajes:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(trajes: Traje[]): void {
    this.stats.totalTrajes = trajes.length;
    
    // Materiales únicos
    const uniqueMaterials = new Set(trajes.map(t => t.material.toLowerCase()));
    this.stats.uniqueMaterials = uniqueMaterials.size;
    
    // Propietarios únicos
    const uniquePropietarios = new Set(trajes.map(t => t.propietario.toLowerCase()));
    this.stats.uniquePropietarios = uniquePropietarios.size;
  }

  getMaterialCount(materialKey: string): number {
    return this.allTrajes.filter(traje => 
      traje.material.toLowerCase().includes(materialKey.toLowerCase())
    ).length;
  }

  getMaterialLabel(material: string): string {
    const materiales = this.trajeService.getMateriales();
    const mat = materiales.find(m => 
      m.key === material.toLowerCase() || 
      m.label.toLowerCase() === material.toLowerCase()
    );
    return mat ? mat.label : material;
  }

  getMaterialColor(material: string): string {
    const materiales = this.trajeService.getMateriales();
    const mat = materiales.find(m => 
      m.key === material.toLowerCase() || 
      m.label.toLowerCase() === material.toLowerCase()
    );
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
}