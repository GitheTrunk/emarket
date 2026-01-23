<template>
	<div class="space-y-6">
		<h1 class="text-2xl font-semibold">Sales Analytics</h1>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="p-4 rounded-lg bg-green-50 border">
				<p class="text-sm text-gray-500">Total Revenue</p>
				<p class="text-2xl font-semibold mt-2">{{ formatCurrency(totalRevenue) }}</p>
			</div>

			<div class="p-4 rounded-lg bg-blue-50 border">
				<p class="text-sm text-gray-500">Average Order Value</p>
				<p class="text-2xl font-semibold mt-2">{{ formatCurrency(averageOrderValue) }}</p>
			</div>

			<div class="p-4 rounded-lg bg-pink-50 border">
				<p class="text-sm text-gray-500">Conversion Rate</p>
				<p class="text-2xl font-semibold mt-2">{{ conversionRate }}%</p>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="bg-white rounded shadow border border-gray-200 p-4">
				<h3 class="font-semibold mb-4">Order Status Breakdown</h3>
				<div class="space-y-3">
					<div class="flex justify-between"><span>Delivered</span><span class="text-green-600">{{ stats.delivered }}</span></div>
					<div class="flex justify-between"><span>Shipped</span><span class="text-blue-600">{{ stats.shipped }}</span></div>
					<div class="flex justify-between"><span>Processing</span><span class="text-yellow-600">{{ stats.processing }}</span></div>
					<div class="flex justify-between"><span>Pending</span><span class="text-gray-600">{{ stats.pending }}</span></div>
				</div>
			</div>

			<div class="bg-white rounded shadow border border-gray-200 p-4">
				<h3 class="font-semibold mb-4">Product Stats</h3>
				<div class="space-y-3">
					<div class="flex justify-between"><span>Total Products</span><span>{{ productStats.total }}</span></div>
					<div class="flex justify-between"><span>Active Products</span><span class="text-green-600">{{ productStats.active }}</span></div>
					<div class="flex justify-between"><span>Inactive Products</span><span class="text-gray-600">{{ productStats.inactive }}</span></div>
					<div class="flex justify-between"><span>Total Customers</span><span>{{ productStats.customers }}</span></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import supabase from '@/lib/supabase'

const loading = ref(false)
const error = ref('')

const totalRevenue = ref(0)
const averageOrderValue = ref(0)
const conversionRate = ref(0)

const stats = reactive({ delivered: 0, shipped: 0, processing: 0, pending: 0 })

const productStats = reactive({ total: 0, active: 0, inactive: 0, customers: 0 })

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

async function fetchAnalytics() {
	loading.value = true
	error.value = ''
	try {
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) throw new Error('Not authenticated')

		console.log('Fetching analytics for seller:', user.id)

		// Orders for this seller
		const { data: orders, error: ordersErr } = await supabase
			.from('orders')
			.select('id,total_price,order_status,buyer_id,created_at')
			.eq('seller_id', user.id)

		console.log('Orders fetch result:', { ordersErr, ordersLength: orders?.length, orders })

		if (ordersErr) {
			// If orders table not present, keep zeros
			console.warn('Orders fetch error - details:', {
				message: ordersErr.message,
				code: ordersErr.code,
				details: ordersErr.details
			})
		} else if (orders) {
			const total = orders.reduce((s: number, o: any) => s + (Number(o.total_price) || 0), 0)
			totalRevenue.value = total
			averageOrderValue.value = orders.length ? total / orders.length : 0

			// statuses (using order_status column)
			stats.delivered = orders.filter((o: any) => o.order_status === 'delivered').length
			stats.shipped = orders.filter((o: any) => o.order_status === 'shipped').length
			stats.processing = orders.filter((o: any) => o.order_status === 'processing').length
			stats.pending = orders.filter((o: any) => o.order_status === 'pending').length

			// conversion rate: completed (delivered) / total orders (fallback)
			conversionRate.value = orders.length ? Math.round((stats.delivered / orders.length) * 100) : 0

			// Customers: distinct buyers from these orders
			const distinct = Array.from(new Set(orders.map((o: any) => o.buyer_id)))
			productStats.customers = distinct.length
		}

		// Products for this seller
		const { data: products, error: prodErr } = await supabase
			.from('products')
			.select('id,status')
			.eq('seller_id', user.id)

		if (prodErr) {
			console.warn('Products fetch error', prodErr)
		} else if (products) {
			productStats.total = products.length
			productStats.active = products.filter((p: any) => p.status === 'active').length
			productStats.inactive = products.filter((p: any) => p.status !== 'active').length
		}

	} catch (err: any) {
		console.error('Analytics error', err)
		error.value = err.message || 'Failed to load analytics'
	} finally {
		loading.value = false
	}
}

onMounted(fetchAnalytics)
</script>

