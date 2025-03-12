export interface IElectronAPI {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => void
    on: (channel: string, func: (...args: any[]) => void) => void
    once: (channel: string, func: (...args: any[]) => void) => void
    invoke: (channel: string, ...args: any[]) => Promise<any>
    removeAllListeners: (channel: string) => void
  }
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
