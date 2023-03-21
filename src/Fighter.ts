import { AnimatedSprite, Container, Graphics, type Texture } from 'pixi.js'
import { logAttackBox, logDamage, logFighterBounds, logFighterGravity, logFighterMove } from './logger'

export interface IFighterOptions {
  attackDamage: number
  attackFrame: number
  moveSpeed: number
  jumpSpeed: number
  box: {
    toTop: number
    toRight: number
    toBottom: number
    toLeft: number
  }
  textures: {
    idleTexture: Texture[]
    runTexture: Texture[]
    jumpTexture: Texture[]
    fallTexture: Texture[]
    attackTexture: Texture[]
    deathTexture: Texture[]
    takeHitTexture: Texture[]
  }
  texturesOptions: {
    offset: {
      x: number
      y: number
    }
  }
  attackOptions: {
    offset: {
      x: number
      y: number
    }
    width: number
    height: number
  }
}

export enum FighterAnimation {
  idle = 'idle',
  run = 'run',
  jump = 'jump',
  fall = 'fall',
  attack = 'attack',
  death = 'death',
  takeHit = 'takeHit',
}

export class Fighter extends Container {
  static ANIMATION = FighterAnimation
  public isPressed = false
  public moveSpeed!: number
  public jumpSpeed!: number

  private readonly directionPressed: Record<'top' | 'right' | 'bottom' | 'left', boolean> = {
    top: false,
    right: false,
    bottom: false,
    left: false
  }

  public spritesScale = 2.5
  public box!: {
    toTop: number
    toRight: number
    toBottom: number
    toLeft: number
  }

  public velocity = {
    vx: 0,
    vy: 0
  }

  public attackFrame!: number
  public attackHitAvailable = false
  public attackHitProcessed = false
  public attackDamage!: number

  public health = 100
  public isDead = false
  public animation = FighterAnimation.idle
  public idle!: AnimatedSprite
  public run!: AnimatedSprite
  public jump!: AnimatedSprite
  public fall!: AnimatedSprite
  public attack!: AnimatedSprite
  public death!: AnimatedSprite
  public takeHit!: AnimatedSprite
  public spritesBox!: Graphics
  public fighterBox!: Graphics
  public attackBox!: Graphics
  public settings = {
    animationSpeed: 0.2,
    attackBoxColor: 0xff00ff
  }

  constructor (options: IFighterOptions) {
    super()
    this.attackDamage = options.attackDamage
    this.attackFrame = options.attackFrame
    this.box = options.box
    this.moveSpeed = options.moveSpeed
    this.jumpSpeed = options.jumpSpeed
    this.setup(options)
    this.draw(options)

    this.switchAnimation(FighterAnimation.idle)
  }

  setup ({
    attackOptions,
    textures: {
      idleTexture,
      runTexture,
      jumpTexture,
      fallTexture,
      attackTexture,
      deathTexture,
      takeHitTexture
    }
  }: IFighterOptions): void {
    const { settings } = this
    this.cullable = true
    const spritesBox = new Graphics()
    this.addChild(spritesBox)
    this.spritesBox = spritesBox

    const spritesContainer = new Container()

    const idle = new AnimatedSprite(idleTexture)
    idle.animationSpeed = settings.animationSpeed
    spritesContainer.addChild(idle)
    this.idle = idle

    const run = new AnimatedSprite(runTexture)
    run.animationSpeed = settings.animationSpeed
    spritesContainer.addChild(run)
    this.run = run

    const jump = new AnimatedSprite(jumpTexture)
    jump.animationSpeed = settings.animationSpeed
    spritesContainer.addChild(jump)
    this.jump = jump

    const fall = new AnimatedSprite(fallTexture)
    fall.animationSpeed = settings.animationSpeed
    spritesContainer.addChild(fall)
    this.fall = fall

    const attack = new AnimatedSprite(attackTexture)
    attack.animationSpeed = settings.animationSpeed
    spritesContainer.addChild(attack)
    this.attack = attack

    const death = new AnimatedSprite(deathTexture)
    death.animationSpeed = settings.animationSpeed
    spritesContainer.addChild(death)
    this.death = death

    const takeHit = new AnimatedSprite(takeHitTexture)
    takeHit.animationSpeed = settings.animationSpeed
    spritesContainer.addChild(takeHit)
    this.takeHit = takeHit

    this.addChild(spritesContainer)

    const fighterBox = new Graphics()
    this.addChild(fighterBox)
    this.fighterBox = fighterBox

    const attackBox = new Graphics()
    attackBox.position.x = attackOptions.offset.x
    attackBox.position.y = attackOptions.offset.y
    this.addChild(attackBox)
    this.attackBox = attackBox

    this.scale.set(this.spritesScale, this.spritesScale)
  }

  draw ({ attackOptions: { width, height } }: IFighterOptions): void {
    this.attackBox.beginFill(this.settings.attackBoxColor)
    this.attackBox.drawRect(0, 0, width, height)
    this.attackBox.endFill()
    this.attackBox.alpha = logAttackBox.enabled ? 0.5 : 0
  }

  stopAllAnimations (): void {
    [this.idle, this.run, this.jump, this.fall, this.attack, this.death, this.takeHit].forEach(spr => {
      spr.stop()
    })
  }

  hideAllAnimations (): void {
    [this.idle, this.run, this.jump, this.fall, this.attack, this.death, this.takeHit].forEach(spr => {
      spr.visible = false
    })
  }

  releaseAllPressures (): void {
    this.directionPressed.top = false
    this.directionPressed.right = false
    this.directionPressed.bottom = false
    this.directionPressed.left = false
  }

  setTopDirectionPressed (pressed: boolean): void {
    if (this.isDead) {
      return
    }
    this.directionPressed.top = pressed
  }

  setLeftDirectionPressed (pressed: boolean): void {
    if (this.isDead) {
      return
    }
    this.directionPressed.left = pressed
  }

  setRightDirectionPressed (pressed: boolean): void {
    if (this.isDead) {
      return
    }
    this.directionPressed.right = pressed
  }

  setBottomDirectionPressed (pressed: boolean): void {
    if (this.isDead) {
      return
    }
    this.directionPressed.bottom = pressed
  }

  handleMove (pressed: boolean | undefined, x: number, y: number): void {
    const { directionPressed, isDead } = this
    if (isDead) {
      return
    }
    if (typeof pressed === 'boolean') {
      this.isPressed = pressed
    }

    this.releaseAllPressures()
    if (this.isPressed) {
      const { top, right, bottom, left } = this.toBounds()

      if (x >= right) {
        directionPressed.right = true
      } else if (x <= left) {
        directionPressed.left = true
      }

      if (y >= bottom) {
        directionPressed.bottom = true
      } else if (y <= top) {
        directionPressed.top = true
      }

      if (x < right && x > left && y > top && y < bottom) {
        directionPressed.bottom = true
      }
    }
  }

  isAttacking (): boolean {
    return this.animation === FighterAnimation.attack
  }

  isDying (): boolean {
    return this.animation === FighterAnimation.death
  }

  isTakingHit (): boolean {
    return this.animation === FighterAnimation.takeHit
  }

  switchAnimation (animation: FighterAnimation): void {
    this.hideAllAnimations()
    this.stopAllAnimations()
    switch (animation) {
      case FighterAnimation.idle:
        this.idle.play()
        this.idle.visible = true
        break
      case FighterAnimation.run:
        this.run.play()
        this.run.visible = true
        break
      case FighterAnimation.jump:
        this.jump.play()
        this.jump.visible = true
        break
      case FighterAnimation.fall:
        this.fall.play()
        this.fall.visible = true
        break
      case FighterAnimation.attack:
        this.attack.play()
        this.attack.visible = true
        this.attack.currentFrame = 0
        break
      case FighterAnimation.takeHit:
        this.takeHit.play()
        this.takeHit.visible = true
        this.takeHit.currentFrame = 0
        break
      case FighterAnimation.death:
        this.death.play()
        this.death.visible = true
        break
    }
    this.animation = animation
  }

  toBounds (): {
    top: number
    right: number
    bottom: number
    left: number
  } {
    const midHor = this.x + this.width / 2
    const midVer = this.y + this.height / 2
    return {
      top: midVer - this.box.toTop,
      right: midHor + this.box.toRight,
      bottom: midVer + this.box.toBottom,
      left: midHor - this.box.toLeft
    }
  }

  toAttackBounds (): {
    top: number
    right: number
    bottom: number
    left: number
  } {
    const x = this.x + this.attackBox.x * this.spritesScale
    const y = this.y + this.attackBox.y * this.spritesScale
    return {
      top: y,
      right: x + this.attackBox.width * this.spritesScale,
      bottom: y + this.attackBox.height * this.spritesScale,
      left: x
    }
  }

  updateAnimation (): void {
    if (this.isDying() || this.isDead) {
      if (this.death.currentFrame === this.death.totalFrames - 1) {
        this.death.stop()
        this.isDead = true
      }
    } else if (this.isAttacking()) {
      if (this.attack.currentFrame === this.attackFrame && !this.attackHitProcessed) {
        this.attackHitAvailable = true
      } else if (this.attack.currentFrame === this.attack.totalFrames - 1) {
        this.switchAnimation(Fighter.ANIMATION.idle)
      }
    } else {
      if (this.isTakingHit()) {
        if (this.takeHit.currentFrame === this.takeHit.totalFrames - 1) {
          this.switchAnimation(Fighter.ANIMATION.idle)
        }
        // animate take hit
      } else {
        this.switchAnimation(Fighter.ANIMATION.idle)
      }
      if (this.velocity.vy < 0) {
        this.switchAnimation(Fighter.ANIMATION.jump)
      } else if (this.velocity.vy > 0) {
        this.switchAnimation(Fighter.ANIMATION.fall)
      }
      if (this.velocity.vy === 0 && this.velocity.vx !== 0) {
        this.switchAnimation(Fighter.ANIMATION.run)
      }
    }

    if (!this.isDying() && this.directionPressed.bottom && !this.isAttacking()) {
      this.directionPressed.bottom = false
      this.attackHitAvailable = false
      this.attackHitProcessed = false
      this.switchAnimation(Fighter.ANIMATION.attack)
    }
  }

  update ({
    gravity,
    levelLeft,
    levelRight,
    levelBottom
  }: {
    gravity: number
    levelLeft: number
    levelRight: number
    levelBottom: number
  }): void {
    if (this.isDead) {
      return
    }

    if (this.directionPressed.top && this.velocity.vy === 0) {
      this.velocity.vy = -this.jumpSpeed
    }
    if (this.directionPressed.left) {
      this.velocity.vx = -this.moveSpeed
    } else if (this.directionPressed.right) {
      this.velocity.vx = this.moveSpeed
    } else {
      this.velocity.vx = 0
    }

    const { bottom, left, right } = this.toBounds()
    logFighterBounds(`px=${this.x} py=${this.y} ph=${this.height} to-bot=${this.box.toBottom} bot=${bottom}`)
    if (bottom + this.velocity.vy >= levelBottom) {
      logFighterGravity(`Floor bot=${bottom} vy=${this.velocity.vy} fl=${levelBottom}`)
      this.velocity.vy = 0
      this.position.y = levelBottom - (this.height / 2 + this.box.toBottom)
    } else {
      logFighterGravity(`Gravity bot=${bottom} vy=${this.velocity.vy} fl=${levelBottom}`)
      this.velocity.vy += gravity
      this.position.y += this.velocity.vy
    }

    logFighterMove(`Move left=${left} right=${right} vy=${this.velocity.vx}`)
    if (left + this.velocity.vx < levelLeft) {
      this.velocity.vx = 0
      this.position.x = levelLeft - (this.width / 2 - this.box.toLeft)
    } else if (right + this.velocity.vx > levelRight) {
      this.velocity.vx = 0
      this.position.x = levelRight - (this.width / 2 + this.box.toRight)
    } else {
      this.position.x += this.velocity.vx
    }

    this.updateAnimation()
  }

  takeDamage (damage: number): void {
    logDamage(`health=${this.health} damage=${damage}`)
    this.health -= damage
    logDamage(`health=${this.health}`)
    if (this.health <= 0) {
      this.health = 0
      this.releaseAllPressures()
      this.switchAnimation(FighterAnimation.death)
    } else {
      this.switchAnimation(FighterAnimation.takeHit)
    }
  }
}
