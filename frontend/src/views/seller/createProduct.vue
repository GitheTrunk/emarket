<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

      <div class="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">List an Item</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-1">Product Title</label>
            <input v-model="form.title" type="text" class="w-full border rounded-lg p-3" required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold mb-1">Price ($)</label>
              <input v-model.number="form.price" type="number" class="w-full border rounded-lg p-3" required />
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Stock</label>
              <input v-model.number="form.stock" type="number" class="w-full border rounded-lg p-3" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full border rounded-lg p-3"></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
              Create Product
            </button>
            <button type="button" @click="$emit('close')" class="px-6 py-3 bg-gray-100 rounded-lg text-gray-600">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'saved'])

const form = reactive({
  title: '',
  price: 0,
  stock: 1,
  description: '',
  category: 'Electronics'
})

function handleSubmit() {
  // Add your logic to call supabase or your service here
  emit('saved', { ...form })
  // Reset form
  form.title = ''
  form.price = 0
}
</script>