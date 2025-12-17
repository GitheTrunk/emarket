<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Users</h1>
    <div class="bg-white rounded-xl shadow-sm border p-4">
      <div class="flex items-center justify-between mb-4">
        <input class="border rounded px-3 py-2 w-64" placeholder="Search users..." />
        <button class="px-4 py-2 bg-blue-600 text-white rounded">Add User</button>
      </div>
      <table class="w-full text-left">
        <thead>
          <tr class="text-gray-500 text-sm">
            <th class="py-2">Name</th>
            <th class="py-2">Email</th>
            <th class="py-2">Role</th>
            <th class="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t">
            <td class="py-2">John Doe</td>
            <td class="py-2">john@example.com</td>
            <td class="py-2">Seller</td>
            <td class="py-2">
              <button class="text-blue-600 mr-2">View</button>
              <button class="text-red-600">Remove</button>
            </td>
          </tr>
          <tr class="border-t">
            <td class="py-2">Jane Smith</td>
            <td class="py-2">jane@example.com</td>
            <td class="py-2">Buyer</td>
            <td class="py-2">
              <button class="text-blue-600 mr-2">View</button>
              <button class="text-red-600">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
