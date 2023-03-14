import { Assets, type Spritesheet, Texture } from 'pixi.js'

type ImgTexture = Texture

export class GameLoader {
  loader: typeof Assets
  spritesheet!: Spritesheet
  backgroundTexture!: ImgTexture
  constructor () {
    this.loader = Assets
  }

  async loadAll (): Promise<void> {
    await this.loadResources()
    await this.loadImages()
  }

  async loadResources (): Promise<void> {
    this.loader.add('tileset', 'assets/spritesheets/spritesheet.json')
    this.spritesheet = await this.loader.load('tileset')
  }

  async loadImage (url: string): Promise<Texture> {
    const res = await fetch(url)
    const imageBlob = await res.blob()
    const blobURL = URL.createObjectURL(imageBlob)
    return await Texture.fromURL(blobURL)
  }

  async loadImages (): Promise<void> {
    const backgroundTexture = await this.loadImage('assets/images/background.png')
    this.backgroundTexture = backgroundTexture
  }
}
