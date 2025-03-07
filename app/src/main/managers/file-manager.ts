import { app } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'

export class FileManager {
  private appDataPath: string
  private downloadPath: string
  private tempPath: string
  private outputPath: string

  constructor() {
    this.appDataPath = app.getPath('userData')
    this.downloadPath = join(this.appDataPath, 'downloads')
    this.tempPath = join(this.appDataPath, 'temp')
    this.outputPath = join(this.appDataPath, 'output')

    this.initializePaths()
  }

  private async initializePaths(): Promise<void> {
    await this.ensureDirectoryExists(this.downloadPath)
    await this.ensureDirectoryExists(this.tempPath)
    await this.ensureDirectoryExists(this.outputPath)
  }

  private async ensureDirectoryExists(path: string): Promise<void> {
    try {
      await fs.access(path)
    } catch {
      await fs.mkdir(path, { recursive: true })
    }
  }

  public async createTempFile(prefix: string, extension: string): Promise<string> {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${prefix}-${timestamp}-${randomStr}.${extension}`
    return join(this.tempPath, filename)
  }

  public async cleanupTempFiles(): Promise<void> {
    const files = await fs.readdir(this.tempPath)
    const oneHourAgo = Date.now() - 3600000 // 1 hour in milliseconds

    for (const file of files) {
      const filePath = join(this.tempPath, file)
      const stats = await fs.stat(filePath)

      if (stats.mtimeMs < oneHourAgo) {
        await fs.unlink(filePath)
      }
    }
  }

  public getDownloadPath(): string {
    return this.downloadPath
  }

  public getOutputPath(): string {
    return this.outputPath
  }

  public getTempPath(): string {
    return this.tempPath
  }

  public async setCustomDownloadPath(path: string): Promise<void> {
    await this.ensureDirectoryExists(path)
    this.downloadPath = path
  }

  public async setCustomOutputPath(path: string): Promise<void> {
    await this.ensureDirectoryExists(path)
    this.outputPath = path
  }

  public async deleteFile(path: string): Promise<void> {
    try {
      await fs.unlink(path)
    } catch (error) {
      console.error(`Failed to delete file: ${path}`, error)
      throw error
    }
  }

  public async moveFile(sourcePath: string, targetPath: string): Promise<void> {
    try {
      await fs.rename(sourcePath, targetPath)
    } catch (error) {
      console.error(`Failed to move file from ${sourcePath} to ${targetPath}`, error)
      throw error
    }
  }
}
