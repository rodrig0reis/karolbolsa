import { StorageProvider } from "./storage-provider"
import { writeFile, unlink, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export class LocalStorageProvider implements StorageProvider {
  private readonly basePath = process.cwd()
  private readonly publicDir = "public"
  private readonly uploadDir = "uploads"

  async uploadFile(file: File, pathFolder: string = ""): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const folderPath = join(this.basePath, this.publicDir, this.uploadDir, pathFolder)
    
    // Create directory if it doesn't exist
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true })
    }

    // Generate unique filename and sanitize
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${uniqueSuffix}-${originalName}`
    
    const filePath = join(folderPath, fileName)

    // Write file
    await writeFile(filePath, buffer)

    // Return public URL (Next.js automatically serves everything inside public folder at root /)
    const publicUrlPath = `/${this.uploadDir}/${pathFolder ? `${pathFolder}/` : ""}${fileName}`
    return publicUrlPath.replace(/\/+/g, "/") // ensure single slashes
  }

  async uploadProductImage(file: File): Promise<string> {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Formato inválido. Apenas JPEG, PNG ou WEBP são permitidos.")
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Arquivo muito grande. O limite é 5MB.")
    }

    return this.uploadFile(file, "products")
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (fileUrl.includes("..")) {
        throw new Error("Path traversal detectado")
      }

      // fileUrl is something like /uploads/products/123-image.jpg
      const filePath = join(this.basePath, this.publicDir, fileUrl)
      
      const normalizedPath = filePath.replace(/\\/g, "/")
      const expectedDir = join(this.basePath, this.publicDir, this.uploadDir).replace(/\\/g, "/")
      
      if (!normalizedPath.startsWith(expectedDir)) {
         throw new Error("Acesso negado. Caminho fora do diretório de uploads.")
      }
      
      if (existsSync(filePath)) {
        await unlink(filePath)
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting file from LocalStorage:", error)
      return false
    }
  }

  async deleteProductImage(fileUrl: string): Promise<boolean> {
    return this.deleteFile(fileUrl)
  }
}
