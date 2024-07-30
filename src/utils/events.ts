const on = (eventType: string, listener: { (event: any): void; (this: Document, ev: any): any }) => {
  document.addEventListener(eventType, listener)
}

const off = (eventType: string, listener: { (event: any): void; (this: Document, ev: any): any; }) => {
  document.removeEventListener(eventType, listener)
}

const once = (eventType: string, listener: (arg0: any) => void) => {
  const handleEventOnce = (event: any) => {
    listener(event)
    off(eventType, handleEventOnce)
  }
  on(eventType, handleEventOnce)
}

const emit = (eventType: string, data: any) => {
  const event = new CustomEvent(eventType, { detail: data })
  document.dispatchEvent(event)
}

export { on, once, off, emit }
