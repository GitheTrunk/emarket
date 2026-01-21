<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto py-10" @click.self="closeModal">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl my-auto">
            <h3 class="text-xl font-bold mb-4">Edit Product</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                    <input v-model="formData.title" type="text" class="w-full rounded border border-gray-300 px-3 py-2" placeholder="e.g. Wireless Headphones" />
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="formData.description" rows="3" class="w-full rounded border border-gray-300 px-3 py-2" placeholder="Describe your product..."></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2 text-gray-500">$</span>
                        <input type="number" v-model.number="formData.price" class="w-full rounded border border-gray-300 pl-7 pr-3 py-2" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input type="number" v-model.number="formData.stock" class="w-full rounded border border-gray-300 px-3 py-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input v-model="formData.category" type="text" class="w-full rounded border border-gray-300 px-3 py-2" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="formData.status" class="w-full rounded border border-gray-300 px-3 py-2 bg-white">
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="paused">Paused</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
                <button @click="closeModal" class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">Cancel</button>
                <button @click="handleSave" class="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600">
                    Update Product
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Product {
	id: string
	title: string
	description?: string
	price: number
	category: string
	stock: number
	status: 'active' | 'draft' | 'paused' | 'out_of_stock'
	images: string[]
}

interface Props {
	show: boolean
	product: Product | null
}

interface Emits {
	(e: 'close'): void
	(e: 'save', data: {
		title: string
		description: string
		price: number
		stock: number
		category: string
		status: string
	}): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = reactive({
	title: '',
	description: '',
	price: 0,
	stock: 0,
	category: '',
	status: 'active' as 'active' | 'draft' | 'paused' | 'out_of_stock',
})

watch(() => props.product, (newProduct) => {
	if (newProduct) {
		formData.title = newProduct.title
		formData.description = newProduct.description || ''
		formData.price = newProduct.price
		formData.stock = newProduct.stock
		formData.category = newProduct.category
		formData.status = newProduct.status
	}
}, { immediate: true })

function closeModal() {
	emit('close')
}

function handleSave() {
	emit('save', {
		title: formData.title,
		description: formData.description,
		price: formData.price,
		stock: formData.stock,
		category: formData.category,
		status: formData.status,
	})
}
</script>
