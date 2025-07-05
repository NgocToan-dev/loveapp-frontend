<template>
  <div class="validation-demo">
    <h2>Validation System Demo</h2>
    
    <!-- Login Form Example -->
    <div class="demo-section">
      <h3>Login Form</h3>
      <ValidatedForm
        v-model="loginForm"
        :schema="validationSchemas.login"
        @submit="handleLoginSubmit"
        @invalid-submit="handleInvalidSubmit"
      >
        <template #default="{ getFieldProps, handleFieldInput, handleFieldBlur }">
          <FormField
            type="email"
            label="Email"
            :model-value="loginForm.email"
            v-bind="getFieldProps('email')"
            @update:model-value="(value) => handleFieldInput('email', value)"
            @blur="() => handleFieldBlur('email', loginForm.email)"
          />
          
          <FormField
            type="password"
            label="Password"
            :model-value="loginForm.password"
            v-bind="getFieldProps('password')"
            @update:model-value="(value) => handleFieldInput('password', value)"
            @blur="() => handleFieldBlur('password', loginForm.password)"
          />
          
          <button type="submit" class="submit-btn">Login</button>
        </template>
      </ValidatedForm>
    </div>

    <!-- Profile Form Example -->
    <div class="demo-section">
      <h3>Profile Form</h3>
      <ValidatedForm
        v-model="profileForm"
        :schema="validationSchemas.profile"
        @submit="handleProfileSubmit"
        @invalid-submit="handleInvalidSubmit"
      >
        <template #default="{ getFieldProps, handleFieldInput, handleFieldBlur }">
          <FormField
            type="text"
            label="Display Name"
            :model-value="profileForm.displayName"
            v-bind="getFieldProps('displayName')"
            @update:model-value="(value) => handleFieldInput('displayName', value)"
            @blur="() => handleFieldBlur('displayName', profileForm.displayName)"
          />
          
          <FormField
            type="textarea"
            label="Bio"
            :model-value="profileForm.bio"
            v-bind="getFieldProps('bio')"
            @update:model-value="(value) => handleFieldInput('bio', value)"
            @blur="() => handleFieldBlur('bio', profileForm.bio)"
          />
          
          <FormField
            type="date"
            label="Birth Date"
            :model-value="profileForm.birthDate"
            v-bind="getFieldProps('birthDate')"
            @update:model-value="(value) => handleFieldInput('birthDate', value)"
            @blur="() => handleFieldBlur('birthDate', profileForm.birthDate)"
          />
          
          <FormField
            type="tel"
            label="Phone"
            :model-value="profileForm.phone"
            v-bind="getFieldProps('phone')"
            @update:model-value="(value) => handleFieldInput('phone', value)"
            @blur="() => handleFieldBlur('phone', profileForm.phone)"
          />
          
          <button type="submit" class="submit-btn">Update Profile</button>
        </template>
      </ValidatedForm>
    </div>

    <!-- Custom Validation Example -->
    <div class="demo-section">
      <h3>Custom Validation</h3>
      <ValidatedForm
        v-model="customForm"
        :schema="customSchema"
        @submit="handleCustomSubmit"
        @invalid-submit="handleInvalidSubmit"
      >
        <template #default="{ getFieldProps, handleFieldInput, handleFieldBlur }">
          <FormField
            type="text"
            label="Username"
            :model-value="customForm.username"
            v-bind="getFieldProps('username')"
            @update:model-value="(value) => handleFieldInput('username', value)"
            @blur="() => handleFieldBlur('username', customForm.username)"
          />
          
          <FormField
            type="number"
            label="Age"
            :model-value="customForm.age"
            v-bind="getFieldProps('age')"
            @update:model-value="(value) => handleFieldInput('age', value)"
            @blur="() => handleFieldBlur('age', customForm.age)"
          />
          
          <FormField
            type="url"
            label="Website"
            :model-value="customForm.website"
            v-bind="getFieldProps('website')"
            @update:model-value="(value) => handleFieldInput('website', value)"
            @blur="() => handleFieldBlur('website', customForm.website)"
          />
          
          <button type="submit" class="submit-btn">Submit</button>
        </template>
      </ValidatedForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { validationRules, validationSchemas } from '@/utils'
import FormField from '@/components/common/FormField.vue'
import ValidatedForm from '@/components/common/ValidatedForm.vue'

// Form data
const loginForm = ref({
  email: '',
  password: ''
})

const profileForm = ref({
  displayName: '',
  bio: '',
  birthDate: '',
  phone: ''
})

const customForm = ref({
  username: '',
  age: '',
  website: ''
})

// Custom validation schema
const customSchema = {
  username: {
    rules: [
      validationRules.required(),
      validationRules.minLength(3),
      validationRules.maxLength(20),
      validationRules.custom(
        (value: string) => /^[a-zA-Z0-9_]+$/.test(value),
        'Username can only contain letters, numbers and underscores'
      )
    ]
  },
  age: {
    rules: [
      validationRules.required(),
      validationRules.numeric(),
      validationRules.min(13),
      validationRules.max(120)
    ]
  },
  website: {
    rules: [
      validationRules.url()
    ]
  }
}

// Event handlers
const handleLoginSubmit = (data: any, isValid: boolean) => {
  console.log('Login form submitted:', data, 'Valid:', isValid)
}

const handleProfileSubmit = (data: any, isValid: boolean) => {
  console.log('Profile form submitted:', data, 'Valid:', isValid)
}

const handleCustomSubmit = (data: any, isValid: boolean) => {
  console.log('Custom form submitted:', data, 'Valid:', isValid)
}

const handleInvalidSubmit = (data: any, errors: any) => {
  console.log('Invalid form submitted:', data, 'Errors:', errors)
}
</script>

<style scoped>
.validation-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.demo-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.demo-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #374151;
}

.submit-btn {
  background-color: #22c55e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #16a34a;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>
