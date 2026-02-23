import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, HttpClientModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-crown me-2"></i>
          FallaMarket
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="fas fa-home me-1"></i>
                Inicio
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/trajes" routerLinkActive="active">
                <i class="fas fa-tshirt me-1"></i>
                Trajes
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/trajes/add" routerLinkActive="active">
                <i class="fas fa-plus me-1"></i>
                Añadir
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/users" routerLinkActive="active">
                <i class="fas fa-users me-1"></i>
                Usuarios
              </a>
            </li>
          </ul>
          <div class="navbar-text">
            <small class="text-light">Angular Frontend - Puerto 4200</small>
          </div>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-dark text-light mt-5 py-4">
      <div class="container text-center">
        <p>&copy; 2024 FallaMarket - Marketplace de Trajes Falleros Valencianos</p>
        <p><small>Frontend Angular | API Backend en localhost:3000</small></p>
      </div>
    </footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FallaMarket - Angular Frontend';
}