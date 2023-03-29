import { Container, Graphics, Text } from 'pixi.js'
import gsap from 'gsap'

import { HealthBar } from './HealthBar'

interface IStatusBarOptions {
  boxWidth?: number
}

export class StatusBar extends Container {
  public barOptions = {
    padding: 20,
    healthPadding: 6,
    healthWidth: 442
  }

  public maxTime = 90 * 1000
  public time!: number
  public timerBox!: Graphics
  public timerBoxOptions = {
    textSize: 16,
    text: 0xffffff,
    fill: 0x000000,
    border: 0xffffff,
    borderThick: 4,
    width: 100,
    height: 50
  }

  public timerText!: Text
  public player1HealthBar!: HealthBar
  public player2HealthBar!: HealthBar

  constructor (options: IStatusBarOptions) {
    super()
    this.setup(options)
    this.draw(options)
    this.time = this.maxTime
  }

  setup (_: IStatusBarOptions): void {
    const { barOptions, timerBoxOptions } = this
    this.timerBox = new Graphics()
    this.addChild(this.timerBox)

    const timerText = new Text(String(Math.round(this.time / 1000)), {
      fontFamily: 'Press Start _2P',
      fontSize: this.timerBoxOptions.textSize,
      fill: this.timerBoxOptions.text
    })
    timerText.anchor.set(0.5, 0.5)
    timerText.position.set(barOptions.padding + barOptions.healthWidth + timerBoxOptions.width / 2, barOptions.padding + timerBoxOptions.height / 2)

    this.addChild(timerText)
    this.timerText = timerText

    const player1HealthBar = new HealthBar({})
    player1HealthBar.position.set(barOptions.padding, barOptions.padding + barOptions.healthPadding)
    this.addChild(player1HealthBar)
    this.player1HealthBar = player1HealthBar

    const player2HealthBar = new HealthBar({})
    player2HealthBar.rotation = Math.PI
    player2HealthBar.position.set(barOptions.padding + barOptions.healthWidth * 2 + timerBoxOptions.width, barOptions.padding + barOptions.healthPadding + player2HealthBar.height)
    this.addChild(player2HealthBar)
    this.player2HealthBar = player2HealthBar
  }

  draw (_: IStatusBarOptions): void {
    const {
      barOptions, timerBox, timerBoxOptions
    } = this
    timerBox.beginFill(timerBoxOptions.border)
    timerBox.drawRect(barOptions.padding + barOptions.healthWidth, barOptions.padding, timerBoxOptions.width, timerBoxOptions.height)
    timerBox.endFill()
    timerBox.beginFill(timerBoxOptions.fill)
    timerBox.drawRect(
      barOptions.padding + barOptions.healthWidth + timerBoxOptions.borderThick,
      barOptions.padding + timerBoxOptions.borderThick,
      timerBoxOptions.width - 2 * timerBoxOptions.borderThick,
      timerBoxOptions.height - 2 * timerBoxOptions.borderThick)
    timerBox.endFill()
  }

  update (deltaMS: number): void {
    this.time -= deltaMS
    if (this.time < 0) {
      this.time = 0
    }
    this.timerText.text = Math.round(this.time / 1000)
  }

  updatePlayer1Health (health: number): void {
    if (health <= 0) {
      health = 0
    } else if (health >= 100) {
      health = 100
    }
    gsap.to(this.player1HealthBar.fillBar, {
      width: this.player1HealthBar.boxOptions.width * health / 100
    })
  }

  updatePlayer2Health (health: number): void {
    if (health <= 0) {
      health = 0
    } else if (health >= 100) {
      health = 100
    }
    gsap.to(this.player2HealthBar.fillBar, {
      width: this.player2HealthBar.boxOptions.width * health / 100
    })
  }

  restart ({ player1Health, player2Health }: { player1Health: number, player2Health: number }): void {
    this.time = this.maxTime
    this.updatePlayer1Health(player1Health)
    this.updatePlayer2Health(player2Health)
  }
}
