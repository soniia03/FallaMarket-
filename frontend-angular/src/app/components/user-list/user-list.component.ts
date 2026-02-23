import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>
        <i class="fas fa-users me-2"></i>
        Usuarios Registrados
        <span class="badge bg-primary ms-2" *ngIf="users.length > 0">
          {{ users.length }}
        </span>
      </h2>
      <div class="btn-group">
        <button class="btn btn-outline-primary" 
                [class.active]="showActiveOnly"
                (click)="toggleActiveFilter()">
          <i class="fas fa-filter me-2"></i>
          {{ showActiveOnly ? 'Mostrar Todos' : 'Solo Activos' }}
        </button>
      </div>
    </div>

    <!-- Lista de usuarios -->
    <div class="row" *ngIf="filteredUsers.length > 0">
      <div class="col-md-6 col-lg-4 mb-4" *ngFor="let user of filteredUsers">
        <div class="card user-card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">
              <i class="fas fa-user-circle me-2"></i>
              {{ user.name }}
            </h6>
            <span class="badge" 
                  [ngClass]="user.isActive ? 'bg-success' : 'bg-secondary'">
              {{ user.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          
          <div class="card-body">
            <div class="user-info">
              <p class="mb-2">
                <i class="fas fa-envelope text-primary me-2"></i>
                <strong>Email:</strong><br>
                <small class="text-muted">{{ user.email }}</small>
              </p>
              
              <p class="mb-2" *ngIf="user.phone">
                <i class="fas fa-phone text-success me-2"></i>
                <strong>Teléfono:</strong><br>
                <small class="text-muted">{{ user.phone }}</small>
              </p>
              
              <p class="mb-2" *ngIf="user.location">
                <i class="fas fa-map-marker-alt text-danger me-2"></i>
                <strong>Ubicación:</strong><br>
                <small class="text-muted">{{ user.location }}</small>
              </p>
              
              <p class="mb-2" *ngIf="user.registrationDate">
                <i class="fas fa-calendar text-info me-2"></i>
                <strong>Registro:</strong><br>
                <small class="text-muted">{{ formatDate(user.registrationDate) }}</small>
              </p>
              
              <p class="mb-0" *ngIf="user.daysSinceRegistration !== undefined">
                <i class="fas fa-clock text-warning me-2"></i>
                <strong>Antigüedad:</strong><br>
                <small class="text-muted">{{ user.daysSinceRegistration }} días</small>
              </p>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="d-flex gap-2 justify-content-between">
              <button class="btn btn-outline-info btn-sm flex-fill"
                      (click)="viewUserProducts(user)">
                <i class="fas fa-tshirt me-1"></i>
                Productos
              </button>
              
              <button class="btn btn-outline-primary btn-sm flex-fill"
                      (click)="contactUser(user)">
                <i class="fas fa-envelope me-1"></i>
                Contactar
              </button>
              
              <div class="btn-group">
                <button class="btn btn-outline-warning btn-sm" 
                        *ngIf="user.isActive"
                        (click)="toggleUserStatus(user, false)"
                        title="Desactivar usuario">
                  <i class="fas fa-user-slash"></i>
                </button>
                
                <button class="btn btn-outline-success btn-sm" 
                        *ngIf="!user.isActive"
                        (click)="toggleUserStatus(user, true)"
                        title="Reactivar usuario">
                  <i class="fas fa-user-check"></i>
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
          <span class="visually-hidden">Cargando usuarios...</span>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div class="text-center py-5" *ngIf="!loading && filteredUsers.length === 0">
      <i class="fas fa-user-friends fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No hay usuarios disponibles</h4>
      <p class="text-muted">
        {{ showActiveOnly ? 'No hay usuarios activos en este momento' : 'Aún no se han registrado usuarios' }}
      </p>
    </div>

    <!-- Modal para productos del usuario -->
    <div class="modal fade" 
         id="userProductsModal" 
         tabindex="-1" 
         *ngIf="selectedUser && userProducts">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-tshirt me-2"></i>
              Productos de {{ selectedUser.name }}
            </h5>
            <button type="button" 
                    class="btn-close" 
                    data-bs-dismiss="modal"
                    (click)="closeProductsModal()"></button>
          </div>
          <div class="modal-body">
            <div *ngIf="userProducts.length > 0">
              <div class="row">
                <div class="col-md-6 mb-3" *ngFor="let product of userProducts">
                  <div class="card">
                    <div class="card-body">
                      <h6 class="card-title">{{ product.name }}</h6>
                      <p class="card-text small text-muted">
                        {{ product.description | slice:0:60 }}...
                      </p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-success">
                          {{ formatPrice(product.price) }}
                        </span>
                        <span class="badge" 
                              [ngClass]="'bg-' + getCategoryColor(product.category)">
                          {{ product.category }}
                        </span>
                      </div>
                      <a [routerLink]="['/products', product._id]" 
                         class="btn btn-primary btn-sm mt-2 w-100"
                         data-bs-dismiss="modal"
                         (click)="closeProductsModal()">
                        Ver Detalles
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="userProducts.length === 0" class="text-center py-4">
              <i class="fas fa-inbox fa-2x text-muted mb-3"></i>
              <p class="text-muted">Este usuario no tiene productos publicados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  userProducts: any[] = [];
  showActiveOnly = false;
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.showActiveOnly) {
      this.filteredUsers = this.users.filter(user => user.isActive);
    } else {
      this.filteredUsers = this.users;
    }
  }

  toggleActiveFilter(): void {
    this.showActiveOnly = !this.showActiveOnly;
    this.applyFilters();
  }

  viewUserProducts(user: User): void {
    if (!user._id) return;
    
    this.selectedUser = user;
    this.userService.getUserProducts(user._id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.userProducts = response.data;
        } else {
          this.userProducts = [];
        }
        // Abrir el modal
        const modal = new (window as any).bootstrap.Modal(
          document.getElementById('userProductsModal')
        );
        modal.show();
      },
      error: (error) => {
        console.error('Error loading user products:', error);
        this.userProducts = [];
      }
    });
  }

  closeProductsModal(): void {
    this.selectedUser = null;
    this.userProducts = [];
  }

  contactUser(user: User): void {
    const subject = 'Contacto desde FallaMarket';
    const body = `Hola ${user.name},\\n\\nTe contacto desde FallaMarket.\\n\\n¡Saludos!`;
    const mailtoLink = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  toggleUserStatus(user: User, activate: boolean): void {
    if (!user._id) return;

    const action = activate ? 'reactivar' : 'desactivar';
    const confirmMessage = `¿Estás seguro de que quieres ${action} a ${user.name}?`;
    
    if (confirm(confirmMessage)) {
      const operation = activate ? 
        this.userService.reactivateUser(user._id) : 
        this.userService.deactivateUser(user._id);
      
      operation.subscribe({
        next: (response) => {
          if (response.success) {
            this.loadUsers(); // Recargar la lista
          }
        },
        error: (error) => {
          console.error(`Error ${action} user:`, error);
          alert(`Error al ${action} el usuario`);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)}€`;
  }

  getCategoryColor(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'traje-fallero': 'primary',
      'traje-fallera': 'info',
      'complementos': 'warning',
      'calzado': 'success',
      'accesorios': 'danger'
    };
    return categoryMap[category] || 'secondary';
  }
}