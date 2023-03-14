import { type Application } from 'pixi.js'
import { Fighter, FighterAnimation } from './Fighter'
import { FightingScreen } from './FightingScreen'

import { type GameLoader } from './GameLoader'
import { logWorld } from './logger'

export class World {
  public app: Application<HTMLCanvasElement>
  public gameLoader: GameLoader
  public resizeTimeoutId!: NodeJS.Timeout
  public resizeTimeout = 300
  public totalWidth = 1024
  public totalHeight = 576
  public fightingScreen!: FightingScreen
  public timer = 0

  constructor ({ app, gameLoader }: { app: Application, gameLoader: GameLoader }) {
    this.app = app as Application<HTMLCanvasElement>
    this.gameLoader = gameLoader
    this.setup()

    this.resizeHandler()

    if (logWorld.enabled) {
      logWorld('window.world initialized!');
      (window as unknown as any).world = this
    }
  }

  setup (): void {
    this.setupCanvas()
    this.setupEventLesteners()
    this.setupScreens()
  }

  setupCanvas (): void {
    document.body.appendChild(this.app.view)
  }

  setupEventLesteners (): void {
    window.addEventListener('resize', this.resizeDeBounce)
    this.app.ticker.add(this.handleAppTick)
  }

  setupScreens (): void {
    const { gameLoader: { backgroundTexture, spritesheet: { animations } } } = this
    this.fightingScreen = new FightingScreen({
      textures: {
        backgroundTexture,
        shopTexture: animations.Shop
      },
      player1: new Fighter({
        position: {
          x: 100,
          y: 200
        },
        sprites: {
          idleTexture: animations['Mack-Idle'],
          runTexture: animations['Mack-Run'],
          jumpTexture: animations['Mack-Jump'],
          fallTexture: animations['Mack-Fall'],
          attackTexture: animations['Mack-Attack1'],
          deathTexture: animations['Mack-Death']
        }
      }),
      player2: new Fighter({
        position: {
          x: 400,
          y: 200
        },
        sprites: {
          idleTexture: animations['Kenji-Idle'],
          runTexture: animations['Kenji-Run'],
          jumpTexture: animations['Kenji-Jump'],
          fallTexture: animations['Kenji-Fall'],
          attackTexture: animations['Kenji-Attack1'],
          deathTexture: animations['Kenji-Death']
        }
      })
    })
    this.app.stage.addChild(this.fightingScreen)
  }

  resizeDeBounce = (): void => {
    this.cancelScheduledResizeHandler()
    this.scheduleResizeHandler()
  }

  cancelScheduledResizeHandler (): void {
    clearTimeout(this.resizeTimeoutId)
  }

  scheduleResizeHandler (): void {
    this.resizeTimeoutId = setTimeout(() => {
      this.cancelScheduledResizeHandler()
      this.resizeHandler()
    }, this.resizeTimeout)
  }

  resizeHandler = (): void => {
    this.fightingScreen.handleScreenResize({
      viewWidth: this.app.view.width,
      viewHeight: this.app.view.height
    })
  }

  handleAppTick = (): void => {
    this.timer++
    const randomAnimation = Object.values(FighterAnimation)[Math.floor(Math.random() * 6)]
    // this.app.ticker.deltaMS
    if (this.timer % 60 === 0) {
      this.fightingScreen.player1.switchAnimation(randomAnimation)
      this.fightingScreen.player2.switchAnimation(randomAnimation)
    }
  }
}
