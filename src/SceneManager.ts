import { Application, Container, type DisplayObject } from 'pixi.js'
import { logApp } from './logger'

export interface IScene extends DisplayObject {
  handleUpdate: (deltaMS: number) => void
  handleResize: (options: {
    viewWidth: number
    viewHeight: number
  }) => void
}

class DefaultScene extends Container implements IScene {
  handleUpdate (): void {

  }

  handleResize (): void {

  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class SceneManager {
  private constructor () { }
  private static app: Application<HTMLCanvasElement>
  private static currentScene: IScene = new DefaultScene()
  private static resizeTimeoutId: NodeJS.Timeout
  private static readonly resizeTimeout = 300
  private static readonly totalWidth = 1024
  private static readonly totalHeight = 576
  public static backgroundColor = 0xe6e7ea

  public static get width (): number {
    // return Math.max(document.documentElement.clientWidth, window.innerWidth ?? 0)
    return window.innerWidth
  }

  public static get height (): number {
    // return Math.max(document.documentElement.clientHeight, window.innerHeight ?? 0)
    return window.innerHeight
  }

  public static async initialize (): Promise<void> {
    const app = new Application<HTMLCanvasElement>({
      autoDensity: true,
      resolution: window.devicePixelRatio ?? 1,
      width: SceneManager.width,
      height: SceneManager.height,
      backgroundColor: SceneManager.backgroundColor,
      resizeTo: window
    })
    document.body.appendChild(app.view)
    if (logApp.enabled) {
      logApp('window.app initialized!');
      (window as unknown as any).app = app
    }

    SceneManager.app = app

    SceneManager.setupEventLesteners()
    // Manager.initializeAssetsPromise = Assets.init({ manifest: manifest });
    // Manager.initializeAssetsPromise.then(() => Assets.backgroundLoadBundle(manifest.bundles.map(b => b.name)));
  }

  static setupEventLesteners (): void {
    window.addEventListener('resize', SceneManager.resizeDeBounce)
    SceneManager.app.ticker.add(SceneManager.updateHandler)
  }

  public static async changeScene (newScene: IScene): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    SceneManager.app.stage.removeChild(SceneManager.currentScene)
    SceneManager.currentScene.destroy()

    // await Assets.loadBundle(newScene.assetBundles)

    // we now store it and show it, as it is completely created
    SceneManager.currentScene = newScene
    SceneManager.app.stage.addChild(SceneManager.currentScene)

    SceneManager.resizeHandler()
  }

  private static resizeDeBounce (): void {
    SceneManager.cancelScheduledResizeHandler()
    SceneManager.scheduleResizeHandler()
  }

  private static cancelScheduledResizeHandler (): void {
    clearTimeout(SceneManager.resizeTimeoutId)
  }

  private static scheduleResizeHandler (): void {
    SceneManager.resizeTimeoutId = setTimeout(() => {
      SceneManager.cancelScheduledResizeHandler()
      SceneManager.resizeHandler()
    }, SceneManager.resizeTimeout)
  }

  public static resizeHandler (): void {
    SceneManager.currentScene.handleResize({
      viewWidth: SceneManager.width,
      viewHeight: SceneManager.height
    })
  }

  public static updateHandler (): void {
    SceneManager.currentScene.handleUpdate(SceneManager.app.ticker.deltaMS)
  }
}
