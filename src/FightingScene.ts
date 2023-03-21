import { AnimatedSprite, Container, Graphics, Sprite, type Texture, Text } from 'pixi.js'
import { Fighter, type IFighterOptions } from './Fighter'
import { logFighterBounds, logFighterGravity, logFighterMove, logKeydown, logKeyup, logLayout, logPointerEvent } from './logger'
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
  public gravity = 0.7
  public floorY = 480
  public background!: Sprite
  public shop!: AnimatedSprite
  public overlay!: Graphics

  public shopSettings = {
    animationSpeed: 0.1,
    scale: 2.75,
    x: 600,
    y: 128
  }

  public overlaySettings = {
    color: 0xffffff,
    alpha: 0.15
  }

  public player1!: Fighter
  public player1Options = {
    initialPosition: {
      x: 10,
      y: -100
    }
  }

  public player2!: Fighter
  public player2Options = {
    initialPosition: {
      x: 400,
      y: -123
    }
  }

  public moveInterface1!: MoveInterface
  public moveInterface2!: MoveInterface

  constructor (options: IFightingSceneOptions) {
    super()
    this.setup(options)
    this.draw(options)
    this.setupFighters()
    this.setupEventLesteners()
  }

  setup ({ viewWidth, viewHeight, player1Textures, player2Textures, textures: { backgroundTexture, shopTexture } }: IFightingSceneOptions): void {
    this.player1 = new Fighter({
      attackFrame: 4,
      moveSpeed: 5,
      jumpSpeed: 20,
      box: {
        toTop: 70,
        toRight: 30,
        toBottom: 55,
        toLeft: 30
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
      attackFrame: 2,
      moveSpeed: 6,
      jumpSpeed: 22,
      box: {
        toTop: 70,
        toRight: 17,
        toBottom: 70,
        toLeft: 27
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

    const { shopSettings, player1, player2 } = this
    const background = new Sprite(backgroundTexture)
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

  draw (_: IFightingSceneOptions): void {
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
    [this.player1, this.player2].forEach(player => {
      if (player.directionPressed.top && player.velocity.vy === 0) {
        player.velocity.vy = -player.jumpSpeed
      }
      if (player.directionPressed.left) {
        player.velocity.vx = -player.moveSpeed
      } else if (player.directionPressed.right) {
        player.velocity.vx = player.moveSpeed
      } else {
        player.velocity.vx = 0
      }

      const { bottom, left, right } = player.toBounds()
      logFighterBounds(`px=${player.x} py=${player.y} ph=${player.height} to-bot=${player.box.toBottom} bot=${bottom}`)
      if (bottom + player.velocity.vy >= this.floorY) {
        logFighterGravity(`Floor bot=${bottom} vy=${player.velocity.vy} fl=${this.floorY}`)
        player.velocity.vy = 0
        player.position.y = this.floorY - (player.height / 2 + player.box.toBottom)
      } else {
        logFighterGravity(`Gravity bot=${bottom} vy=${player.velocity.vy} fl=${this.floorY}`)
        player.velocity.vy += this.gravity
        player.position.y += player.velocity.vy
      }

      logFighterMove(`Move left=${left} right=${right} vy=${player.velocity.vx}`)
      if (left + player.velocity.vx < 0) {
        player.velocity.vx = 0
        player.position.x = 0 - (player.width / 2 - player.box.toLeft)
      } else if (right + player.velocity.vx > this.background.width) {
        player.velocity.vx = 0
        player.position.x = this.background.width - (player.width / 2 + player.box.toRight)
      } else {
        player.position.x += player.velocity.vx
      }

      player.updateAnimation()
    })
  }

  handleMounted (): void {
    Promise.resolve().then(() => {
      this.startFighters()
    }).catch(console.error)
  }

  startFighters (): void {
    const { player1, player1Options, player2, player2Options } = this
    player1.position = player1Options.initialPosition
    player2.position = player2Options.initialPosition
  }

  setupEventLesteners (): void {
    this.background.interactive = true
    this.on('mousedown', (e) => {
      const point = this.background.toLocal(e.global)
      logPointerEvent(`${e.type} px=${point.x} py=${point.y}`)
      this.player1.handleMove(true, point.x, point.y)
    })
    this.on('mousemove', (e) => {
      const point = this.background.toLocal(e.global)
      logPointerEvent(`${e.type} px=${point.x} py=${point.y}`)
      this.player1.handleMove(undefined, point.x, point.y)
    })
    this.on('mouseup', (e) => {
      const point = this.background.toLocal(e.global)
      logPointerEvent(`${e.type} px=${point.x} py=${point.y}`)
      this.player1.handleMove(false, point.x, point.y)
    })
    this.on('touchstart', (e) => {
      const point = this.background.toLocal(e.global)
      logPointerEvent(`${e.type} px=${point.x} py=${point.y}`)
      this.player2.handleMove(true, point.x, point.y)
    })
    this.on('touchmove', (e) => {
      const point = this.background.toLocal(e.global)
      logPointerEvent(`${e.type} px=${point.x} py=${point.y}`)
      this.player2.handleMove(undefined, point.x, point.y)
    })
    this.on('touchend', (e) => {
      const point = this.background.toLocal(e.global)
      logPointerEvent(`${e.type} px=${point.x} py=${point.y}`)
      this.player2.handleMove(false, point.x, point.y)
    })
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  handleKeyDown = (e: KeyboardEvent): void => {
    const { player1, player2 } = this
    logKeydown(`${e.code} ${e.key}`)
    switch (e.code) {
      case 'KeyW':
        player1.directionPressed.top = true
        break
      case 'KeyA':
        player1.directionPressed.left = true
        break
      case 'KeyS': case 'Space': case 'ShiftLeft':
        player1.attackStarted = true
        break
      case 'KeyD':
        player1.directionPressed.right = true
        break
    }
    switch (e.code) {
      case 'ArrowUp':
        player2.directionPressed.top = true
        break
      case 'ArrowLeft':
        player2.directionPressed.left = true
        break
      case 'ArrowDown': case 'Numpad0': case 'ShiftRight':
        player2.attackStarted = true
        break
      case 'ArrowRight':
        player2.directionPressed.right = true
        break
    }
  }

  handleKeyUp = (e: KeyboardEvent): void => {
    const { player1, player2 } = this
    logKeyup(`${e.code} ${e.key}`)
    switch (e.code) {
      case 'KeyW':
        player1.directionPressed.top = false
        break
      case 'KeyA':
        player1.directionPressed.left = false
        break
      case 'KeyS':
        player1.directionPressed.bottom = false
        break
      case 'KeyD':
        player1.directionPressed.right = false
        break
    }
    switch (e.code) {
      case 'ArrowUp':
        player2.directionPressed.top = false
        break
      case 'ArrowLeft':
        player2.directionPressed.left = false
        break
      case 'ArrowDown':
        player2.directionPressed.bottom = false
        break
      case 'ArrowRight':
        player2.directionPressed.right = false
        break
    }
  }
}
