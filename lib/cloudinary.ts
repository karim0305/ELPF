/**
 * Cloudinary Upload Utility
 * 
 * This utility provides functions for uploading images to Cloudinary
 * Requires the following environment variables:
 * - NEXT_PUBLIC_CLOUDINARY_NAME: Your Cloudinary cloud name
 * - NEXT_PUBLIC_CLOUDINARY_PRESET: Your unsigned upload preset
 */

export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "")
    formData.append("folder", "elp-super-admin")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Upload failed")
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  if (file.size > maxSize) {
    return { valid: false, error: "Image must be less than 5MB" }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPG, PNG, WebP and GIF are allowed" }
  }

  return { valid: true }
}
