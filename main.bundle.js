(()=>{"use strict";var t,e={7279:(t,e,i)=>{i.r(e)},2186:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Collision=void 0;const s=i(5473);e.Collision=class{static checkCollision(t,e){(0,s.logRectCollision)(`r1:: l=${t.left} r=${t.right} t=${t.top} b=${t.bottom} <> r2:: l=${e.left} r=${e.right} t=${e.top} b=${e.bottom}`);const i=t.left<e.left?e.left:t.left,a=t.right>e.right?e.right:t.right;if((0,s.logRectCollision)(`left-m-Right=${a} right-m-Left=${i}`),a<=i)return 0;const o=t.top<e.top?e.top:t.top,h=t.bottom>e.bottom?e.bottom:t.bottom;return(0,s.logRectCollision)(`bottom-m-Top=${o} top-m-Bottom=${h}`),h>o?(a-i)*(h-o)/((e.right-e.left)*(e.bottom-e.top)):0}}},1736:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Fighter=e.FighterAnimation=void 0;const s=i(8687),a=i(5473);var o;!function(t){t.idle="idle",t.run="run",t.jump="jump",t.fall="fall",t.attack="attack",t.death="death",t.takeHit="takeHit"}(o=e.FighterAnimation||(e.FighterAnimation={}));class h extends s.Container{constructor(t){super(),this.isPressed=!1,this.directionPressed={top:!1,right:!1,bottom:!1,left:!1},this.spritesScale=2.5,this.velocity={vx:0,vy:0},this.attackHitAvailable=!1,this.attackHitProcessed=!1,this.health=100,this.isDead=!1,this.animation=o.idle,this.settings={animationSpeed:.2,attackBoxColor:16711935},this.attackDamage=t.attackDamage,this.attackFrame=t.attackFrame,this.box=t.box,this.moveSpeed=t.moveSpeed,this.jumpSpeed=t.jumpSpeed,this.setup(t),this.draw(t),this.switchAnimation(o.idle)}setup({attackOptions:t,textures:{idleTexture:e,runTexture:i,jumpTexture:a,fallTexture:o,attackTexture:h,deathTexture:r,takeHitTexture:n}}){const{settings:l}=this;this.cullable=!0;const d=new s.Graphics;this.addChild(d),this.spritesBox=d;const c=new s.Container,p=new s.AnimatedSprite(e);p.animationSpeed=l.animationSpeed,c.addChild(p),this.idle=p;const g=new s.AnimatedSprite(i);g.animationSpeed=l.animationSpeed,c.addChild(g),this.run=g;const u=new s.AnimatedSprite(a);u.animationSpeed=l.animationSpeed,c.addChild(u),this.jump=u;const y=new s.AnimatedSprite(o);y.animationSpeed=l.animationSpeed,c.addChild(y),this.fall=y;const m=new s.AnimatedSprite(h);m.animationSpeed=l.animationSpeed,c.addChild(m),this.attack=m;const v=new s.AnimatedSprite(r);v.animationSpeed=l.animationSpeed,c.addChild(v),this.death=v;const f=new s.AnimatedSprite(n);f.animationSpeed=l.animationSpeed,c.addChild(f),this.takeHit=f,this.addChild(c);const w=new s.Graphics;this.addChild(w),this.fighterBox=w;const b=new s.Graphics;b.position.x=t.offset.x,b.position.y=t.offset.y,this.addChild(b),this.attackBox=b,this.scale.set(this.spritesScale,this.spritesScale)}draw({attackOptions:{width:t,height:e}}){this.attackBox.beginFill(this.settings.attackBoxColor),this.attackBox.drawRect(0,0,t,e),this.attackBox.endFill(),this.attackBox.alpha=a.logAttackBox.enabled?.5:0}stopAllAnimations(){[this.idle,this.run,this.jump,this.fall,this.attack,this.death,this.takeHit].forEach((t=>{t.stop()}))}hideAllAnimations(){[this.idle,this.run,this.jump,this.fall,this.attack,this.death,this.takeHit].forEach((t=>{t.visible=!1}))}releaseAllPressures(){this.directionPressed.top=!1,this.directionPressed.right=!1,this.directionPressed.bottom=!1,this.directionPressed.left=!1}setTopDirectionPressed(t){this.isDead||(this.directionPressed.top=t)}setLeftDirectionPressed(t){this.isDead||(this.directionPressed.left=t)}setRightDirectionPressed(t){this.isDead||(this.directionPressed.right=t)}setBottomDirectionPressed(t){this.isDead||(this.directionPressed.bottom=t)}handleMove(t,e,i){const{directionPressed:s,isDead:a}=this;if(!a&&("boolean"==typeof t&&(this.isPressed=t),this.releaseAllPressures(),this.isPressed)){const{top:t,right:a,bottom:o,left:h}=this.toBounds();e>=a?s.right=!0:e<=h&&(s.left=!0),i>=o?s.bottom=!0:i<=t&&(s.top=!0),e<a&&e>h&&i>t&&i<o&&(s.bottom=!0)}}isAttacking(){return this.animation===o.attack}isDying(){return this.animation===o.death}isTakingHit(){return this.animation===o.takeHit}switchAnimation(t){switch(this.hideAllAnimations(),this.stopAllAnimations(),t){case o.idle:this.idle.play(),this.idle.visible=!0;break;case o.run:this.run.play(),this.run.visible=!0;break;case o.jump:this.jump.play(),this.jump.visible=!0;break;case o.fall:this.fall.play(),this.fall.visible=!0;break;case o.attack:this.attack.play(),this.attack.visible=!0,this.attack.currentFrame=0;break;case o.takeHit:this.takeHit.play(),this.takeHit.visible=!0,this.takeHit.currentFrame=0;break;case o.death:this.death.play(),this.death.visible=!0}this.animation=t}toBounds(){const t=this.x+this.width/2,e=this.y+this.height/2;return{top:e-this.box.toTop,right:t+this.box.toRight,bottom:e+this.box.toBottom,left:t-this.box.toLeft}}toAttackBounds(){const t=this.x+this.attackBox.x*this.spritesScale,e=this.y+this.attackBox.y*this.spritesScale;return{top:e,right:t+this.attackBox.width*this.spritesScale,bottom:e+this.attackBox.height*this.spritesScale,left:t}}updateAnimation(){this.isDying()||this.isDead?this.death.currentFrame===this.death.totalFrames-1&&(this.death.stop(),this.isDead=!0):this.isAttacking()?this.attack.currentFrame!==this.attackFrame||this.attackHitProcessed?this.attack.currentFrame===this.attack.totalFrames-1&&this.switchAnimation(h.ANIMATION.idle):this.attackHitAvailable=!0:(this.isTakingHit()?this.takeHit.currentFrame===this.takeHit.totalFrames-1&&this.switchAnimation(h.ANIMATION.idle):this.switchAnimation(h.ANIMATION.idle),this.velocity.vy<0?this.switchAnimation(h.ANIMATION.jump):this.velocity.vy>0&&this.switchAnimation(h.ANIMATION.fall),0===this.velocity.vy&&0!==this.velocity.vx&&this.switchAnimation(h.ANIMATION.run)),this.isDying()||!this.directionPressed.bottom||this.isAttacking()||(this.directionPressed.bottom=!1,this.attackHitAvailable=!1,this.attackHitProcessed=!1,this.switchAnimation(h.ANIMATION.attack))}update({gravity:t,levelLeft:e,levelRight:i,levelBottom:s}){if(this.isDead)return;this.directionPressed.top&&0===this.velocity.vy&&(this.velocity.vy=-this.jumpSpeed),this.directionPressed.left?this.velocity.vx=-this.moveSpeed:this.directionPressed.right?this.velocity.vx=this.moveSpeed:this.velocity.vx=0;const{bottom:o,left:h,right:r}=this.toBounds();(0,a.logFighterBounds)(`px=${this.x} py=${this.y} ph=${this.height} to-bot=${this.box.toBottom} bot=${o}`),o+this.velocity.vy>=s?((0,a.logFighterGravity)(`Floor bot=${o} vy=${this.velocity.vy} fl=${s}`),this.velocity.vy=0,this.position.y=s-(this.height/2+this.box.toBottom)):((0,a.logFighterGravity)(`Gravity bot=${o} vy=${this.velocity.vy} fl=${s}`),this.velocity.vy+=t,this.position.y+=this.velocity.vy),(0,a.logFighterMove)(`Move left=${h} right=${r} vy=${this.velocity.vx}`),h+this.velocity.vx<e?(this.velocity.vx=0,this.position.x=e-(this.width/2-this.box.toLeft)):r+this.velocity.vx>i?(this.velocity.vx=0,this.position.x=i-(this.width/2+this.box.toRight)):this.position.x+=this.velocity.vx,this.updateAnimation()}takeDamage(t){(0,a.logDamage)(`health=${this.health} damage=${t}`),this.health-=t,(0,a.logDamage)(`health=${this.health}`),this.health<=0?(this.health=0,this.releaseAllPressures(),this.switchAnimation(o.death)):this.switchAnimation(o.takeHit)}}e.Fighter=h,h.ANIMATION=o},6987:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.FightingScene=void 0;const s=i(8687),a=i(8554),o=i(1736),h=i(5473),r=i(2186);class n extends s.Container{constructor(t){super(),this.gravity=.7,this.floorY=480,this.shopSettings={animationSpeed:.1,scale:2.75,x:600,y:128},this.overlaySettings={color:16777215,alpha:.15},this.foregroundSettings={size:16,color:16777215},this.player1Options={initialPosition:{x:10,y:-100}},this.player2Options={initialPosition:{x:400,y:-123}},this.handlePlayer1StartMove=t=>{this.handlePlayer1Move(this.player1,!0,t)},this.handlePlayer1KeepMove=t=>{this.handlePlayer1Move(this.player1,void 0,t)},this.handlePlayer1StopMove=t=>{this.handlePlayer1Move(this.player1,!1,t)},this.handlePlayer2StartMove=t=>{this.handlePlayer1Move(this.player2,!0,t)},this.handlePlayer2KeepMove=t=>{this.handlePlayer1Move(this.player2,void 0,t)},this.handlePlayer2StopMove=t=>{this.handlePlayer1Move(this.player2,!1,t)},this.handleKeyDown=t=>{const{player1:e,player2:i}=this;switch((0,h.logKeydown)(`${t.code} ${t.key}`),t.code){case"KeyW":e.setTopDirectionPressed(!0);break;case"KeyA":e.setLeftDirectionPressed(!0);break;case"KeyS":case"Space":case"ShiftLeft":e.setBottomDirectionPressed(!0);break;case"KeyD":e.setRightDirectionPressed(!0)}switch(t.code){case"ArrowUp":i.setTopDirectionPressed(!0);break;case"ArrowLeft":i.setLeftDirectionPressed(!0);break;case"ArrowDown":case"Numpad0":case"ShiftRight":i.setBottomDirectionPressed(!0);break;case"ArrowRight":i.setRightDirectionPressed(!0)}},this.handleKeyUp=t=>{const{player1:e,player2:i}=this;switch((0,h.logKeyup)(`${t.code} ${t.key}`),t.code){case"KeyW":e.setTopDirectionPressed(!1);break;case"KeyA":e.setLeftDirectionPressed(!1);break;case"KeyS":e.setBottomDirectionPressed(!1);break;case"KeyD":e.setRightDirectionPressed(!1)}switch(t.code){case"ArrowUp":i.setTopDirectionPressed(!1);break;case"ArrowLeft":i.setLeftDirectionPressed(!1);break;case"ArrowDown":i.setBottomDirectionPressed(!1);break;case"ArrowRight":i.setRightDirectionPressed(!1)}},this.setup(t),this.draw(t),this.setupFighters(),this.addEventLesteners()}setup({viewWidth:t,viewHeight:e,player1Textures:i,player2Textures:h,textures:{backgroundTexture:r,shopTexture:n}}){this.player1=new o.Fighter({attackDamage:25,attackFrame:4,moveSpeed:5,jumpSpeed:20,box:{toTop:70,toRight:30,toBottom:55,toLeft:30},textures:i,texturesOptions:{offset:{x:16,y:67}},attackOptions:{offset:{x:125,y:53},width:65,height:66}}),this.player2=new o.Fighter({attackDamage:12,attackFrame:2,moveSpeed:6,jumpSpeed:22,box:{toTop:70,toRight:17,toBottom:70,toLeft:27},textures:h,texturesOptions:{offset:{x:16,y:67}},attackOptions:{offset:{x:16,y:67},width:55,height:60}});const{shopSettings:l}=this,d=new s.Sprite(r);this.addChild(d),this.background=d;const c=new s.AnimatedSprite(n);c.animationSpeed=l.animationSpeed,c.play(),c.scale.set(l.scale),c.position.x=l.x,c.position.y=l.y,this.addChild(c),this.shop=c;const p=new s.Graphics;this.addChild(p),this.overlay=p;const g=new a.StatusBar({});this.addChild(g),this.statusBar=g;const u=new s.Container;u.visible=!1;const y=new s.Text("...",{fontFamily:"Press Start 2P",fontSize:this.foregroundSettings.size,fill:this.foregroundSettings.color});y.anchor.set(.5,.5),y.position.set(this.width/2,this.height/2),this.foregroundText=y,u.addChild(y),this.addChild(u),this.foreground=u}draw(t){this.overlay.beginFill(this.overlaySettings.color),this.overlay.drawRect(0,0,this.background.width,this.background.height),this.overlay.endFill(),this.overlay.alpha=this.overlaySettings.alpha}setupFighters(){this.addChild(this.player1),this.addChild(this.player2)}handleResize({viewWidth:t,viewHeight:e}){const i=t,s=e,a=this.background.width,o=this.background.height;let r=1;o>=a?(r=s/o,r*a>i&&(r=i/a),(0,h.logLayout)(`By height (sc=${r})`)):(r=i/a,(0,h.logLayout)(`By width (sc=${r})`),r*o>s&&(r=s/o));const n=Math.floor(a*r),l=Math.floor(o*r),d=i>n?(i-n)/2:0,c=s>l?(s-l)/2:0;(0,h.logLayout)(`aw=${i} (ow=${n}) x=${d} ah=${s} (oh=${l}) y=${c}`),this.x=d,this.width=n,this.y=c,this.height=l,(0,h.logLayout)(`x=${d} y=${c} w=${this.width} h=${this.height}`)}handleUpdate(t){[this.player1,this.player2].forEach((t=>{t.update({gravity:this.gravity,levelLeft:0,levelRight:this.background.width,levelBottom:this.floorY})}));const e=this.player1.health>0&&this.player2.health>0;if(e&&this.statusBar.update(t),e&&this.player1.attackHitAvailable&&!this.player1.attackHitProcessed){this.player1.attackHitProcessed=!0;const t=this.player1.toAttackBounds(),e=this.player2.toBounds(),i=r.Collision.checkCollision(t,e);(0,h.logDamage)(`inter=${i}`),i>=.05&&(this.player2.takeDamage(Math.round(i*this.player1.attackDamage)),this.statusBar.updatePlayer2Health(this.player2.health))}if(e&&this.player2.attackHitAvailable&&!this.player2.attackHitProcessed){this.player2.attackHitProcessed=!0;const t=this.player2.toAttackBounds(),e=this.player1.toBounds(),i=r.Collision.checkCollision(t,e);(0,h.logDamage)(`inter=${i}`),i>=.05&&(this.player1.takeDamage(Math.round(i*this.player2.attackDamage)),this.statusBar.updatePlayer1Health(this.player1.health))}this.checkEndFight()}handleMounted(){Promise.resolve().then((()=>{this.startFighters()})).catch(console.error)}startFighters(){const{player1:t,player1Options:e,player2:i,player2Options:s}=this;t.position=e.initialPosition,i.position=s.initialPosition}addEventLesteners(){this.background.interactive=!0,this.on("mousedown",this.handlePlayer1StartMove),this.on("mousemove",this.handlePlayer1KeepMove),this.on("mouseup",this.handlePlayer1StopMove),this.on("touchstart",this.handlePlayer2StartMove),this.on("touchmove",this.handlePlayer2KeepMove),this.on("touchend",this.handlePlayer2StopMove),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp)}removeEventListeners(){this.background.interactive=!1,this.off("mousedown",this.handlePlayer1StartMove),this.off("mousemove",this.handlePlayer1KeepMove),this.off("mouseup",this.handlePlayer1StopMove),this.off("touchstart",this.handlePlayer2StartMove),this.off("touchmove",this.handlePlayer2KeepMove),this.off("touchend",this.handlePlayer2StopMove),window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp)}handlePlayer1Move(t,e,i){const s=this.background.toLocal(i.global);(0,h.logPointerEvent)(`${i.type} px=${s.x} py=${s.y}`),t.handleMove(e,s.x,s.y)}checkEndFight(){(this.player1.isDying()||this.player2.isDying()||this.statusBar.time<=0)&&(this.foreground.visible=!0,this.player1.health===this.player2.health?this.foregroundText.text="Tie":this.player1.health>this.player2.health?this.foregroundText.text="Player 1 Wins":this.player1.health<this.player2.health&&(this.foregroundText.text="Player 2 Wins")),(this.player1.isDead||this.player2.isDead)&&this.removeEventListeners()}}e.FightingScene=n},1259:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.HealthBar=void 0;const s=i(8687);class a extends s.Container{constructor(t){super(),this.boxOptions={border:16777215,borderThick:4,width:442,height:38,fill:8490232,empty:16711680},this.setup(t),this.draw(t)}setup(t){this.borderBox=new s.Graphics,this.addChild(this.borderBox);const e=new s.Container;e.rotation=Math.PI,e.position.set(this.boxOptions.width,this.boxOptions.height-this.boxOptions.borderThick),this.emptyBar=new s.Graphics,e.addChild(this.emptyBar);const i=new s.Graphics;e.addChild(i),this.fillBar=i,this.addChild(e)}draw(t){const{borderBox:e,boxOptions:i,fillBar:s,emptyBar:a}=this;e.beginFill(i.border),e.drawRect(0,0,i.width,i.height),e.endFill(),a.beginFill(i.empty),a.drawRect(0,0,i.width-i.borderThick,i.height-2*i.borderThick),a.endFill(),s.beginFill(i.fill),s.drawRect(0,0,i.width-i.borderThick,i.height-2*i.borderThick),s.endFill()}setBetween(t){}}e.HealthBar=a},1557:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.LoaderScene=e.manifest=void 0;const s=i(8687),a=i(5473);e.manifest={bundles:[{name:"bundle-1",assets:{spritesheet:"assets/spritesheets/spritesheet.json",background:"assets/images/background.png",font:"assets/fonts/Press_Start_2P.woff2"}}]};class o extends s.Container{constructor(t){super(),this.barOptions={width:350,height:40,fillColor:34816,borderRadius:5,borderThick:5,borderColor:0},this.downloadProgress=t=>{this.loaderBarFill.width=(this.barOptions.width-2*this.barOptions.borderThick)*t},this.setup(),this.draw()}setup(){const t=new s.Graphics;this.addChild(t),this.loaderBarBorder=t;const e=new s.Graphics;this.addChild(e),this.loaderBarFill=e}draw(){const{loaderBarFill:t,loaderBarBorder:e,barOptions:i}=this;e.beginFill(i.borderColor),e.drawRoundedRect(0,0,i.width,i.height,i.borderRadius),e.endFill(),t.beginFill(i.fillColor),t.drawRoundedRect(i.borderThick,i.borderThick,i.width-2*i.borderThick,i.height-2*i.borderThick,i.borderRadius),t.endFill()}async initializeLoader(){await s.Assets.init({manifest:e.manifest}),await s.Assets.loadBundle(e.manifest.bundles.map((t=>t.name)),this.downloadProgress)}getAssets(){return{spritesheet:s.Assets.get("spritesheet"),backgroundTexture:s.Assets.get("background"),font:s.Assets.get("font")}}handleResize({viewWidth:t,viewHeight:e}){const i=t,s=e,o=this.width,h=this.height;if(i>=o&&s>=h){const t=i>o?(i-o)/2:0,e=s>h?(s-h)/2:0;(0,a.logLayout)(`Spacing aw=${i} tw=${o} ah=${s} th=${h}`),this.x=t,this.width=this.barOptions.width,this.y=e,this.height=this.barOptions.height}else{let t=1;h>=o?(t=s/h,t*o>i&&(t=i/o),(0,a.logLayout)(`By height (sc=${t})`)):(t=i/o,(0,a.logLayout)(`By width (sc=${t})`),t*h>s&&(t=s/h));const e=Math.floor(o*t),r=Math.floor(h*t),n=i>e?(i-e)/2:0,l=s>r?(s-r)/2:0;(0,a.logLayout)(`aw=${i} (ow=${e}) ah=${s} (oh=${r})`),this.x=n,this.width=e,this.y=l,this.height=r}(0,a.logLayout)(`x=${this.x} y=${this.y} w=${this.width} h=${this.height}`)}handleMounted(){}handleUpdate(){}}e.LoaderScene=o},3110:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SceneManager=void 0;const s=i(8687),a=i(5473);class o extends s.Container{handleMounted(){}handleUpdate(){}handleResize(){}}class h{constructor(){}static get width(){return window.innerWidth}static get height(){return window.innerHeight}static async initialize(){var t;const e=new s.Application({autoDensity:!0,resolution:null!==(t=window.devicePixelRatio)&&void 0!==t?t:1,width:h.width,height:h.height,backgroundColor:h.backgroundColor,resizeTo:window});document.body.appendChild(e.view),a.logApp.enabled&&((0,a.logApp)("window.app initialized!"),window.app=e),h.app=e,h.setupEventLesteners()}static setupEventLesteners(){window.addEventListener("resize",h.resizeDeBounce),h.app.ticker.add(h.updateHandler)}static async changeScene(t){h.app.stage.removeChild(h.currentScene),h.currentScene.destroy(),h.currentScene=t,h.app.stage.addChild(h.currentScene),h.currentScene.handleMounted(),h.resizeHandler()}static resizeDeBounce(){h.cancelScheduledResizeHandler(),h.scheduleResizeHandler()}static cancelScheduledResizeHandler(){clearTimeout(h.resizeTimeoutId)}static scheduleResizeHandler(){h.resizeTimeoutId=setTimeout((()=>{h.cancelScheduledResizeHandler(),h.resizeHandler()}),h.resizeTimeout)}static resizeHandler(){h.currentScene.handleResize({viewWidth:h.width,viewHeight:h.height})}static updateHandler(){h.currentScene.handleUpdate(h.app.ticker.deltaMS)}}e.SceneManager=h,h.currentScene=new o,h.resizeTimeout=300,h.totalWidth=1024,h.totalHeight=576,h.backgroundColor=15132650},8554:function(t,e,i){var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.StatusBar=void 0;const a=i(8687),o=s(i(926)),h=i(1259);class r extends a.Container{constructor(t){super(),this.barOptions={padding:20,healthPadding:6,healthWidth:442},this.time=9e4,this.timerBoxOptions={textSize:16,text:16777215,fill:0,border:16777215,borderThick:4,width:100,height:50},this.setup(t),this.draw(t)}setup(t){const{barOptions:e,timerBoxOptions:i}=this;this.timerBox=new a.Graphics,this.addChild(this.timerBox);const s=new a.Text(String(Math.round(this.time/1e3)),{fontFamily:"Press Start 2P",fontSize:this.timerBoxOptions.textSize,fill:this.timerBoxOptions.text});s.anchor.set(.5,.5),s.position.set(e.padding+e.healthWidth+i.width/2,e.padding+i.height/2),this.addChild(s),this.timerText=s;const o=new h.HealthBar({});o.position.set(e.padding,e.padding+e.healthPadding),this.addChild(o),this.player1HealthBar=o;const r=new h.HealthBar({});r.rotation=Math.PI,r.position.set(e.padding+2*e.healthWidth+i.width,e.padding+e.healthPadding+r.height),this.addChild(r),this.player2HealthBar=r}draw(t){const{barOptions:e,timerBox:i,timerBoxOptions:s}=this;i.beginFill(s.border),i.drawRect(e.padding+e.healthWidth,e.padding,s.width,s.height),i.endFill(),i.beginFill(s.fill),i.drawRect(e.padding+e.healthWidth+s.borderThick,e.padding+s.borderThick,s.width-2*s.borderThick,s.height-2*s.borderThick),i.endFill()}update(t){this.time-=t,this.time<0&&(this.time=0),this.timerText.text=Math.round(this.time/1e3)}updatePlayer1Health(t){t<=0?t=0:t>=100&&(t=100),o.default.to(this.player1HealthBar.fillBar,{width:this.player1HealthBar.boxOptions.width*t/100})}updatePlayer2Health(t){t<=0?t=0:t>=100&&(t=100),o.default.to(this.player2HealthBar.fillBar,{width:this.player2HealthBar.boxOptions.width*t/100})}}e.StatusBar=r},6752:(t,e,i)=>{i(7279);const s=i(3110),a=i(6987),o=i(1557);(async function(){const t=document.querySelector(".ellipsis");null!=t&&(t.style.display="none"),await s.SceneManager.initialize();const e=new o.LoaderScene({viewWidth:s.SceneManager.width,viewHeight:s.SceneManager.height});await s.SceneManager.changeScene(e),await e.initializeLoader();const{backgroundTexture:i,spritesheet:{animations:h}}=e.getAssets();await s.SceneManager.changeScene(new a.FightingScene({viewWidth:s.SceneManager.width,viewHeight:s.SceneManager.height,textures:{backgroundTexture:i,shopTexture:h.Shop},player1Textures:{idleTexture:h["Mack-Idle"],runTexture:h["Mack-Run"],jumpTexture:h["Mack-Jump"],fallTexture:h["Mack-Fall"],attackTexture:h["Mack-Attack1"],deathTexture:h["Mack-Death"],takeHitTexture:h["Mack-Take-Hit"]},player2Textures:{idleTexture:h["Kenji-Idle"],runTexture:h["Kenji-Run"],jumpTexture:h["Kenji-Jump"],fallTexture:h["Kenji-Fall"],attackTexture:h["Kenji-Attack1"],deathTexture:h["Kenji-Death"],takeHitTexture:h["Kenji-Take-Hit"]}}))})().catch(console.error)},5473:function(t,e,i){var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.logDamage=e.logKeyup=e.logKeydown=e.logFighterMove=e.logFighterGravity=e.logFighterBounds=e.logAttackBox=e.logPointerEvent=e.logMoveInterface=e.logRectCollision=e.logLayout=e.logApp=void 0;const a=s(i(1227));e.logApp=(0,a.default)("fighting-app"),e.logLayout=(0,a.default)("fighting-layout"),e.logRectCollision=(0,a.default)("fighting-rect-collision"),e.logMoveInterface=(0,a.default)("fighting-move-interface"),e.logPointerEvent=(0,a.default)("fighting-pointer-event"),e.logAttackBox=(0,a.default)("fighting-attack-box"),e.logFighterBounds=(0,a.default)("fighting-fighter-bounds"),e.logFighterGravity=(0,a.default)("fighting-fighter-gravity"),e.logFighterMove=(0,a.default)("fighting-fighter-move"),e.logKeydown=(0,a.default)("fighting-keydown"),e.logKeyup=(0,a.default)("fighting-keyup"),e.logDamage=(0,a.default)("fighting-fighter-damage")}},i={};function s(t){var a=i[t];if(void 0!==a)return a.exports;var o=i[t]={id:t,loaded:!1,exports:{}};return e[t].call(o.exports,o,o.exports,s),o.loaded=!0,o.exports}s.m=e,t=[],s.O=(e,i,a,o)=>{if(!i){var h=1/0;for(d=0;d<t.length;d++){for(var[i,a,o]=t[d],r=!0,n=0;n<i.length;n++)(!1&o||h>=o)&&Object.keys(s.O).every((t=>s.O[t](i[n])))?i.splice(n--,1):(r=!1,o<h&&(h=o));if(r){t.splice(d--,1);var l=a();void 0!==l&&(e=l)}}return e}o=o||0;for(var d=t.length;d>0&&t[d-1][2]>o;d--)t[d]=t[d-1];t[d]=[i,a,o]},s.d=(t,e)=>{for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),(()=>{var t={179:0};s.O.j=e=>0===t[e];var e=(e,i)=>{var a,o,[h,r,n]=i,l=0;if(h.some((e=>0!==t[e]))){for(a in r)s.o(r,a)&&(s.m[a]=r[a]);if(n)var d=n(s)}for(e&&e(i);l<h.length;l++)o=h[l],s.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return s.O(d)},i=self.webpackChunksimple_html5_fighting_game=self.webpackChunksimple_html5_fighting_game||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))})();var a=s.O(void 0,[736],(()=>s(6752)));a=s.O(a)})();