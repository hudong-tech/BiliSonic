import { app } from 'electron'
import { join } from 'path'
import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

interface DownloadRecord {
  id: string
  url: string
  title: string
  bvid: string
  downloadDate: Date
  fileSize: number
  status: string
}

interface ConversionRecord {
  id: string
  downloadId: string
  inputPath: string
  outputPath: string
  format: string
  conversionDate: Date
  status: string
}

interface AppSettings {
  downloadPath: string
  outputPath: string
  defaultFormat: string
  defaultBitrate: number
  defaultSampleRate: number
  defaultChannels: number
  autoCleanupTempFiles: boolean
}

export class DatabaseManager {
  private db: Database | null = null
  private dbPath: string

  constructor() {
    this.dbPath = join(app.getPath('userData'), 'bilisonic.db')
  }

  public async initialize(): Promise<void> {
    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database
    })

    await this.createTables()
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    // 下载记录表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS downloads (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        bvid TEXT NOT NULL,
        download_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_size INTEGER,
        status TEXT NOT NULL
      )
    `)

    // 转换记录表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversions (
        id TEXT PRIMARY KEY,
        download_id TEXT,
        input_path TEXT NOT NULL,
        output_path TEXT NOT NULL,
        format TEXT NOT NULL,
        conversion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL,
        FOREIGN KEY (download_id) REFERENCES downloads(id)
      )
    `)

    // 应用设置表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `)
  }

  // 下载记录相关方法
  public async addDownloadRecord(record: DownloadRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(
      'INSERT INTO downloads (id, url, title, bvid, file_size, status) VALUES (?, ?, ?, ?, ?, ?)',
      [record.id, record.url, record.title, record.bvid, record.fileSize, record.status]
    )
  }

  public async updateDownloadStatus(id: string, status: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(
      'UPDATE downloads SET status = ? WHERE id = ?',
      [status, id]
    )
  }

  public async getDownloadHistory(): Promise<DownloadRecord[]> {
    if (!this.db) throw new Error('Database not initialized')

    return await this.db.all('SELECT * FROM downloads ORDER BY download_date DESC')
  }

  // 转换记录相关方法
  public async addConversionRecord(record: ConversionRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(
      'INSERT INTO conversions (id, download_id, input_path, output_path, format, status) VALUES (?, ?, ?, ?, ?, ?)',
      [record.id, record.downloadId, record.inputPath, record.outputPath, record.format, record.status]
    )
  }

  public async updateConversionStatus(id: string, status: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(
      'UPDATE conversions SET status = ? WHERE id = ?',
      [status, id]
    )
  }

  public async getConversionHistory(): Promise<ConversionRecord[]> {
    if (!this.db) throw new Error('Database not initialized')

    return await this.db.all('SELECT * FROM conversions ORDER BY conversion_date DESC')
  }

  // 应用设置相关方法
  public async getSettings(): Promise<AppSettings> {
    if (!this.db) throw new Error('Database not initialized')

    const rows = await this.db.all('SELECT key, value FROM settings')
    const settings: any = {}

    rows.forEach(row => {
      settings[row.key] = row.value
    })

    return {
      downloadPath: settings.downloadPath || join(app.getPath('userData'), 'downloads'),
      outputPath: settings.outputPath || join(app.getPath('userData'), 'output'),
      defaultFormat: settings.defaultFormat || 'mp3',
      defaultBitrate: parseInt(settings.defaultBitrate) || 320,
      defaultSampleRate: parseInt(settings.defaultSampleRate) || 44100,
      defaultChannels: parseInt(settings.defaultChannels) || 2,
      autoCleanupTempFiles: settings.autoCleanupTempFiles === 'true'
    }
  }

  public async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const entries = Object.entries(settings)
    for (const [key, value] of entries) {
      await this.db.run(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        [key, value.toString()]
      )
    }
  }

  public async close(): Promise<void> {
    if (this.db) {
      await this.db.close()
      this.db = null
    }
  }
}
