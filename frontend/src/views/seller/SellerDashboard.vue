<template>
    <div class="max-w-full">
        <div class="flex items-start gap-6">
            <!-- Inner left white menu card -->
            <div class="w-72">
                <div class="bg-white rounded shadow-sm border border-gray-200 p-4">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded bg-white flex items-center justify-center overflow-hidden">
                            <img src="@/assets/logo/img.png" alt="E-Market" class="w-full h-full object-contain" />
                        </div>
                        <div class="font-bold">Hi <span>{{ profiles }} <i class="pi pi-verified" style="color: green"></i></span></div>
                    </div>

                    <ul class="space-y-2">
                        <li>
                            <button class="w-full text-left p-3 rounded border border-orange-200 bg-orange-50 flex items-center gap-3">
                                <svg class="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18" />
                                </svg>
                                <span>Dashboard</span>
                            </button>
                        </li>

                        <li>
                            <button class="w-full text-left p-3 rounded hover:bg-gray-50 flex items-center gap-3">
                                <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18" />
                                </svg>
                                <span>Product</span>
                            </button>
                        </li>

                        <li>
                            <button class="w-full text-left p-3 rounded hover:bg-gray-50 flex items-center gap-3">
                                <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18" />
                                </svg>
                                <span>Order</span>
                            </button>
                        </li>

                        <li>
                            <button class="w-full text-left p-3 rounded hover:bg-gray-50 flex items-center gap-3">
                                <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18" />
                                </svg>
                                <span>Earning</span>
                            </button>
                        </li>
                    </ul>

                    <div class="mt-6">
                        <button @click="logout" class="w-full bg-gray-300 py-2 rounded flex items-center gap-2 justify-center hover:bg-red-500 text-white">Log out</button>
                    </div>
                </div>
            </div>

            <!-- Right content -->
            <div class="flex-1">
                <!-- <h1 class="text-4xl font-extrabold mb-4">Seller Dashboard</h1> -->

                <section class="bg-white rounded shadow border border-gray-200 p-6">
                    <h2 class="text-2xl font-bold mb-4">Create item</h2>

                    <form @submit.prevent="onSubmit" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">*Title item</label>
                                <div class="relative">
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l"></div>
                                    <input v-model="form.title" type="text" class="w-full pl-4 pl-6 rounded border border-gray-300 px-4 py-3" />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">*Price($)</label>
                                <div class="relative">
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l"></div>
                                    <input v-model.number="form.price" type="number" min="0" step="0.01" class="w-full pl-4 pl-6 rounded border border-gray-300 px-4 py-3" />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">*Stock</label>
                                <div class="relative">
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l"></div>
                                    <input v-model.number="form.stock" type="number" min="0" step="1" class="w-full pl-4 pl-6 rounded border border-gray-300 px-4 py-3" />
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">*Category</label>
                                <div class="relative">
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l"></div>
                                    <select v-model="form.category" class="w-full pl-4 pl-6 rounded border border-gray-300 px-4 py-3 bg-white">
                                        <option value="">Select Category</option>
                                        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">*Condition</label>
                                <div class="relative">
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l"></div>
                                    <select v-model="form.condition" class="w-full pl-4 pl-6 rounded border border-gray-300 px-4 py-3 bg-white">
                                        <option value="">Select Condition</option>
                                        <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">*Name of category</label>
                            <div class="relative">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l"></div>
                                <input v-model="form.categoryName" type="text" class="w-full pl-4 pl-6 rounded border border-gray-300 px-4 py-3" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">*Description</label>
                            <div class="relative">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l"></div>
                                <textarea v-model="form.description" rows="5" class="w-full pl-4 pl-6 rounded border border-gray-300 px-4 py-3" placeholder="Describe your item......"></textarea>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">*Upload Photo</label>
                            <div @drop.prevent="onDrop" @dragover.prevent class="border-2 border-dashed border-gray-300 rounded p-6 text-center bg-gray-50">
                                <div class="flex flex-col items-center gap-2">
                                    <svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M7 10l5-5 5 5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12 5v12" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <div class="text-sm text-gray-500">Click for upload or drag and drop<br/>PNG, JPG, GIF up to 10MB</div>
                                    <input ref="fileInput" @change="onFileChange" type="file" accept="image/*" class="hidden" />
                                    <button type="button" @click="openFile" class="mt-3 px-4 py-2 rounded bg-white border border-gray-200">Select files</button>
                                </div>

                                <div v-if="previews.length" class="mt-4 flex gap-3 overflow-x-auto">
                                    <div v-for="(p, idx) in previews" :key="idx" class="w-24 h-24 rounded overflow-hidden border">
                                        <img :src="p" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-4 mt-4">
                            <button type="submit" class="px-6 py-2 rounded bg-green-500 text-white">Create item</button>
                            <button type="button" @click="onCancel" class="px-6 py-2 rounded bg-rose-300 text-white">Cancel</button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'primeicons/primeicons.css'
import logo from '@/assets/logo/img.png'
import supabase from '@/lib/supabase'
import { createProduct } from '@/services/productService'
import { uploadProductImage } from '@/services/storageService'

const router = useRouter()

const profiles = ref<string>('Seller')
const categories = ref<string[]>(['Electronics', 'Clothing', 'Home & Living', 'Books', 'Other'])
const conditions = ref<string[]>(['New', 'Used - Like New', 'Used - Good', 'Used - Acceptable'])

async function fetchProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && user.user_metadata?.fullName) {
            profiles.value = user.user_metadata.fullName.toUpperCase()

        }
    } catch (err) {
        console.error('Error fetching profile:', err)
    }
}

onMounted(() => fetchProfile())

const form = reactive({
    title: '',
    price: 0,
    stock: 1,
    category: '',
    condition: '',
    categoryName: '',
    description: ''
})

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const previews = ref<string[]>([])

function openFile() {
    fileInput.value?.click()
}

function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (!target.files) return
    addFiles(Array.from(target.files))
}

function onDrop(e: DragEvent) {
    if (!e.dataTransfer) return
    addFiles(Array.from(e.dataTransfer.files))
}

function addFiles(list: File[]) {
    for (const f of list) {
        if (!f.type.startsWith('image/')) continue
        if (f.size > 10 * 1024 * 1024) continue
        files.value.push(f)
        const url = URL.createObjectURL(f)
        previews.value.push(url)
    }
}

function revokePreviews() {
    for (const u of previews.value) URL.revokeObjectURL(u)
}

onUnmounted(() => revokePreviews())

// function onSubmit() {
//     console.log('submit', { ...form, files: files.value })
//     alert('Form submitted — check console for payload')
// }

function onCancel() {
    form.title = ''
    form.price = 0
    form.stock = 1
    form.category = ''
    form.condition = ''
    form.categoryName = ''
    form.description = ''
    files.value = []
    revokePreviews()
    previews.value = []
}

async function onSubmit() {
  try {
    // Validate required fields
        const categoryValue = form.category || form.categoryName.trim()

        if (!form.title || !form.price || !form.description) {
            alert('Please fill all required fields')
            return
        }

        if (!categoryValue) {
            alert('Please select a category or type a new one')
            return
        }

    if (form.price <= 0) {
      alert('Price must be greater than 0')
      return
    }

        if (form.stock < 0) {
            alert('Stock cannot be negative')
            return
        }

    if (files.value.length === 0) {
      alert('Please upload at least one image')
      return
    }

    // Upload images
    const imageUrls = await Promise.all(
      files.value.map(file => uploadProductImage(file))
    )

    // Create product (note: condition & categoryName are not in schema, so they're ignored)
    await createProduct({
      title: form.title,
      description: form.description,
      price: form.price,
            category: categoryValue,
            stock: form.stock,
      images: imageUrls,
      location_lat: null,
      location_lng: null
    })

    alert('Product created successfully 🎉')
    onCancel()
  } catch (err) {
    console.error(err)
    alert('Failed to create product: ' + (err as Error).message)
  }
}

function logout() {
    supabase.auth.signOut().then(() => {
        router.push('/')
    }).catch((err) => {
        console.error('Error logging out:', err)
    })
}
</script>
