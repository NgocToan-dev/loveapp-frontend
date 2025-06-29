<template>
  <div :class="containerClasses">
    <!-- Label -->
    <label v-if="label" :for="inputId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Leading Icon -->
      <div v-if="hasLeadingIcon" :class="leadingIconClasses">
        <slot name="leading-icon">
          <component v-if="icons[leadingIcon]" :is="icons[leadingIcon]" class="h-5 w-5" />
        </slot>
      </div>

      <!-- Input Element -->
      <input
        v-if="type !== 'textarea'"
        :id="inputId"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="inputClasses"
        :aria-invalid="!!errorMessage"
        :aria-describedby="describedBy"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
      />
      <textarea
        v-else
        :id="inputId"
        v-model="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :maxlength="maxlength"
        :class="inputClasses"
        :aria-invalid="!!errorMessage"
        :aria-describedby="describedBy"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
      ></textarea>

      <!-- Trailing Icon -->
      <div v-if="hasTrailingIcon" :class="trailingIconClasses">
        <slot name="trailing-icon">
          <!-- Loading Spinner -->
          <div
            v-if="loading"
            class="animate-spin h-5 w-5 border-2 border-gray-300 border-t-primary-500 rounded-full"
          />
          <!-- Clear Button -->
          <button
            v-else-if="clearable && modelValue"
            type="button"
            @click="clearInput"
            class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
          <!-- Custom Trailing Icon -->
          <component v-else-if="trailingIcon" :is="trailingIcon" class="h-5 w-5" />
        </slot>
      </div>

      <!-- Character Count -->
      <div
        v-if="showCharCount && maxlength"
        class="absolute -bottom-5 right-0 text-xs text-gray-500"
      >
        {{ characterCount }}/{{ maxlength }}
      </div>
    </div>

    <!-- Help Text -->
    <p v-if="helpText" :class="helpTextClasses">
      {{ helpText }}
    </p>

    <!-- Error Message -->
    <p v-if="errorMessage" :id="`${inputId}-error`" :class="errorClasses">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, useAttrs } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const icons: any = {
  MagnifyingGlassIcon,
};

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea"
  | "date"
  | "time";

interface Props {
  modelValue?: string | number;
  type?: InputType;
  label?: string;
  placeholder?: string;
  helpText?: string;
  errorMessage?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  loading?: boolean;
  clearable?: boolean;
  showCharCount?: boolean;
  maxlength?: number;
  rows?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "romantic" | "spring" | "success" | "warning" | "error";
  leadingIcon?: any;
  trailingIcon?: any;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  readonly: false,
  required: false,
  loading: false,
  clearable: false,
  showCharCount: false,
  rows: 3,
  size: "md",
  variant: "default",
});

const emit = defineEmits<{
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  input: [event: Event];
  clear: [];
}>();

const slots = useSlots();

// Reactive data
const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`);
const isFocused = ref(false);

// Computed properties
// Define typed modelValue for v-model binding
const modelValue = defineModel<string | number>();

const inputElement = computed(() => (props.type === "textarea" ? "textarea" : "input"));

const hasLeadingIcon = computed(() => !!(props.leadingIcon || slots["leading-icon"]));
const hasTrailingIcon = computed(
  () =>
    !!(
      props.loading ||
      (props.clearable && modelValue.value) ||
      props.trailingIcon ||
      slots["trailing-icon"]
    )
);

const characterCount = computed(() => {
  return typeof modelValue.value === "string" ? modelValue.value.length : 0;
});

const describedBy = computed(() => {
  const ids = [];
  if (props.errorMessage) ids.push(`${inputId.value}-error`);
  if (props.helpText) ids.push(`${inputId.value}-help`);
  return ids.length > 0 ? ids.join(" ") : undefined;
});

// Classes
const containerClasses = computed(() => {
  const base = "space-y-1";
  const spacing = props.showCharCount && props.maxlength ? "pb-5" : "";
  return [base, spacing].filter(Boolean).join(" ");
});

const labelClasses = computed(() => {
  const base = "block text-sm font-medium";

  const colorClasses = {
    default: "text-gray-700",
    romantic: "text-rose-700",
    spring: "text-primary-700",
    success: "text-emerald-700",
    warning: "text-amber-700",
    error: "text-red-700",
  };

  const disabledClass = props.disabled ? "opacity-50" : "";

  return [base, colorClasses[props.variant], disabledClass].filter(Boolean).join(" ");
});

const inputClasses = computed(() => {
  const base =
    "block w-full rounded-lg border shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-4 py-3 text-lg",
  };

  // State-based classes
  const stateClasses = props.errorMessage
    ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
    : isFocused.value
    ? "border-primary-300 focus:ring-primary-500 focus:border-primary-500"
    : "border-gray-300 focus:ring-primary-500 focus:border-primary-500";

  // Variant background
  const variantClasses = {
    default: "bg-white",
    romantic: "bg-rose-50 focus:bg-white",
    spring: "bg-green-50 focus:bg-white",
    success: "bg-emerald-50 focus:bg-white",
    warning: "bg-amber-50 focus:bg-white",
    error: "bg-red-50 focus:bg-white",
  };

  // Icon padding
  const leadingPadding = hasLeadingIcon.value ? "pl-10" : "";
  const trailingPadding = hasTrailingIcon.value ? "pr-10" : "";

  // Disabled state
  const disabledClasses = props.disabled
    ? "opacity-50 cursor-not-allowed bg-gray-50"
    : props.readonly
    ? "bg-gray-50 cursor-default"
    : "";

  return [
    base,
    sizeClasses[props.size],
    stateClasses,
    variantClasses[props.variant],
    leadingPadding,
    trailingPadding,
    disabledClasses,
  ]
    .filter(Boolean)
    .join(" ");
});

const leadingIconClasses = computed(() => {
  const base = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none";

  const colorClasses = {
    default: "text-gray-400",
    romantic: "text-rose-400",
    spring: "text-primary-400",
    success: "text-emerald-400",
    warning: "text-amber-400",
    error: "text-red-400",
  };

  return `${base} ${colorClasses[props.variant]}`;
});

const trailingIconClasses = computed(() => {
  const base = "absolute inset-y-0 right-0 pr-3 flex items-center";

  const colorClasses = {
    default: "text-gray-400",
    romantic: "text-rose-400",
    spring: "text-primary-400",
    success: "text-emerald-400",
    warning: "text-amber-400",
    error: "text-red-400",
  };

  return `${base} ${colorClasses[props.variant]}`;
});

const helpTextClasses = computed(() => {
  return "text-sm text-gray-600 mt-1";
});

const errorClasses = computed(() => {
  return "text-sm text-red-600 mt-1";
});

// Event handlers
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit("blur", event);
};

const handleInput = (event: Event) => {
  emit("input", event);
};

const clearInput = () => {
  emit("clear");
};
</script>
