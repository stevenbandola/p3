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
export const VIDEO_PLAYLIST = [
  {
    videoUrl:
      'https://cdn-cf-east.streamable.com/video/mp4/sy7jxp.mp4?Expires=1722711639461&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ&Signature=NuOXtPGOUmScNHFmQhiddRv8FIHynfaQpZfK~QAwDio0H3adeANFxhUyY1BdInnFbG6VPOKGdZL6j5wbHpJ1HmJVOfeHaxVPM1YoxtJeGvjD~rwzVC7arAG7Sd551IlbDmnyYHBNuSMZ84MOW6iVxqbzk0fnx4AIPNezn97HPdp~Fi~U1FI1YLWK-D02yvMFQuFEznGw1OdUi53M1LNh5xc1k3PAyV4KPvD1-Cnqdh~iTRvkcbZ9c788Nhcs2ptaCdNWio37cvw9jJJs-MJEr7sQM4dNKougEEuckG0hp2F98hrNhiNCOfiX-jl6YjD5mbQZP9-TucyEfzVt6sjqNg__',
    resolution: { width: 720, height: 1280 },
  },
  {
    videoUrl:
      'https://cdn-cf-east.streamable.com/video/mp4/ks3tis.mp4?Expires=1708226107815&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ&Signature=YGNAAdPi1zCZD6m9fkgpIk~CHjClUYv0XiqavicJ~nNPZTQu9LMZlnyfImKSjfZFbJdsxLY7flxFJP82BU8LkY9ROl0I69VYMqs6dcdqfz252zLqy-HAu3~EOTtdI4t82VGlXHL2pbyg4k3NR7503OvYH~xIOXB9EOlHFQXRZDPFpxSq3SG7KdLcdWs7qPsSa6uD1brh-l58OKR9QZBYX3JpzBelGCzXyxNFzvDiBxSCJcj4mSrVZwlYYPRIC2Y-~2VLEbFQAPLbQtK3swwGbnbxPK-YoSkTQT6CTWJJZltEsjnqUa~OOArZqEAHuddbLFaJNuXl2bCr5xXH1Fmj-A__',
    resolution: { width: 720, height: 1280 },
  },
  {
    videoUrl:
      'https://cdn-cf-east.streamable.com/video/mp4/xu5lzl.mp4?Expires=1722575589498&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ&Signature=CC0ZH0w6Qzs4L1j1XaM52174dCqxzvB0JyVfpozoUz8ZMHW1QOTlnrzdTm0ebUinysnp9hnUhPUOncLwX797fh~N9GF~mgUW2UpNU5~ZqeLfybJCr~7XEoVd1FNC0xIg8ig-fJPxQE041USYPWFFEiUOXnrfVSdkTZAnGkp5K-2w7UJ10I0Ra99kbqA3FAwUHvzXR5oCt9AENuquXQspsL4IGDA0VAs~P5kaGIcNU5ua8W-zVSn7TVTbXZHUbtls504YHOTzhDGHq44~FXLWd~1mtGw0QBMw6XOuclyJxaJACNQqiroLUi4lZ3YWyNK1vufCFusdoKQQIkA1DESqgg__',
    resolution: { width: 720, height: 1280 },
  },
  // {
  //   videoUrl:
  //     'https://cdn-cf-east.streamable.com/video/mp4/y1suul.mp4?Expires=1722576109788&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ&Signature=l-hiy6ukAvORHDuIyVX~94DKY2Ii~lkz2NVwxod1nBgdgptwj-9WYqMA03A4fCoLRpJn-p5fdoB1uS4GmYKc547oIfPh3eCGd0WTgbk9QwamcTDSEhXSurZsp8mG1FX7bNk3AjekFCxg~UPNcg9G4KnPsKAGKEXLr1oUyTsjDC17rlKRbUqt~sN7XCjjQ-jAK5et368OkgTIKEZr6ZfkOeOeOW1TExh6zAfauteEFIVHN8c-d5ZzQvAccnMYig5xKeMjhqa5KtoDZeXaiWHGQ9VSQJBdEvAfqJewAxGaGB7nraqRY8c2AauGUfQ~oA-Yh5N1wJV4oiT2cJFNeynd5A__',
  //   resolution: { width: 1080, height: 1920 },
  // },
  {
    videoUrl:
      'https://cdn-cf-east.streamable.com/video/mp4/kv1iqd.mp4?Expires=1722576109768&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ&Signature=dcZKdAPXGNVgOtt7FO7bwedDLR3saEy4rLbDP4H9ZnOvWMQZLczaduI03OImfzlbl3bURgYwFlc1x4VOzFNhdo4~-SFlbkHM8NlpvClPzv5z8m2c4dQngIzJ7cdHllad1ARQ6xBJ3D3uUZb~M6T6Xz1zKqUgTLN4isIWByYYoSbfWOpbbjTF-gvKu0eHeDfMN4tWX7HYE1OinAyWymhE3lKKUardypR3xpYv0PZGVPx8Rd61F8lBgG4CqfVf7ji06u1CXpsVfKHcRqGaA825enHjkoN5J0LGH0vcc7vwUxZbDuDsoHLL~aU62hTkyB4LJ75WONz~PqXL0IppR0L~vg__',
    resolution: { width: 720, height: 1280 },
  },
  {
    videoUrl:
      'https://cdn-cf-east.streamable.com/video/mp4/1noafr.mp4?Expires=1722576109773&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ&Signature=Ubn5G-YlwqnsHEtaN52NiXxWWkPj4eo5PaxVMqyE68DzgwylKmpWsEescXQSFKVHu5B5s6fqWOTMVXEmdENWBxEwF3E9tTh35EwkrunsLHIQzuxoBOzzgYRQYlkfNlUxMKxkraPCqDtt7vpHzxTzjAzlg48Sv85LFby5bmIv6rUNpJMHP0p9hmY7VauBWwm7x2Hi4-GE5c4TbsAgyK3aZL0lh6Jq8gtmUtYxfd8tYxFtTiDe86~1CxrwSek6XiJycAyJp5mpIwtTDKvHd8FnK~F2xtbNHLrxq8Wbhdvc2b2hdDi535XbXrYYC4IFW97GhgD3Nzqw2mGZbeKaZzZhcA__',
    resolution: { width: 720, height: 1280 },
  },
  {
    videoUrl:
      'https://cdn-cf-east.streamable.com/video/mp4/p7bysx.mp4?Expires=1722579794616&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ&Signature=ObYtbBWrIHqElZ~6SD8te9J8fN2-8Nr7FFkxC3446Fx~qxPOFIQSJojB2tHbsskG3Y1bQvrMNXDUczRMyYnmltr4g-Ic3S65IKaLVQR-5aLdltn56aqJGy5udUNf7h~fDjn1pTUJNj87OtC2mspM-THL5P0L2uRD6XGnyuCpqmSZAzzhv9W5qIImnpFuaczPZ7IfgmlQtWtMEDCu3G58gSjBHyVkiIKl5-V5PkePFtsktZwPNlspaMR~QJNyTvvm5gYFGmTzyAE2FkDPBWEclH~51FeU9jTtHVNAUcBsgcbhUdXCgvFep5pPsT56G~Ng9z0yENIFF0rdrDgh8Zy-qw__',
    resolution: { width: 720, height: 1280 },
  },

  // videoUrl:
  //   'https://rr2---sn-nx5s7n7d.c.drive.google.com/videoplayback?expire=1722301199&ei=3xCoZrewF4aZmvUPpoK3iQU&ip=96.51.38.16&id=9d26ff3d879501d7&itag=134&source=webdrive&requiressl=yes&xpc=EghonaK1InoBAQ==&mh=_p&mm=32,26&mn=sn-nx5s7n7d,sn-vgqsrnzr&ms=su,onr&mv=u&mvi=2&pl=23&ttl=transient&susc=dr&driveid=1PhBBpnNi0EgsN9nAJqx65Jz1-iwjiBHB&app=explorer&eaua=_HQ-_CIGMMI&mime=video/mp4&vprv=1&prv=1&gir=yes&clen=84120738&dur=3155.018&lmt=1711737431473931&mt=1722289792&fvip=5&subapp=DRIVE_WEB_FILE_VIEWER&txp=0010224&sparams=expire,ei,ip,id,itag,source,requiressl,xpc,ttl,susc,driveid,app,eaua,mime,vprv,prv,gir,clen,dur,lmt&sig=AJfQdSswRAIgIYWoSl5A6D-Q6lBXWV6SK483thUwcKq2Sh-zSKM1B5QCIEQrblvzkQCdN7-D3QbXtQKfP7JJbiAJnXcjQ-vPKAZ8&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AGtxev0wRgIhAOc2he7vDh5MEU0MhGiR3NFeLx13qw1_iICG7B8fv9olAiEAsitHZPW0fAjZ_G5ZQYYekokGOl0TvrBvzlioHu6eKiI=&alr=yes&cpn=Ym7JREVFoxMZj68F&c=WEB_EMBEDDED_PLAYER&cver=1.20240724.01.00&range=0-148198&rn=1&rbuf=0&pot=IjjiOuI8hJLy2qFdllKAf4EKs1SsSboIsFWDQ4hcjVuhC6BQq3GhXah-s2irf6Vdo12ke8cJph_Rfg==&ump=1&srfvp=1',
]
