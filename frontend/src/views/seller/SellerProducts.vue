<template>
	<div class="max-w-6xl mx-auto space-y-4">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-2xl font-bold">Products</h1>
				<p class="text-sm text-gray-500">Manage stock, pricing, and visibility.</p>
			</div>

			<div class="flex flex-wrap gap-2">
				<button class="px-4 py-2 rounded border border-gray-200 hover:bg-gray-50" @click="refresh">Refresh</button>
				<button class="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600" @click="goToCreate">+ New product</button>
			</div>
		</div>

		<div class="bg-white rounded shadow border border-gray-200 p-4 space-y-4">
			<div class="grid gap-3 md:grid-cols-3">
				<div>
					<label class="text-xs text-gray-500">Search</label>
					<input v-model="filters.search" type="text" placeholder="Name or category" class="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm" />
				</div>
				<div>
					<label class="text-xs text-gray-500">Status</label>
					<select v-model="filters.status" class="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm">
						<option value="all">All</option>
						<option value="active">Active</option>
						<option value="paused">Paused</option>
						<option value="out_of_stock">Out of stock</option>
					</select>
				</div>
				<div>
					<label class="text-xs text-gray-500">Sort by</label>
					<select v-model="filters.sort" class="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm">
						<option value="recent">Recent</option>
						<option value="price_desc">Price: High → Low</option>
						<option value="price_asc">Price: Low → High</option>
						<option value="stock">Stock</option>
					</select>
				</div>
			</div>

			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 text-sm">
					<thead class="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
						<tr>
							<th class="px-4 py-3">Product</th>
							<th class="px-4 py-3">Price</th>
							<th class="px-4 py-3">Stock</th>
							<th class="px-4 py-3">Status</th>
							<th class="px-4 py-3">Updated</th>
							<th class="px-4 py-3 text-right">Actions</th>
						</tr>
					</thead>

					<tbody class="divide-y divide-gray-100">
						<tr v-if="loading">
							<td class="px-4 py-6 text-center text-sm text-gray-500" colspan="6">Loading products…</td>
						</tr>
						<tr v-else-if="errorMessage">
							<td class="px-4 py-6 text-center text-sm text-red-600" colspan="6">{{ errorMessage }}</td>
						</tr>
						<template v-else>
							<tr v-for="item in filteredProducts" :key="item.id" class="hover:bg-gray-50">
							<td class="px-4 py-3">
								<div class="font-semibold text-gray-900">{{ item.title }}</div>
								<div class="text-xs text-gray-500">{{ item.category }}</div>
							</td>
							<td class="px-4 py-3 text-gray-900">${{ item.price.toFixed(2) }}</td>
							<td class="px-4 py-3 text-gray-900">{{ item.stock }}</td>
							<td class="px-4 py-3">
								<span :class="['inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold', statusClasses(item.status)]">
									{{ statusLabel(item.status) }}
								</span>
							</td>
							<td class="px-4 py-3 text-gray-500">{{ formatDate(item.updatedAt) }}</td>
							<td class="px-4 py-3">
								<div class="flex justify-end gap-2">
									<button class="rounded-md border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50" @click="editProduct(item.id)">
										Edit
									</button>
									<button class="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100" @click="pause(item.id)">
										Pause
									</button>
									<button v-if="statusLabel(item.status) == 'Paused'" class="rounded-md border border-green-200 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100" @click="unPause(item.id)">
										Unpause
									</button>
									<button class="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50" @click="remove(item.id)">
										Remove
									</button>
								</div>
							</td>
							</tr>

							<tr v-if="!filteredProducts.length">
								<td class="px-4 py-6 text-center text-sm text-gray-500" colspan="6">
									No products match your filters.
								</td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>

		<EditProductModal :show="showEditModal" :product="selectedProductForEdit" @close="showEditModal = false" @save="saveProduct" />
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import supabase from '@/lib/supabase'
import type { Product as ProductRow } from '@/types/database'
import EditProductModal from '@/components/ui/EditProductModal.vue'

type ProductStatus = 'active' | 'draft' | 'out_of_stock' | 'paused'

type Product = {
	id: string
	title: string
	description?: string
	category: string
	price: number
	stock: number
	status: ProductStatus
	images: string[]
	updatedAt: string
}

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const products = ref<Product[]>([])

const filters = reactive({
	search: '',
	status: 'all',
	sort: 'recent'
})

const filteredProducts = computed(() => {
	const term = filters.search.toLowerCase().trim()

	let list = products.value.filter((item) => {
		const matchesSearch = !term || item.title.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
		const matchesStatus = filters.status === 'all' || item.status === filters.status
		return matchesSearch && matchesStatus
	})

	list = [...list].sort((a, b) => {
		switch (filters.sort) {
			case 'price_desc':
				return b.price - a.price
			case 'price_asc':
				return a.price - b.price
			case 'stock':
				return b.stock - a.stock
			default:
				return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		}
	})

	return list
})

async function fetchProducts() {
	try {
		loading.value = true
		errorMessage.value = ''

		const { data: { user }, error: authError } = await supabase.auth.getUser()
		if (authError || !user) {
			throw new Error('Not authenticated')
		}

		const { data, error } = await supabase
			.from('products')
			.select('*')
			.eq('seller_id', user.id)
			.order('created_at', { ascending: false })

		if (error) throw error

		const mapped: Product[] = (data || []).map((row: ProductRow) => {
			// Auto-set out_of_stock if stock is 0 and not paused
			let productStatus = row.status
			if (row.stock === 0 && row.status !== 'paused') {
				productStatus = 'out_of_stock'
			}
			
			return {
				id: String(row.id),
				title: row.title,
				description: row.description,
				category: row.category,
				price: row.price,
				stock: row.stock,
				status: productStatus,
				images: row.images || [],
				updatedAt: row.created_at
			}
		})

		products.value = mapped
	} catch (err) {
		console.error('Failed to load products', err)
		errorMessage.value = (err as Error).message || 'Failed to load products'
	} finally {
		loading.value = false
	}
}

onMounted(fetchProducts)

function statusLabel(status: ProductStatus) {
	if (status === 'active') return 'Active'
	if (status === 'draft') return 'Draft'
	if (status === 'paused') return 'Paused'
	if (status === 'out_of_stock') return 'Out of Stock'
	return 'Unknown'
}

function statusClasses(status: ProductStatus) {
	if (status === 'active') return 'bg-green-100 text-green-700'
	if (status === 'draft') return 'bg-blue-100 text-blue-700'
	if (status === 'paused') return 'bg-gray-100 text-gray-700'
	if (status === 'out_of_stock') return 'bg-red-100 text-red-700'
	return 'bg-orange-100 text-orange-700'
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(value))
}

function remove(id: string) {
	const proceed = confirm('Remove this product?')
	if (!proceed) return

	const doRemove = async () => {
		try {
			const { error } = await supabase.from('products').delete().eq('id', id)
			if (error) throw error
			products.value = products.value.filter((p) => p.id !== id)
		} catch (err) {
			console.error('Failed to remove product', err)
			alert('Failed to remove product')
		}
	}

	doRemove()
}

const showEditModal = ref(false)
const selectedProductId = ref<string | null>(null)

const selectedProductForEdit = computed(() => {
	if (!selectedProductId.value) return null
	return products.value.find(p => p.id === selectedProductId.value) || null
})

function editProduct(id: string) {
	selectedProductId.value = id
	showEditModal.value = true
}

async function saveProduct(data: { title: string; description: string; price: number; stock: number; category: string; status: string }) {
	if (!selectedProductId.value) return

	try {
		const { error } = await supabase
			.from('products')
			.update({
				title: data.title,
				description: data.description,
				price: data.price,
				stock: data.stock,
				category: data.category,
				status: data.status
			})
			.eq('id', selectedProductId.value)

		if (error) {
			console.error('Supabase error:', error)
			throw error
		}

		// Refresh the products list to get updated data
		await fetchProducts()

		showEditModal.value = false
		selectedProductId.value = null
	} catch (err) {
		console.error('Failed to update product', err)
		alert(`Failed to update product: ${err instanceof Error ? err.message : 'Unknown error'}`)
	}
}

function pause(id: string) {
    const proceed = confirm('Pause this product?')
    if (!proceed) return

    const doPause = async () => {
        try {
            const { error } = await supabase.from('products').update({ status: 'paused' }).eq('id', id)
            if (error) throw error
            const product = products.value.find((p) => p.id === id)
            if (product) product.status = 'paused'

        } catch (err) {
            console.error('Failed to pause product', err)
            alert('Failed to pause product')
            
        }
    }

    doPause()
}

function unPause(id: string) {
	const proceed = confirm('Unpause this product?')
	if (!proceed) return

	const doUnPause = async () => {
		try {
			const { error } = await supabase.from('products').update({ status: 'active' }).eq('id', id)
			if (error) throw error
			const product = products.value.find((p) => p.id === id)
			if (product) product.status = 'active'

		} catch (err) {
			console.error('Failed to unpause product', err)
			alert('Failed to unpause product')
			
		}
	}

	doUnPause()
}

function refresh() {
	fetchProducts()
}

function goToCreate() {
	router.push({ name: 'SellerDashboard' })
}
</script>
