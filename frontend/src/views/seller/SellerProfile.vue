<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Seller Profile</h1>
        <p class="text-sm text-gray-500">Manage your store information and contact details.</p>
      </div>
    </div>

    <div class="bg-white rounded shadow border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="col-span-1 flex flex-col items-center gap-4">
        <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border">
          <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">No avatar</div>
        </div>

        <div class="w-full text-center">
          <p class="text-sm text-gray-500">Store</p>
          <p class="font-semibold text-lg">{{ profile.storeName || 'Your Store' }}</p>
        </div>

        <div class="w-full text-center">
          <p class="text-xs text-gray-500">Products</p>
          <p class="font-medium text-xl">{{ productsCount }}</p>
        </div>

        <div class="w-full">
          <label class="block text-xs text-gray-500 mb-1">Change avatar</label>
          <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
          <button @click="openAvatar" class="w-full rounded bg-gray-100 py-2 text-sm">Upload avatar</button>
        </div>
      </div>

      <div class="col-span-2">
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500">Full name</label>
              <input v-model="profile.fullName" class="mt-1 w-full rounded border border-gray-200 px-3 py-2" />
            </div>
            <div>
              <label class="block text-xs text-gray-500">Store name</label>
              <input v-model="profile.storeName" class="mt-1 w-full rounded border border-gray-200 px-3 py-2" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500">Email</label>
              <input v-model="profile.email" type="email" class="mt-1 w-full rounded border border-gray-200 px-3 py-2" />
            </div>
            <div>
              <label class="block text-xs text-gray-500">Phone</label>
              <input v-model="profile.phone" class="mt-1 w-full rounded border border-gray-200 px-3 py-2" />
            </div>
          </div>

          <div>
            <label class="block text-xs text-gray-500">Store description</label>
            <textarea v-model="profile.bio" rows="4" class="mt-1 w-full rounded border border-gray-200 px-3 py-2"></textarea>
          </div>

          <div>
            <label class="block text-xs text-gray-500">Location / Address</label>
            <input v-model="profile.address" class="mt-1 w-full rounded border border-gray-200 px-3 py-2" placeholder="Street, City, Country" />
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <button type="button" @click="loadProfile" class="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-orange-500 text-white">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import supabase from '@/lib/supabase'
import { uploadAvatarImage } from '@/services/storageService'

const avatarInput = ref<HTMLInputElement | null>(null)

const profile = reactive({
  id: '',
  email: '',
  fullName: '',
  storeName: '',
  phone: '',
  bio: '',
  address: '',
  avatarUrl: ''
})

const productsCount = ref(0)
const loading = ref(false)

function openAvatar() {
  avatarInput.value?.click()
}

async function onAvatarChange(e: Event) {
  const t = e.target as HTMLInputElement
  if (!t.files || !t.files[0]) return
  try {
    loading.value = true
    const url = await uploadAvatarImage(t.files[0])
    profile.avatarUrl = url

    // update user metadata immediately
    await supabase.auth.updateUser({ data: { user_metadata: { ...getUserMetadata(), avatar_url: url } } })
    alert('Avatar uploaded')
  } catch (err) {
    console.error(err)
    alert('Failed to upload avatar')
  } finally {
    loading.value = false
  }
}

function getUserMetadata() {
  return {
    fullName: profile.fullName,
    storeName: profile.storeName,
    phone: profile.phone,
    bio: profile.bio,
    address: profile.address,
    avatar_url: profile.avatarUrl,
    role: 'seller'
  }
}

async function loadProfile() {
  try {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    profile.id = user.id
    profile.email = user.email || ''
    const md = (user.user_metadata || {}) as any
    profile.fullName = md.fullName || md.full_name || ''
    profile.storeName = md.storeName || md.store_name || ''
    profile.phone = md.phone || ''
    profile.bio = md.bio || ''
    profile.address = md.address || ''
    profile.avatarUrl = md.avatar_url || ''

    // count products
    const { count, error } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('seller_id', user.id)
    if (!error) productsCount.value = count || 0
  } catch (err) {
    console.error('Load profile failed', err)
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  try {
    loading.value = true
    const metadata = getUserMetadata()
    // include email if it changed
    const { data: { user } } = await supabase.auth.getUser()
    const updatePayload: any = { data: { user_metadata: metadata } }
    if (profile.email && profile.email !== (user?.email || '')) updatePayload.email = profile.email

    const { error } = await supabase.auth.updateUser(updatePayload)
    if (error) throw error
    // Also persist into `profiles` table so admin and other services can read structured data
    try {
      const { data, error: upsertErr } = await supabase.from('profiles').upsert({
        id: profile.id,
        full_name: metadata.fullName,
        store_name: metadata.storeName,
        phone: metadata.phone,
        bio: metadata.bio,
        address: metadata.address,
        avatar_url: metadata.avatar_url,
        role: 'seller'
      })
      if (upsertErr) throw upsertErr
    } catch (dbErr) {
      console.error('Failed to upsert profile row:', dbErr)
      // Non-fatal: notify user but don't fail entirely since auth update succeeded
      alert('Profile updated, but failed to save to profile table: ' + (dbErr?.message || String(dbErr)))
      return
    }

    // reload to pick up any server-side changes (email, metadata)
    await loadProfile()
    alert('Profile updated')
  } catch (err: any) {
    console.error('Save failed', err)
    const msg = err?.message || (err && JSON.stringify(err)) || 'Unknown error'
    alert('Failed to save profile: ' + msg)
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>
