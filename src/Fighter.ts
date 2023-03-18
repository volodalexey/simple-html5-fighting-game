import { AnimatedSprite, Container, Graphics, type Texture } from 'pixi.js'
import { logAttackBox, logFighterBox } from './logger'
import { type MoveInterface } from './MoveInterface'

export interface IFighterOptions {
  width: number
  height: number
  position: {
    x: number
    y: number
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
  public animation = FighterAnimation.idle
  public idle!: AnimatedSprite
  public run!: AnimatedSprite
  public jump!: AnimatedSprite
  public fall!: AnimatedSprite
  public attack!: AnimatedSprite
  public death!: AnimatedSprite
  public fighterBox!: Graphics
  public attackBox!: Graphics
  public settings = {
    animationSpeed: 0.2,
    fighterBoxColor: 0x00ffff,
    attackBoxColor: 0xff00ff
  }

  public moveInterface!: MoveInterface

  constructor (options: IFighterOptions) {
    super()
    this.setup(options)
    this.draw(options)
  }

  setup ({
    width,
    height,
    position,
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
    this.x = position.x
    this.y = position.y
    this.cullable = true
    this.width = 100
    this.height = 100
    const fighterBox = new Graphics()
    this.addChild(fighterBox)
    this.fighterBox = fighterBox

    const spritesContainer = new Container()
    console.log(spritesContainer)

    // const idle = new AnimatedSprite(idleTexture)
    // idle.animationSpeed = settings.animationSpeed
    // spritesContainer.addChild(idle)
    // this.idle = idle

    // const run = new AnimatedSprite(runTexture)
    // run.animationSpeed = settings.animationSpeed
    // spritesContainer.addChild(run)
    // this.run = run

    // const jump = new AnimatedSprite(jumpTexture)
    // jump.animationSpeed = settings.animationSpeed
    // spritesContainer.addChild(jump)
    // this.jump = jump

    // const fall = new AnimatedSprite(fallTexture)
    // fall.animationSpeed = settings.animationSpeed
    // spritesContainer.addChild(fall)
    // this.fall = fall

    const attack = new AnimatedSprite(attackTexture)
    attack.animationSpeed = settings.animationSpeed
    spritesContainer.addChild(attack)
    this.attack = attack

    // const death = new AnimatedSprite(deathTexture)
    // death.animationSpeed = settings.animationSpeed
    // spritesContainer.addChild(death)
    // this.death = death

    this.addChild(spritesContainer)

    /*
    var texture = PIXI.Texture.fromImage('sprite.png');
    var sprite = new PIXI.Sprite(texture);
    var texture2 = new PIXI.Texture(texture, new PIXI.Rectangle(10, 10, 50, 50));
    sprite.setTexture(texture2);
    */

    // spritesContainer.position.x = offset.x
    // spritesContainer.position.y = offset.y

    // const attackBox = new Graphics()
    // attackBox.position.x = attackOptions.offset.x
    // attackBox.position.y = attackOptions.offset.y
    // this.addChild(attackBox)
    // this.attackBox = attackBox
  }

  draw ({ attackOptions: { width, height } }: IFighterOptions): void {
    this.fighterBox.beginFill(this.settings.fighterBoxColor)
    this.fighterBox.drawRect(0, 0, this.width, this.height)
    this.fighterBox.endFill()
    this.fighterBox.alpha = logFighterBox.enabled ? 0.5 : 0

    // this.attackBox.beginFill(this.settings.attackBoxColor)
    // this.attackBox.drawRect(0, 0, width, height)
    // this.attackBox.endFill()
    // this.attackBox.alpha = logAttackBox.enabled ? 0.5 : 0
  }

  stopAllAnimations (): void {
    [this.idle, this.run, this.jump, this.fall, this.attack, this.death].forEach(spr => {
      spr.visible = false
      spr.stop()
    })
  }

  switchAnimation (animation: FighterAnimation): void {
    // this.stopAllAnimations()
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
