<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Users</h1>
    <div class="bg-white rounded-xl shadow-sm border p-4">
      <div class="flex items-center justify-between mb-4">
        <input v-model="searchQuery" class="border rounded px-3 py-2 w-64" placeholder="Search users..." />
        <button @click="showAddModal = true" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add User</button>
      </div>
      
      <div v-if="loading" class="text-center py-8">Loading...</div>
      <div v-else-if="error" class="text-red-600 py-4">{{ error }}</div>
      
      <table v-else class="w-full text-left">
        <thead>
          <tr class="text-gray-500 text-sm">
            <th class="py-2">Name</th>
            <th class="py-2">Email</th>
            <th class="py-2">Role</th>
            <th class="py-2">Created At</th>
            <th class="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-t">
            <td class="py-2">{{ user.full_name || 'N/A' }}</td>
            <td class="py-2">{{ user.email }}</td>
            <td class="py-2">
              <span class="px-2 py-1 rounded text-xs" :class="getRoleBadgeClass(user.role)">
                {{ user.role }}
              </span>
            </td>
            <td class="py-2">{{ formatDate(user.created_at) }}</td>
            <td class="py-2">
              <button class="text-blue-600 mr-2 hover:underline">View</button>
              <button @click="confirmDelete(user)" class="text-red-600 hover:underline">Remove</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0" class="border-t">
            <td colspan="5" class="py-4 text-center text-gray-500">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Add New User</h2>
        <form @submit.prevent="addUser">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Full Name</label>
            <input v-model="newUser.fullName" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Email</label>
            <input v-model="newUser.email" type="email" class="w-full p-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Password</label>
            <input v-model="newUser.password" type="password" class="w-full p-2 border rounded" required minlength="6" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Role</label>
            <select v-model="newUser.role" class="w-full p-2 border rounded" required>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
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
    // Use the existing api service pattern
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    
    // Direct API URL construction
    const apiUrl = 'http://localhost:3000/api'
    
    const response = await fetch(`${apiUrl}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const data = await response.json()
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
