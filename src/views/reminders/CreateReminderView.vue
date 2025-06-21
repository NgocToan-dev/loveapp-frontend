<template>
  <div class="create-reminder-view">

    <!-- Form Section -->
    <section class="form-section">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" lg="8" xl="6">
            <CreateReminderDialog 
              :open="true" 
              @close="handleClose"
              @confirm="handleReminderCreated"
              @cancel="handleClose"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import CreateReminderDialog from '@/components/CreateReminderDialog.vue'

const router = useRouter()

const handleClose = () => {
  router.push('/reminders')
}

const handleReminderCreated = () => {
  router.push('/reminders')
}
</script>

<style scoped lang="scss">
.create-reminder-view {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.1) 0%,
    rgba(255, 152, 0, 0.05) 50%,
    rgba(255, 235, 59, 0.1) 100%
  );
}

/* Hero Section */
.reminder-hero {
  position: relative;
  padding: 80px 0 60px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-warning), 0.1) 0%,
    rgba(var(--v-theme-primary), 0.05) 50%,
    rgba(var(--v-theme-surface), 0.1) 100%
  );
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bell-element {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(145deg, rgba(255, 193, 7, 0.3), rgba(255, 152, 0, 0.2));
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: ring 4s ease-in-out infinite;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
}

.bell-element::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: rgba(255, 193, 7, 0.5);
  border-radius: 50%;
}

.bell-element:nth-child(1) {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}
.bell-element:nth-child(2) {
  top: 25%;
  right: 15%;
  animation-delay: 1s;
}
.bell-element:nth-child(3) {
  top: 65%;
  left: 20%;
  animation-delay: 2s;
}
.bell-element:nth-child(4) {
  top: 45%;
  right: 25%;
  animation-delay: 0.5s;
}
.bell-element:nth-child(5) {
  top: 75%;
  left: 45%;
  animation-delay: 1.5s;
}
.bell-element:nth-child(6) {
  top: 35%;
  right: 45%;
  animation-delay: 2.5s;
}

@keyframes ring {
  0%, 100% {
    transform: rotate(-15deg) scale(1);
  }
  25% {
    transform: rotate(15deg) scale(1.1);
  }
  50% {
    transform: rotate(-10deg) scale(1);
  }
  75% {
    transform: rotate(10deg) scale(1.05);
  }
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-family: "Playfair Display", serif;
  font-size: 3.5rem;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-warning)),
    rgb(var(--v-theme-primary))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon {
  color: rgb(var(--v-theme-warning)) !important;
  font-size: 3rem !important;
}

.hero-subtitle {
  font-family: "Montserrat", sans-serif;
  font-size: 1.3rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 30px;
  line-height: 1.6;
}

/* Form Section */
.form-section {
  padding: 40px 0 80px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 8px;
  }

  .title-icon {
    font-size: 2.5rem !important;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .bell-element {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 480px) {
  .reminder-hero {
    padding: 60px 0 40px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .bell-element {
    width: 25px;
    height: 25px;
  }
}
</style>
