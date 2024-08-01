export interface IStreamableVideo {
  status: number
  percent: number
  url: string
  embed_code: string
  message: null
  files: Files
  thumbnail_url: string
  title: string
  source: null
}

export interface Files {
  'mp4': Mp4
  'mp4-mobile': Mp4
  'original': Mp4
}

export interface Mp4 {
  status?: number
  url?: string
  framerate: number
  height: number
  width: number
  bitrate: number
  size: number
  duration: number
}
