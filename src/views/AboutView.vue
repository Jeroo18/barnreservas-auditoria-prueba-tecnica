<template>
  <div class="about-container">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="text-center mb-5">
            <i class="bi bi-info-circle text-primary display-1 mb-4"></i>
            <h1 class="display-4 fw-bold text-dark mb-4">Acerca del Sistema</h1>
            <p class="lead text-muted">
              Sistema de gestión de reservas para restaurantes desarrollado con tecnología moderna.
            </p>
          </div>

          <div class="row g-4">
            <div class="col-md-6">
              <div class="info-card">
                <h3 class="h5 fw-bold text-primary mb-3">
                  <i class="bi bi-gear me-2"></i>
                  Tecnologías Utilizadas
                </h3>
                <ul class="list-unstyled">
                  <li><i class="bi bi-check text-success me-2"></i>Vue 3 + Composition API</li>
                  <li><i class="bi bi-check text-success me-2"></i>TypeScript</li>
                  <li><i class="bi bi-check text-success me-2"></i>Bootstrap 5</li>
                  <li><i class="bi bi-check text-success me-2"></i>Pinia State Management</li>
                  <li><i class="bi bi-check text-success me-2"></i>Vue Router</li>
                </ul>
              </div>
            </div>

            <div class="col-md-6">
              <div class="info-card">
                <h3 class="h5 fw-bold text-primary mb-3">
                  <i class="bi bi-list-check me-2"></i>
                  Funcionalidades
                </h3>
                <ul class="list-unstyled">
                  <li><i class="bi bi-check text-success me-2"></i>Gestión completa de reservas</li>
                  <li><i class="bi bi-check text-success me-2"></i>Autenticación JWT</li>
                  <li><i class="bi bi-check text-success me-2"></i>Búsqueda y filtrado</li>
                  <li><i class="bi bi-check text-success me-2"></i>Interfaz responsive</li>
                  <li><i class="bi bi-check text-success me-2"></i>Validación de formularios</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="text-center mt-5">
            <div class="author-info">
              <h4 class="fw-bold text-dark">Desarrollado por</h4>
              <p class="h5 text-primary fw-semibold mb-0">MSc. Salvador Cuevas</p>
              <p class="text-muted">Banreservas - Auditoría</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.author-info {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.display-1 {
  font-size: 4rem;
}

@media (max-width: 768px) {
  .display-1 {
    font-size: 3rem;
  }

  .display-4 {
    font-size: 2rem;
  }
}
</style>
