export const generateRandomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export const generateRandomGuestName = () => {
  const names = ['Guest', 'Anonymous', 'Someone']
  return names[Math.round((Math.random() * 10) % (names.length - 1))] + '_' + String(Math.trunc(randomRange(10, 99)))
}

export const getRandomExpression = () => {
  const expressions = ['happy', 'lol']
  return expressions[Math.round((Math.random() * 10) % (expressions.length - 1))]
}

export const isTouchableScreen = () => 'ontouchstart' in document.documentElement

export const getHashValue = name => {
  const hashes = new Proxy(new URLSearchParams(window.location.hash.replace('#', '')), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  return decodeURIComponent(hashes[name] || '')
}

export const setHashValue = (name, value) => {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.hash.replace('#', ''))
  value.trim() === '' ? params.delete(name) : params.set(name, encodeURIComponent(value))

  url.hash = '#' + params.toString()
  window.location.href = url
}

export const setStoreValue = (key, value) => window.localStorage.setItem(key, value)

export const getStoreValue = key => window.localStorage.getItem(key)

export const randomRange = (min, max) => Math.random() * (max - min) + min
export const taya = {
  videoUrl:
    'https://cdn-cf-east.streamable.com/video/mp4/ks3tis.mp4?Expires=1708226107815&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ&Signature=YGNAAdPi1zCZD6m9fkgpIk~CHjClUYv0XiqavicJ~nNPZTQu9LMZlnyfImKSjfZFbJdsxLY7flxFJP82BU8LkY9ROl0I69VYMqs6dcdqfz252zLqy-HAu3~EOTtdI4t82VGlXHL2pbyg4k3NR7503OvYH~xIOXB9EOlHFQXRZDPFpxSq3SG7KdLcdWs7qPsSa6uD1brh-l58OKR9QZBYX3JpzBelGCzXyxNFzvDiBxSCJcj4mSrVZwlYYPRIC2Y-~2VLEbFQAPLbQtK3swwGbnbxPK-YoSkTQT6CTWJJZltEsjnqUa~OOArZqEAHuddbLFaJNuXl2bCr5xXH1Fmj-A__',
}
