<template>
  <div class="not-found-container">
    <div class="text-center">
      <div class="error-animation mb-4">
        <i class="bi bi-calendar-x text-primary display-1"></i>
        <div class="error-code">404</div>
      </div>

      <h1 class="display-4 fw-bold text-dark mb-3">
        Página No Encontrada
      </h1>

      <p class="lead text-muted mb-4">
        Lo siento, la página que buscas no existe o ha sido movida.
      </p>

      <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
        <router-link
          to="/"
          class="btn btn-primary btn-lg px-4 py-3"
        >
          <i class="bi bi-house me-2"></i>
          Ir a Inicio
        </router-link>

        <router-link
          to="/reservations"
          class="btn btn-outline-primary btn-lg px-4 py-3"
        >
          <i class="bi bi-calendar3 me-2"></i>
          Ver Reservas
        </router-link>
      </div>

      <div class="mt-5">
        <p class="text-muted small">
          <i class="bi bi-info-circle me-1"></i>
          Si crees que esto es un error, por favor contacta al soporte.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this simple 404 page
</script>

<style scoped>
.not-found-container {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.error-animation {
  position: relative;
  display: inline-block;
}

.error-code {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: 900;
  color: #667eea;
  opacity: 0.3;
  font-family: 'Courier New', monospace;
}

.display-1 {
  font-size: 6rem;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
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

.btn-outline-primary {
  border-color: #667eea;
  color: #667eea;
}

.btn-outline-primary:hover {
  background-color: #667eea;
  border-color: #667eea;
}

@media (max-width: 768px) {
  .display-1 {
    font-size: 4rem;
  }

  .display-4 {
    font-size: 2rem;
  }

  .error-code {
    font-size: 1.5rem;
  }

  .not-found-container {
    padding: 1rem;
  }
}
</style>