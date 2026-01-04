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
						<option value="draft">Draft</option>
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
									<button class="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100" @click="toggleStatus(item)">
										{{ item.status === 'active' ? 'Pause' : 'Activate' }}
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
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import supabase from '@/lib/supabase'
import type { Product as ProductRow } from '@/types/database'

type ProductStatus = 'active' | 'draft' | 'out_of_stock'

type Product = {
	id: string
	title: string
	category: string
	price: number
	stock: number
	status: ProductStatus
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

		const mapped: Product[] = (data || []).map((row: ProductRow) => ({
			id: String(row.id),
			title: row.title,
			category: row.category,
			price: row.price,
			stock: row.stock,
			status: row.stock > 0 ? 'active' : 'out_of_stock',
			updatedAt: row.created_at
		}))

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
	return 'Out of stock'
}

function statusClasses(status: ProductStatus) {
	if (status === 'active') return 'bg-green-100 text-green-700'
	if (status === 'draft') return 'bg-blue-100 text-blue-700'
	return 'bg-orange-100 text-orange-700'
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(value))
}

function toggleStatus(item: Product) {
	if (item.status === 'active') {
		item.status = 'draft'
		return
	}

	if (item.stock <= 0) {
		item.status = 'out_of_stock'
		return
	}

	item.status = 'active'
}

function remove(id: string) {
	const proceed = confirm('Remove this product?')
	if (!proceed) return

	const doRemove = async () => {
		try {
			const { error } = await supabase.from('products').delete().eq('id', Number(id))
			if (error) throw error
			products.value = products.value.filter((p) => p.id !== id)
		} catch (err) {
			console.error('Failed to remove product', err)
			alert('Failed to remove product')
		}
	}

	doRemove()
}

function refresh() {
	fetchProducts()
}

function goToCreate() {
	router.push({ name: 'SellerDashboard' })
}
</script>
