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
