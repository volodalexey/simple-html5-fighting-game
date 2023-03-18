import { Container, Graphics, Assets, type ResolverManifest, type Spritesheet, type Texture } from 'pixi.js'
import { type IScene } from './SceneManager'

export const manifest: ResolverManifest = {
  bundles: [
    {
      name: 'bundle-1',
      assets: {
        spritesheet: 'assets/spritesheets/spritesheet.json',
        background: 'assets/images/background.png',
        font: 'assets/fonts/Press_Start_2P.woff2'
      }
    }
  ]
}

export interface ILoaderSceneOptions {
  viewWidth: number
  viewHeight: number
}

export class LoaderScene extends Container implements IScene {
  private readonly loaderBar: Container
  private readonly loaderBarBoder: Graphics
  private readonly loaderBarFill: Graphics
  constructor ({ viewWidth, viewHeight }: ILoaderSceneOptions) {
    super()

    const loaderBarWidth = viewWidth * 0.8 // TODO padding
    this.loaderBarFill = new Graphics()
    this.loaderBarFill.beginFill(0x008800, 1)
    this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50)
    this.loaderBarFill.endFill()
    this.loaderBarFill.scale.x = 0 // we draw the filled bar and with scale we set the %

    this.loaderBarBoder = new Graphics()
    this.loaderBarBoder.lineStyle(10, 0x0, 1)
    this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50)

    // Now we keep the border and the fill in a container so we can move them together.
    this.loaderBar = new Container()
    this.loaderBar.addChild(this.loaderBarFill)
    this.loaderBar.addChild(this.loaderBarBoder)
    // Looks complex but this just centers the bar on screen.
    this.loaderBar.position.x = (viewWidth - this.loaderBar.width) / 2
    this.loaderBar.position.y = (viewHeight - this.loaderBar.height) / 2
    this.addChild(this.loaderBar)
  }

  async initializeLoader (): Promise<void> {
    await Assets.init({ manifest })

    await Assets.loadBundle(manifest.bundles.map(bundle => bundle.name), this.downloadProgress)
  }

  private readonly downloadProgress = (progressRatio: number): void => {
    this.loaderBarFill.scale.x = progressRatio
  }

  public getAssets (): { spritesheet: Spritesheet, backgroundTexture: Texture, font: FontFace } {
    return {
      spritesheet: Assets.get('spritesheet'),
      backgroundTexture: Assets.get('background'),
      font: Assets.get('font')
    }
  }

  public handleResize (): void {

  }

  public handleUpdate (): void {

  }
}
