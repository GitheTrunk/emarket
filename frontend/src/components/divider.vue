<template>
  <div class="flex items-center my-4">
    <div class="flex-1 border-t border-gray-300"></div>

    <span v-if="text" class="px-3 text-gray-500 text-sm">
      {{ text }}
    </span>

    <div class="flex-1 border-t border-gray-300"></div>
  </div>
</template>

<script>
export default {
  name: "Divider",
  props: {
    text: {
      type: String,
      default: ""
    }
  }
};
</script>