<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Search and Filter Bar -->
    <div class="bg-white shadow-sm border-b border-gray-200 p-4 mb-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search Bar -->
          <div class="flex-1">
            <div class="relative">
              <input
                id="product-search"
                name="product-search"
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="onSearch"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="w-full md:w-64">
            <select
              id="category-filter"
              name="category-filter"
              v-model="selectedCategory"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="filterProducts"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Sort Options -->
          <div class="w-full md:w-48">
            <select
              id="sort-products"
              name="sort-products"
              v-model="sortBy"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="sortProducts"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="max-w-7xl mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 text-lg">{{ error }}</p>
        <button @click="fetchProducts" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
        <p class="text-gray-500">Try adjusting your search or filters</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          @click="viewProduct(product)"
        >
          <!-- Product Image -->
          <div class="relative h-48 bg-gray-100">
            <img
              v-if="product.images && product.images.length > 0"
              :src="product.images[0]"
              :alt="product.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex items-center justify-center h-full">
              <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <!-- Stock Badge -->
            <div class="absolute top-2 right-2">
              <span
                v-if="product.stock > 0"
                class="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded"
              >
                In Stock
              </span>
              <span v-else class="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                Out of Stock
              </span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <!-- Category Badge -->
            <div class="mb-2">
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {{ product.category }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ product.title }}
            </h3>

            <!-- Description -->
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ truncate(product.description, 50) }}
            </p>

            <!-- Price and Action -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-2xl font-bold text-blue-600">${{ product.price.toFixed(2) }}</p>
              </div>
              <button
                @click.stop="addToCart(product)"
                :disabled="product.stock === 0"
                class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div
      v-if="selectedProduct"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Close Button -->
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-900">Product Details</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Image Gallery -->
            <div>
              <div class="bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  :src="currentImage"
                  :alt="selectedProduct.title"
                  class="w-full h-96 object-cover"
                />
              </div>
              <!-- Thumbnails -->
              <div v-if="selectedProduct.images.length > 1" class="flex gap-2 overflow-x-auto">
                <img
                  v-for="(img, idx) in selectedProduct.images"
                  :key="idx"
                  :src="img"
                  @click="currentImage = img"
                  class="w-20 h-20 object-cover rounded cursor-pointer border-2"
                  :class="currentImage === img ? 'border-blue-600' : 'border-gray-300'"
                />
              </div>
            </div>

            <!-- Product Details -->
            <div>
              <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded mb-3">
                {{ selectedProduct.category }}
              </span>
              
              <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ selectedProduct.title }}</h3>
              
              <p class="text-3xl font-bold text-blue-600 mb-4">${{ selectedProduct.price.toFixed(2) }}</p>
              
              <div class="mb-4">
                <span
                  v-if="selectedProduct.stock > 0"
                  class="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded"
                >
                  {{ selectedProduct.stock }} in stock
                </span>
                <span v-else class="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                  Out of Stock
                </span>
              </div>

              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <p class="text-gray-600 whitespace-pre-line">{{ selectedProduct.description }}</p>
              </div>

              <div class="flex gap-3">
                <button
                  @click="addToCart(selectedProduct)"
                  :disabled="selectedProduct.stock === 0"
                  class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                >
                  Add to Cart
                </button>
                <button
                  @click="buyNow(selectedProduct)"
                  :disabled="selectedProduct.stock === 0"
                  class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import supabase from '@/lib/supabase'
import type { Product } from '@/types/database'

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const selectedProduct = ref<Product | null>(null)
const currentImage = ref('')

const categories = ref<string[]>(['Electronics', 'Clothing', 'Home & Living', 'Books', 'Other'])

// Fetch products from database
const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = ''

    const { data, error: fetchError, status } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('[BuyerDashboard] fetch products', { status, fetchError, data })

    if (fetchError) throw fetchError

    products.value = data || []
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = `Failed to load products. ${err instanceof Error ? err.message : ''}`.trim()
  } finally {
    loading.value = false
  }
}

// Filter and sort products
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // Sort
  if (sortBy.value === 'price-low') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return result
})

const onSearch = () => {
  // Trigger reactive computation
}

const filterProducts = () => {
  // Trigger reactive computation
}

const sortProducts = () => {
  // Trigger reactive computation
}

const truncate = (text: string, max = 80) => {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text
}

const viewProduct = (product: Product) => {
  selectedProduct.value = product
  currentImage.value = product.images && product.images.length > 0 ? product.images[0] || '' : ''
}

const closeModal = () => {
  selectedProduct.value = null
  currentImage.value = ''
}

const addToCart = (product: Product) => {
  // TODO: Implement cart functionality
  alert(`Added "${product.title}" to cart!`)
  console.log('Add to cart:', product)
}

const buyNow = (product: Product) => {
  // TODO: Implement checkout flow
  alert(`Proceeding to checkout for "${product.title}"`)
  console.log('Buy now:', product)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
