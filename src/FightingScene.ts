import { AnimatedSprite, Container, Graphics, Sprite, type Texture, Text } from 'pixi.js'
import { Fighter, type IFighterOptions } from './Fighter'
import { logLayout } from './logger'
import { MoveInterface } from './MoveInterface'
import { type IScene } from './SceneManager'

interface IFightingSceneOptions {
  viewWidth: number
  viewHeight: number
  textures: {
    backgroundTexture: Texture
    shopTexture: Texture[]
  }
  player1Textures: IFighterOptions['textures']
  player2Textures: IFighterOptions['textures']
}

export class FightingScene extends Container implements IScene {
  public background!: Sprite
  public shop!: AnimatedSprite
  public overlay!: Graphics
  public backgroundSettings = {
    alpha: 0.65
  }

  public shopSettings = {
    animationSpeed: 0.1,
    scale: 2.5,
    x: 600,
    y: 160
  }

  public overlaySettings = {
    color: 0xffffff,
    alpha: 0.15
  }

  public player1!: Fighter
  public player2!: Fighter
  public moveInterface1!: MoveInterface
  public moveInterface2!: MoveInterface

  constructor (options: IFightingSceneOptions) {
    super()
    this.setup(options)
    this.draw(options)
    this.setupFighters()
  }

  setup ({ viewWidth, viewHeight, player1Textures, player2Textures, textures: { backgroundTexture, shopTexture } }: IFightingSceneOptions): void {
    this.player1 = new Fighter({
      width: 67,
      height: 77,
      position: {
        x: 0,
        y: 205
      },
      textures: player1Textures,
      texturesOptions: {
        offset: {
          x: 16,
          y: 67
        }
      },
      attackOptions: {
        offset: {
          x: 125,
          y: 53
        },
        width: 65,
        height: 66
      }
    })

    this.player2 = new Fighter({
      width: 67,
      height: 77,
      position: {
        x: 500,
        y: 192
      },
      textures: player2Textures,
      texturesOptions: {
        offset: {
          x: 16,
          y: 67
        }
      },
      attackOptions: {
        offset: {
          x: 16,
          y: 67
        },
        width: 55,
        height: 60
      }
    })

    const { backgroundSettings, shopSettings, player1, player2 } = this
    const background = new Sprite(backgroundTexture)
    background.alpha = backgroundSettings.alpha
    this.addChild(background)
    this.background = background

    const shop = new AnimatedSprite(shopTexture)
    shop.animationSpeed = shopSettings.animationSpeed
    shop.play()
    shop.scale.set(shopSettings.scale)
    shop.position.x = shopSettings.x
    shop.position.y = shopSettings.y
    this.addChild(shop)
    this.shop = shop

    const overlay = new Graphics()
    this.addChild(overlay)
    this.overlay = overlay

    const moveInterface1 = new MoveInterface({
      viewWidth,
      viewHeight,
      playerWidth: player1.width,
      playerHeight: player1.height
    })
    this.addChild(moveInterface1)
    this.moveInterface1 = moveInterface1

    const moveInterface2 = new MoveInterface({
      viewWidth,
      viewHeight,
      playerWidth: player2.width,
      playerHeight: player2.height
    })
    this.addChild(moveInterface2)
    this.moveInterface2 = moveInterface2

    this.addChild(new Text('hoho', {
      fontFamily: 'Press Start 2P',
      fontSize: 40
    }))
  }

  draw ({ viewWidth, viewHeight }: IFightingSceneOptions): void {
    this.overlay.beginFill(this.overlaySettings.color)
    this.overlay.drawRect(0, 0, this.background.width, this.background.height)
    this.overlay.endFill()
    this.overlay.alpha = this.overlaySettings.alpha
  }

  setupFighters (): void {
    this.addChild(this.player1)
    this.addChild(this.player2)
  }

  handleResize ({ viewWidth, viewHeight }: { viewWidth: number, viewHeight: number }): void {
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

  handleUpdate (): void {
    // const randomAnimation = Object.values(FighterAnimation)[Math.floor(Math.random() * 6)]
    // // this.app.ticker.deltaMS
    // if (this.timer % 60 === 0) {
    //   this.fightingScreen.player1.switchAnimation(randomAnimation)
    //   this.fightingScreen.player2.switchAnimation(randomAnimation)
    // }
    // this.fightingScreen.player1.switchAnimation(FighterAnimation.attack)

    this.player1.attack.stop()
    this.player1.attack.currentFrame = 4
    // this.fightingScreen.player2.switchAnimation(FighterAnimation.attack)
    this.player2.attack.stop()
    this.player2.attack.currentFrame = 1
  }
}
