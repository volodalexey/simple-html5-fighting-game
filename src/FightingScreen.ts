import { AnimatedSprite, Container, Sprite, type Texture } from 'pixi.js'
import { type Fighter } from './Fighter'
import { logLayout } from './logger'

interface IFightingScreenOptions {
  textures: {
    backgroundTexture: Texture
    shopTexture: Texture[]
  }
  player1: Fighter
  player2: Fighter
}

export class FightingScreen extends Container {
  public background!: Sprite
  public shop!: AnimatedSprite
  public backgroundSettings = {
    alpha: 0.65
  }

  public shopSettings = {
    animationSpeed: 0.2,
    alpha: 0.65,
    width: 324.5,
    height: 352,
    x: 600,
    y: 128
  }

  public player1!: Fighter
  public player2!: Fighter

  constructor (options: IFightingScreenOptions) {
    super()
    this.setup(options)
    this.addFighters(options)
  }

  setup ({ textures: { backgroundTexture, shopTexture } }: IFightingScreenOptions): void {
    const { backgroundSettings, shopSettings } = this
    const background = new Sprite(backgroundTexture)
    background.alpha = backgroundSettings.alpha
    this.addChild(background)
    this.background = background

    const shop = new AnimatedSprite(shopTexture)
    shop.animationSpeed = shopSettings.animationSpeed
    shop.play()
    shop.alpha = shopSettings.alpha
    shop.width = shopSettings.width
    shop.height = shopSettings.height
    shop.position.x = shopSettings.x
    shop.position.y = shopSettings.y
    this.addChild(shop)
    this.shop = shop
  }

  addFighters ({ player1, player2 }: IFightingScreenOptions): void {
    this.player1 = player1
    this.addChild(player1)
    this.player2 = player2
    this.addChild(player2)
  }

  handleScreenResize ({ viewWidth, viewHeight }: { viewWidth: number, viewHeight: number }): void {
    const availableWidth = viewWidth
    const availableHeight = viewHeight
    const totalWidth = this.background.width
    const totalHeight = this.background.height
    let scale = 1
    if (totalHeight >= totalWidth) {
      scale = availableHeight / totalHeight
      if (scale * totalWidth > availableWidth) {
        scale = availableWidth / totalWidth
      }
      logLayout(`By height (sc=${scale})`)
    } else {
      scale = availableWidth / totalWidth
      logLayout(`By width (sc=${scale})`)
      if (scale * totalHeight > availableHeight) {
        scale = availableHeight / totalHeight
      }
    }
    const occupiedWidth = Math.floor(totalWidth * scale)
    const occupiedHeight = Math.floor(totalHeight * scale)
    const x = availableWidth > occupiedWidth ? (availableWidth - occupiedWidth) / 2 : 0
    const y = availableHeight > occupiedHeight ? (availableHeight - occupiedHeight) / 2 : 0
    logLayout(`aw=${availableWidth} (ow=${occupiedWidth}) x=${x} ah=${availableHeight} (oh=${occupiedHeight}) y=${y}`)
    this.x = x
    this.width = occupiedWidth
    this.y = y
    this.height = occupiedHeight
    logLayout(`x=${x} y=${y} w=${this.width} h=${this.height}`)
  }
}
