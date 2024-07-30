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
  // videoUrl:
  //   'https://rr2---sn-nx5s7n7d.c.drive.google.com/videoplayback?expire=1722301199&ei=3xCoZrewF4aZmvUPpoK3iQU&ip=96.51.38.16&id=9d26ff3d879501d7&itag=134&source=webdrive&requiressl=yes&xpc=EghonaK1InoBAQ==&mh=_p&mm=32,26&mn=sn-nx5s7n7d,sn-vgqsrnzr&ms=su,onr&mv=u&mvi=2&pl=23&ttl=transient&susc=dr&driveid=1PhBBpnNi0EgsN9nAJqx65Jz1-iwjiBHB&app=explorer&eaua=_HQ-_CIGMMI&mime=video/mp4&vprv=1&prv=1&gir=yes&clen=84120738&dur=3155.018&lmt=1711737431473931&mt=1722289792&fvip=5&subapp=DRIVE_WEB_FILE_VIEWER&txp=0010224&sparams=expire,ei,ip,id,itag,source,requiressl,xpc,ttl,susc,driveid,app,eaua,mime,vprv,prv,gir,clen,dur,lmt&sig=AJfQdSswRAIgIYWoSl5A6D-Q6lBXWV6SK483thUwcKq2Sh-zSKM1B5QCIEQrblvzkQCdN7-D3QbXtQKfP7JJbiAJnXcjQ-vPKAZ8&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AGtxev0wRgIhAOc2he7vDh5MEU0MhGiR3NFeLx13qw1_iICG7B8fv9olAiEAsitHZPW0fAjZ_G5ZQYYekokGOl0TvrBvzlioHu6eKiI=&alr=yes&cpn=Ym7JREVFoxMZj68F&c=WEB_EMBEDDED_PLAYER&cver=1.20240724.01.00&range=0-148198&rn=1&rbuf=0&pot=IjjiOuI8hJLy2qFdllKAf4EKs1SsSboIsFWDQ4hcjVuhC6BQq3GhXah-s2irf6Vdo12ke8cJph_Rfg==&ump=1&srfvp=1',
}
