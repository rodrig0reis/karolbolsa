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

    // Validação de Magic Bytes (assinatura do arquivo)
    const headerBuffer = await file.slice(0, 12).arrayBuffer()
    const bytes = new Uint8Array(headerBuffer)
    
    const isJPEG = bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
    const isPNG = bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 && bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A
    const isWEBP = bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50

    if (!isJPEG && !isPNG && !isWEBP) {
      throw new Error("Arquivo corrompido ou formato não suportado (assinatura inválida).")
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
