<template>
  <div class="home-container">
    <div class="hero-section text-center py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <i class="bi bi-calendar-check text-primary display-1 mb-4"></i>
            <h1 class="display-4 fw-bold text-dark mb-4">
              Bienvenido a Reservations Happiness
            </h1>
            <p class="lead text-muted mb-5">
              Gestiona las reservas de tu restaurante sin esfuerzo con nuestro sistema elegante e intuitivo.
              Construido con tecnología moderna para una experiencia perfecta del cliente.
            </p>

            <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <router-link
                to="/reservations"
                class="btn btn-primary btn-lg px-4 py-3"
              >
                <i class="bi bi-calendar3 me-2"></i>
                Ver Todas las Reservas
              </router-link>

              <router-link
                v-if="!authStore.isAuthenticated"
                to="/login"
                class="btn btn-outline-primary btn-lg px-4 py-3"
              >
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión para Gestionar
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section py-5 bg-light">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col">
            <h2 class="h1 fw-bold text-dark">Características Principales</h2>
            <p class="lead text-muted">Todo lo que necesitas para gestionar las reservas del restaurante</p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="feature-card card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="bi bi-calendar-plus text-primary display-4"></i>
                </div>
                <h5 class="card-title fw-bold">Crear Reservas</h5>
                <p class="card-text text-muted">
                  Crea nuevas reservas fácilmente con los detalles y preferencias del cliente.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="bi bi-list-check text-success display-4"></i>
                </div>
                <h5 class="card-title fw-bold">Gestionar Estado</h5>
                <p class="card-text text-muted">
                  Rastrea el estado de las reservas desde pendiente hasta confirmada y completada.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="bi bi-search text-info display-4"></i>
                </div>
                <h5 class="card-title fw-bold">Buscar y Filtrar</h5>
                <p class="card-text text-muted">
                  Encuentra reservas rápidamente con opciones potentes de búsqueda y filtrado.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="bi bi-shield-check text-warning display-4"></i>
                </div>
                <h5 class="card-title fw-bold">Acceso Seguro</h5>
                <p class="card-text text-muted">
                  La autenticación basada en JWT garantiza acceso seguro a las funciones de gestión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-section py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-4 mb-4">
            <div class="stat-item">
              <i class="bi bi-people text-primary display-4 mb-3"></i>
              <h3 class="fw-bold text-dark">Gestión Fácil</h3>
              <p class="text-muted">Interfaz optimizada para el manejo sin esfuerzo de reservas</p>
            </div>
          </div>

          <div class="col-md-4 mb-4">
            <div class="stat-item">
              <i class="bi bi-clock text-success display-4 mb-3"></i>
              <h3 class="fw-bold text-dark">Actualizaciones en Tiempo Real</h3>
              <p class="text-muted">Sincronización instantánea en todos los dispositivos y usuarios</p>
            </div>
          </div>

          <div class="col-md-4 mb-4">
            <div class="stat-item">
              <i class="bi bi-graph-up text-info display-4 mb-3"></i>
              <h3 class="fw-bold text-dark">Crecimiento del Negocio</h3>
              <p class="text-muted">Optimiza las operaciones de tu restaurante y la satisfacción del cliente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 60px);
}

.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.feature-card {
  transition: all 0.3s ease;
  border-radius: 1rem;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.stats-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.stat-item {
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
}

.display-1 {
  font-size: 4rem;
}

.lead {
  font-size: 1.25rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .display-1 {
    font-size: 3rem;
  }

  .display-4 {
    font-size: 2rem;
  }

  .hero-section {
    min-height: 50vh;
    padding: 3rem 0;
  }
}
</style>
