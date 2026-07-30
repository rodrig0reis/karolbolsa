export interface StorageProvider {
  /**
   * Faz o upload de um arquivo e retorna a URL pública.
   * @param file Arquivo a ser feito o upload
   * @param path Caminho/pasta onde o arquivo deve ser salvo (opcional)
   */
  uploadFile(file: File, path?: string): Promise<string>
  
  /**
   * Remove um arquivo do storage.
   * @param fileUrl URL do arquivo a ser removido
   */
  deleteFile(fileUrl: string): Promise<boolean>
}
