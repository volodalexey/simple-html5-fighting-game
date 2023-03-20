import { AnimatedSprite, Container, Graphics, type Texture } from 'pixi.js'
import { logAttackBox } from './logger'
import { type MoveInterface } from './MoveInterface'

export interface IFighterOptions {
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
}

export class Fighter extends Container {
  static ANIMATION = FighterAnimation
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

  public animation = FighterAnimation.idle
  public idle!: AnimatedSprite
  public run!: AnimatedSprite
  public jump!: AnimatedSprite
  public fall!: AnimatedSprite
  public attack!: AnimatedSprite
  public death!: AnimatedSprite
  public spritesBox!: Graphics
  public fighterBox!: Graphics
  public attackBox!: Graphics
  public settings = {
    animationSpeed: 0.2,
    attackBoxColor: 0xff00ff
  }

  public moveInterface!: MoveInterface

  constructor (options: IFighterOptions) {
    super()
    this.box = options.box
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
      deathTexture
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

    this.addChild(spritesContainer)

    const fighterBox = new Graphics()
    this.addChild(fighterBox)
    this.fighterBox = fighterBox

    const attackBox = new Graphics()
    attackBox.position.x = attackOptions.offset.x
    attackBox.position.y = attackOptions.offset.y
    this.addChild(attackBox)
    this.attackBox = attackBox

    this.scale.set(2.5, 2.5)
  }

  draw ({ attackOptions: { width, height } }: IFighterOptions): void {
    this.attackBox.beginFill(this.settings.attackBoxColor)
    this.attackBox.drawRect(0, 0, width, height)
    this.attackBox.endFill()
    this.attackBox.alpha = logAttackBox.enabled ? 0.5 : 0
  }

  stopAllAnimations (): void {
    [this.idle, this.run, this.jump, this.fall, this.attack, this.death].forEach(spr => {
      spr.visible = false
      spr.stop()
    })
  }

  switchAnimation (animation: FighterAnimation): void {
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
        break
      case FighterAnimation.death:
        this.death.play()
        this.death.visible = true
        break
    }
    this.animation = animation
  }
}
