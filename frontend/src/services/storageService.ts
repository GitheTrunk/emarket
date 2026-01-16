import { supabase } from '../lib/supabase'

export const uploadProductImage = async (file: File): Promise<string> => {
  const filePath = `products/${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('product-img')
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage
    .from('product-img')
    .getPublicUrl(filePath)

  return data.publicUrl
}
/**
 * Upload avatar image to Supabase Storage
 * Compresses image to reduce file size
 */
export const uploadAvatarImage = async (file: File): Promise<string> => {
  // Compress image before upload
  const compressedFile = await compressImage(file)
  
  const userId = (await supabase.auth.getUser()).data.user?.id
  if (!userId) throw new Error('User not authenticated')
  
  const filePath = `avatars/${userId}-${Date.now()}`

  const { error } = await supabase.storage
    .from('product-img')
    .upload(filePath, compressedFile)

  if (error) throw error

  const { data } = supabase.storage
    .from('product-img')
    .getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * Compress image to reduce file size
 */
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        
        // Calculate new dimensions (max 500x500)
        let width = img.width
        let height = img.height
        const maxSize = 500
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }))
            } else {
              reject(new Error('Canvas to blob conversion failed'))
            }
          },
          'image/jpeg',
          0.7 // 70% quality
        )
      }
      img.onerror = () => reject(new Error('Image load failed'))
    }
    reader.onerror = () => reject(new Error('File read failed'))
  })
}