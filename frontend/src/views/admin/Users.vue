<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-500 mt-1">Manage all users in your system</p>
      </div>
      <button 
        @click="showAddModal = true" 
        class="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add User
      </button>
    </div>

    <!-- Main Content Card -->
    <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
      <!-- Search Bar -->
      <div class="p-6 border-b-2 border-gray-100">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            class="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
            placeholder="Search by name, email, or role..." 
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
        <p class="mt-4 text-gray-500 font-medium">Loading users...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-600 font-semibold mb-2">{{ error }}</p>
        <button @click="fetchUsers" class="mt-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
          Try Again
        </button>
      </div>
      
      <!-- Users Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-sm border-b-2 border-gray-100">
              <th class="py-4 px-6 text-left font-semibold">User</th>
              <th class="py-4 px-6 text-left font-semibold">Email</th>
              <th class="py-4 px-6 text-left font-semibold">Role</th>
              <th class="py-4 px-6 text-left font-semibold">Joined</th>
              <th class="py-4 px-6 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {{ (user.full_name || user.email).charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-semibold text-gray-900">{{ user.full_name || 'N/A' }}</span>
                </div>
              </td>
              <td class="py-4 px-6 text-gray-600">{{ user.email }}</td>
              <td class="py-4 px-6">
                <span class="px-3 py-1.5 rounded-full text-xs font-bold" :class="getRoleBadgeClass(user.role)">
                  {{ user.role.toUpperCase() }}
                </span>
              </td>
              <td class="py-4 px-6 text-gray-600 text-sm">{{ formatDate(user.created_at) }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <button class="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm">
                    View
                  </button>
                  <button @click="confirmDelete(user)" class="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm">
                    Remove
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="py-12 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p class="text-gray-500 font-medium">No users found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
        <div class="bg-gradient-to-r from-orange-500 to-pink-500 p-6">
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add New User
          </h2>
        </div>
        
        <form @submit.prevent="addUser" class="p-6 space-y-5">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input 
              v-model="newUser.fullName" 
              type="text" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
              placeholder="John Doe"
              required 
            />
          </div>
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input 
              v-model="newUser.email" 
              type="email" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
              placeholder="john@example.com"
              required 
            />
          </div>
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Password</label>
            <input 
              v-model="newUser.password" 
              type="password" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
              placeholder="••••••••"
              required 
              minlength="6" 
            />
            <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Role</label>
            <select 
              v-model="newUser.role" 
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
              required
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="closeModal" 
              class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="submitting" 
              class="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import supabase from '../../lib/supabase'
import { api } from '../../services/api'

interface Profile {
  id: string
  full_name: string | null
  email: string
  role: 'buyer' | 'seller' | 'admin'
  created_at: string
}

const users = ref<Profile[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const showAddModal = ref(false)
const submitting = ref(false)

const newUser = ref({
  fullName: '',
  email: '',
  password: '',
  role: 'buyer' as 'buyer' | 'seller' | 'admin'
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.full_name?.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  )
})

const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800',
    seller: 'bg-blue-100 text-blue-800',
    buyer: 'bg-green-100 text-green-800'
  }
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await api.get('/admin/users')
    users.value = data
  } catch (err: any) {
    console.error('Error fetching users:', err)
    error.value = err.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const addUser = async () => {
  submitting.value = true
  error.value = ''
  
  try {
    console.log('Creating user...')
    
    // Create auth user with metadata (no profile table)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newUser.value.email,
      password: newUser.value.password,
      options: {
        data: {
          full_name: newUser.value.fullName,
          role: newUser.value.role
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw new Error(`${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('User creation failed')
    }

    console.log('User created successfully:', authData.user.id)

    alert(`User created successfully!\n\nEmail: ${newUser.value.email}\nRole: ${newUser.value.role}\n\nConfirmation email sent.`)
    closeModal()
    await fetchUsers()
  } catch (err: any) {
    console.error('Error creating user:', err)
    error.value = err.message || 'Failed to create user'
    alert(`Error: ${error.value}`)
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  newUser.value = {
    fullName: '',
    email: '',
    password: '',
    role: 'buyer'
  }
}

const confirmDelete = async (user: Profile) => {
  if (!confirm(`Are you sure you want to remove ${user.full_name || user.email}?`)) {
    return
  }
  
  try {
    // Delete profile (auth user will be cascade deleted if set up properly)
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (deleteError) throw deleteError

    alert('User removed successfully')
    await fetchUsers()
  } catch (err: any) {
    console.error('Error deleting user:', err)
    alert(`Error: ${err.message}`)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
