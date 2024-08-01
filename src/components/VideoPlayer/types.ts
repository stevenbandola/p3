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

export interface IVideoState {
  src: string
  title: string
  status: string
  shortCode: string
  duration: number
  currentTime: number
}

// {
//   status: 'playing',
//   currentTime: getStoreValue('currentTime') ?? 0,
//   media: {
//     src: getStoreValue('src') ?? 0,
//     title: getStoreValue('title') ?? '',
//     duration: Number(getStoreValue('duration')) ?? 0,
//     shortCode: getStoreValue('shortCode') ?? '',
//   },
// }
