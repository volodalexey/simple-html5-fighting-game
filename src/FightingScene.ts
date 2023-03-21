import { AnimatedSprite, Container, type FederatedPointerEvent, Graphics, Sprite, type Texture } from 'pixi.js'
import { StatusBar } from './StatusBar'
import { Fighter, type IFighterOptions } from './Fighter'
import { logDamage, logKeydown, logKeyup, logLayout, logPointerEvent } from './logger'
import { type IScene } from './SceneManager'
import { Collision } from './Collision'

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

  public statusBar!: StatusBar

  constructor (options: IFightingSceneOptions) {
    super()
    this.setup(options)
    this.draw(options)
    this.setupFighters()
    this.addEventLesteners()
  }

  setup ({ viewWidth, viewHeight, player1Textures, player2Textures, textures: { backgroundTexture, shopTexture } }: IFightingSceneOptions): void {
    this.player1 = new Fighter({
      attackDamage: 25,
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
      attackDamage: 12,
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

    const { shopSettings } = this
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

    const statusBar = new StatusBar({})
    this.addChild(statusBar)
    this.statusBar = statusBar
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

  handleUpdate (deltaMS: number): void {
    this.statusBar.update(deltaMS);
    [this.player1, this.player2].forEach(player => {
      player.update({
        gravity: this.gravity,
        levelLeft: 0,
        levelRight: this.background.width,
        levelBottom: this.floorY
      })
    })

    if (this.player1.attackHitAvailable && !this.player1.attackHitProcessed) {
      this.player1.attackHitProcessed = true
      const p1AttackBounds = this.player1.toAttackBounds()
      const p2Bounds = this.player2.toBounds()
      const intersectionSquare = Collision.checkCollision(p1AttackBounds, p2Bounds)
      logDamage(`inter=${intersectionSquare}`)
      if (intersectionSquare >= 0.05) {
        this.player2.takeDamage(Math.round(intersectionSquare * this.player1.attackDamage))
        this.statusBar.updatePlayer2Health(this.player2.health)
      }
    }

    if (this.player2.attackHitAvailable && !this.player2.attackHitProcessed) {
      this.player2.attackHitProcessed = true
      const p2AttackBounds = this.player2.toAttackBounds()
      const p1Bounds = this.player1.toBounds()
      const intersectionSquare = Collision.checkCollision(p2AttackBounds, p1Bounds)
      logDamage(`inter=${intersectionSquare}`)
      if (intersectionSquare >= 0.05) {
        this.player1.takeDamage(Math.round(intersectionSquare * this.player2.attackDamage))
        this.statusBar.updatePlayer1Health(this.player1.health)
      }
    }

    this.checkEndFight()
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

  addEventLesteners (): void {
    this.background.interactive = true
    this.on('mousedown', this.handlePlayer1StartMove)
    this.on('mousemove', this.handlePlayer1KeepMove)
    this.on('mouseup', this.handlePlayer1StopMove)
    this.on('touchstart', this.handlePlayer2StartMove)
    this.on('touchmove', this.handlePlayer2KeepMove)
    this.on('touchend', this.handlePlayer2StopMove)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  removeEventListeners (): void {
    this.background.interactive = false
    this.off('mousedown', this.handlePlayer1StartMove)
    this.off('mousemove', this.handlePlayer1KeepMove)
    this.off('mouseup', this.handlePlayer1StopMove)
    this.off('touchstart', this.handlePlayer2StartMove)
    this.off('touchmove', this.handlePlayer2KeepMove)
    this.off('touchend', this.handlePlayer2StopMove)
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  handlePlayer1Move (player: Fighter, pressed: boolean | undefined, e: FederatedPointerEvent): void {
    const point = this.background.toLocal(e.global)
    logPointerEvent(`${e.type} px=${point.x} py=${point.y}`)
    player.handleMove(pressed, point.x, point.y)
  }

  handlePlayer1StartMove = (e: FederatedPointerEvent): void => {
    this.handlePlayer1Move(this.player1, true, e)
  }

  handlePlayer1KeepMove = (e: FederatedPointerEvent): void => {
    this.handlePlayer1Move(this.player1, undefined, e)
  }

  handlePlayer1StopMove = (e: FederatedPointerEvent): void => {
    this.handlePlayer1Move(this.player1, false, e)
  }

  handlePlayer2StartMove = (e: FederatedPointerEvent): void => {
    this.handlePlayer1Move(this.player2, true, e)
  }

  handlePlayer2KeepMove = (e: FederatedPointerEvent): void => {
    this.handlePlayer1Move(this.player2, undefined, e)
  }

  handlePlayer2StopMove = (e: FederatedPointerEvent): void => {
    this.handlePlayer1Move(this.player2, false, e)
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
        player1.directionPressed.bottom = true
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
        player2.directionPressed.bottom = true
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

  checkEndFight (): void {
    if (this.player1.isDying() || this.player2.isDying()) {
      console.log('END')
    }
  }
}
