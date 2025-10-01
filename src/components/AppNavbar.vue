<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-calendar-check me-2"></i>
        Reservations Happiness
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">
              <i class="bi bi-house me-1"></i>
              Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/reservations" active-class="active">
              <i class="bi bi-calendar3 me-1"></i>
              Reservas
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login" active-class="active">
              <i class="bi bi-box-arrow-in-right me-1"></i>
              Iniciar Sesión
            </router-link>
          </li>

          <li v-if="authStore.isAuthenticated" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle me-1"></i>
              {{ authStore.user?.UserName }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <h6 class="dropdown-header">
                  <i class="bi bi-person me-1"></i>
                  {{ authStore.user?.Email }}
                </h6>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-1"></i>
                  Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  transition: all 0.3s ease;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
}
</style>