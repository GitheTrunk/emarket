<template>
  <div class="relative">
    <input
      v-model="model"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup.enter="search"
      type="text"
      placeholder="Search"
      class="transition-all duration-300 ease-in-out border border-gray-300 rounded-full px-4 py-2 pl-10 focus:ring-2 focus:ring-orange-400 focus:outline-none"
      :class="isFocused ? 'w-64' : 'w-40'"
    />
    <i
      class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
      @click="search"
    ></i>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import "primeicons/primeicons.css";

const props = defineProps({
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "search"]);

const isFocused = ref(false);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const search = () => {
  emit("search", model.value);
};
</script>
