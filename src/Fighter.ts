import { AnimatedSprite, Container, type Texture } from 'pixi.js'

interface IFighterOptions {
  position: {
    x: number
    y: number
  }
  sprites: {
    idleTexture: Texture[]
    runTexture: Texture[]
    jumpTexture: Texture[]
    fallTexture: Texture[]
    attackTexture: Texture[]
    deathTexture: Texture[]
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
  public animation = FighterAnimation.idle
  public idle!: AnimatedSprite
  public run!: AnimatedSprite
  public jump!: AnimatedSprite
  public fall!: AnimatedSprite
  public attack!: AnimatedSprite
  public death!: AnimatedSprite
  public animationSpeed = 0.2
  constructor (options: IFighterOptions) {
    super()
    this.setup(options)

    this.position.x = options.position.x
    this.position.y = options.position.y
  }

  setup ({
    sprites: {
      idleTexture,
      runTexture,
      jumpTexture,
      fallTexture,
      attackTexture,
      deathTexture
    }
  }: IFighterOptions): void {
    const { animationSpeed } = this
    const idle = new AnimatedSprite(idleTexture)
    idle.animationSpeed = animationSpeed
    this.addChild(idle)
    this.idle = idle

    const run = new AnimatedSprite(runTexture)
    run.animationSpeed = animationSpeed
    this.addChild(run)
    this.run = run

    const jump = new AnimatedSprite(jumpTexture)
    jump.animationSpeed = animationSpeed
    this.addChild(jump)
    this.jump = jump

    const fall = new AnimatedSprite(fallTexture)
    fall.animationSpeed = animationSpeed
    this.addChild(fall)
    this.fall = fall

    const attack = new AnimatedSprite(attackTexture)
    attack.animationSpeed = animationSpeed
    this.addChild(attack)
    this.attack = attack

    const death = new AnimatedSprite(deathTexture)
    death.animationSpeed = animationSpeed
    this.addChild(death)
    this.death = death
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
