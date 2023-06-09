import './styles.css'
import { SceneManager } from './SceneManager'
import { FightingScene } from './FightingScene'
import { LoaderScene } from './LoaderScene'

async function run (): Promise<void> {
  const ellipsis: HTMLElement | null = document.querySelector('.ellipsis')
  if (ellipsis != null) {
    ellipsis.style.display = 'none'
  }
  await SceneManager.initialize()
  const loaderScene = new LoaderScene({
    viewWidth: SceneManager.width,
    viewHeight: SceneManager.height
  })
  await SceneManager.changeScene(loaderScene)
  await loaderScene.initializeLoader()
  const { backgroundTexture, spritesheet: { animations } } = loaderScene.getAssets()
  await SceneManager.changeScene(new FightingScene({
    viewWidth: SceneManager.width,
    viewHeight: SceneManager.height,
    textures: {
      backgroundTexture,
      shopTexture: animations.Shop
    },
    player1Textures: {
      idleTexture: animations['Mack-Idle'],
      runTexture: animations['Mack-Run'],
      jumpTexture: animations['Mack-Jump'],
      fallTexture: animations['Mack-Fall'],
      attackTexture: animations['Mack-Attack1'],
      deathTexture: animations['Mack-Death'],
      takeHitTexture: animations['Mack-Take-Hit']
    },
    player2Textures: {
      idleTexture: animations['Kenji-Idle'],
      runTexture: animations['Kenji-Run'],
      jumpTexture: animations['Kenji-Jump'],
      fallTexture: animations['Kenji-Fall'],
      attackTexture: animations['Kenji-Attack1'],
      deathTexture: animations['Kenji-Death'],
      takeHitTexture: animations['Kenji-Take-Hit']
    }
  }))
}

run().catch((err) => {
  console.error(err)
  const div = document.createElement('div')
  const divStack = document.createElement('div')
  document.body.prepend(div)
  document.body.prepend(divStack)
  div.style.color = 'red'
  div.style.fontSize = '2rem'
  div.innerText = ((Boolean(err)) && (Boolean(err.message))) ? err.message : err
  divStack.style.color = 'red'
  divStack.style.fontSize = '2rem'
  divStack.innerText = ((Boolean(err)) && (Boolean(err.stack))) ? err.stack : ''
})
