/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/Collision.ts":
/*!**************************!*\
  !*** ./src/Collision.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Collision = void 0;
const logger_1 = __webpack_require__(/*! ./logger */ "./src/logger.ts");
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Collision {
    static checkCollision(a, b) {
        (0, logger_1.logRectCollision)(`r1:: l=${a.left} r=${a.right} t=${a.top} b=${a.bottom} <> r2:: l=${b.left} r=${b.right} t=${b.top} b=${b.bottom}`);
        const rightmostLeft = a.left < b.left ? b.left : a.left;
        const leftmostRight = a.right > b.right ? b.right : a.right;
        (0, logger_1.logRectCollision)(`left-m-Right=${leftmostRight} right-m-Left=${rightmostLeft}`);
        if (leftmostRight <= rightmostLeft) {
            return 0;
        }
        const bottommostTop = a.top < b.top ? b.top : a.top;
        const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;
        (0, logger_1.logRectCollision)(`bottom-m-Top=${bottommostTop} top-m-Bottom=${topmostBottom}`);
        if (topmostBottom > bottommostTop) {
            const squareIntersection = (leftmostRight - rightmostLeft) * (topmostBottom - bottommostTop);
            const squareTarget = (b.right - b.left) * (b.bottom - b.top);
            return squareIntersection / squareTarget;
        }
        return 0;
    }
}
exports.Collision = Collision;


/***/ }),

/***/ "./src/Fighter.ts":
/*!************************!*\
  !*** ./src/Fighter.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Fighter = exports.FighterAnimation = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
const logger_1 = __webpack_require__(/*! ./logger */ "./src/logger.ts");
var FighterAnimation;
(function (FighterAnimation) {
    FighterAnimation["idle"] = "idle";
    FighterAnimation["run"] = "run";
    FighterAnimation["jump"] = "jump";
    FighterAnimation["fall"] = "fall";
    FighterAnimation["attack"] = "attack";
    FighterAnimation["death"] = "death";
    FighterAnimation["takeHit"] = "takeHit";
})(FighterAnimation = exports.FighterAnimation || (exports.FighterAnimation = {}));
class Fighter extends pixi_js_1.Container {
    constructor(options) {
        super();
        this.isPressed = false;
        this.directionPressed = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
        this.spritesScale = 2.5;
        this.velocity = {
            vx: 0,
            vy: 0
        };
        this.attackHitAvailable = false;
        this.attackHitProcessed = false;
        this.health = 100;
        this.isDead = false;
        this.animation = FighterAnimation.idle;
        this.settings = {
            animationSpeed: 0.2,
            attackBoxColor: 0xff00ff
        };
        this.attackDamage = options.attackDamage;
        this.attackFrame = options.attackFrame;
        this.box = options.box;
        this.moveSpeed = options.moveSpeed;
        this.jumpSpeed = options.jumpSpeed;
        this.setup(options);
        this.draw(options);
        this.switchAnimation(FighterAnimation.idle);
    }
    setup({ attackOptions, textures: { idleTexture, runTexture, jumpTexture, fallTexture, attackTexture, deathTexture, takeHitTexture } }) {
        const { settings } = this;
        this.cullable = true;
        const spritesBox = new pixi_js_1.Graphics();
        this.addChild(spritesBox);
        this.spritesBox = spritesBox;
        const spritesContainer = new pixi_js_1.Container();
        const idle = new pixi_js_1.AnimatedSprite(idleTexture);
        idle.animationSpeed = settings.animationSpeed;
        spritesContainer.addChild(idle);
        this.idle = idle;
        const run = new pixi_js_1.AnimatedSprite(runTexture);
        run.animationSpeed = settings.animationSpeed;
        spritesContainer.addChild(run);
        this.run = run;
        const jump = new pixi_js_1.AnimatedSprite(jumpTexture);
        jump.animationSpeed = settings.animationSpeed;
        spritesContainer.addChild(jump);
        this.jump = jump;
        const fall = new pixi_js_1.AnimatedSprite(fallTexture);
        fall.animationSpeed = settings.animationSpeed;
        spritesContainer.addChild(fall);
        this.fall = fall;
        const attack = new pixi_js_1.AnimatedSprite(attackTexture);
        attack.animationSpeed = settings.animationSpeed;
        spritesContainer.addChild(attack);
        this.attack = attack;
        const death = new pixi_js_1.AnimatedSprite(deathTexture);
        death.animationSpeed = settings.animationSpeed;
        spritesContainer.addChild(death);
        this.death = death;
        const takeHit = new pixi_js_1.AnimatedSprite(takeHitTexture);
        takeHit.animationSpeed = settings.animationSpeed;
        spritesContainer.addChild(takeHit);
        this.takeHit = takeHit;
        this.addChild(spritesContainer);
        const fighterBox = new pixi_js_1.Graphics();
        this.addChild(fighterBox);
        this.fighterBox = fighterBox;
        const attackBox = new pixi_js_1.Graphics();
        attackBox.position.x = attackOptions.offset.x;
        attackBox.position.y = attackOptions.offset.y;
        this.addChild(attackBox);
        this.attackBox = attackBox;
        this.scale.set(this.spritesScale, this.spritesScale);
    }
    draw({ attackOptions: { width, height } }) {
        this.attackBox.beginFill(this.settings.attackBoxColor);
        this.attackBox.drawRect(0, 0, width, height);
        this.attackBox.endFill();
        this.attackBox.alpha = logger_1.logAttackBox.enabled ? 0.5 : 0;
    }
    stopAllAnimations() {
        [this.idle, this.run, this.jump, this.fall, this.attack, this.death, this.takeHit].forEach(spr => {
            spr.stop();
        });
    }
    hideAllAnimations() {
        [this.idle, this.run, this.jump, this.fall, this.attack, this.death, this.takeHit].forEach(spr => {
            spr.visible = false;
        });
    }
    releaseAllPressures() {
        this.directionPressed.top = false;
        this.directionPressed.right = false;
        this.directionPressed.bottom = false;
        this.directionPressed.left = false;
    }
    setTopDirectionPressed(pressed) {
        if (this.isDead) {
            return;
        }
        this.directionPressed.top = pressed;
    }
    setLeftDirectionPressed(pressed) {
        if (this.isDead) {
            return;
        }
        this.directionPressed.left = pressed;
    }
    setRightDirectionPressed(pressed) {
        if (this.isDead) {
            return;
        }
        this.directionPressed.right = pressed;
    }
    setBottomDirectionPressed(pressed) {
        if (this.isDead) {
            return;
        }
        this.directionPressed.bottom = pressed;
    }
    handleMove(pressed, x, y) {
        const { directionPressed, isDead } = this;
        if (isDead) {
            return;
        }
        if (typeof pressed === 'boolean') {
            this.isPressed = pressed;
        }
        this.releaseAllPressures();
        if (this.isPressed) {
            const { top, right, bottom, left } = this.toBounds();
            if (x >= right) {
                directionPressed.right = true;
            }
            else if (x <= left) {
                directionPressed.left = true;
            }
            if (y >= bottom) {
                directionPressed.bottom = true;
            }
            else if (y <= top) {
                directionPressed.top = true;
            }
            if (x < right && x > left && y > top && y < bottom) {
                directionPressed.bottom = true;
            }
        }
    }
    isAttacking() {
        return this.animation === FighterAnimation.attack;
    }
    isDying() {
        return this.animation === FighterAnimation.death;
    }
    isTakingHit() {
        return this.animation === FighterAnimation.takeHit;
    }
    switchAnimation(animation) {
        this.hideAllAnimations();
        this.stopAllAnimations();
        switch (animation) {
            case FighterAnimation.idle:
                this.idle.play();
                this.idle.visible = true;
                break;
            case FighterAnimation.run:
                this.run.play();
                this.run.visible = true;
                break;
            case FighterAnimation.jump:
                this.jump.play();
                this.jump.visible = true;
                break;
            case FighterAnimation.fall:
                this.fall.play();
                this.fall.visible = true;
                break;
            case FighterAnimation.attack:
                this.attack.play();
                this.attack.visible = true;
                this.attack.currentFrame = 0;
                break;
            case FighterAnimation.takeHit:
                this.takeHit.play();
                this.takeHit.visible = true;
                this.takeHit.currentFrame = 0;
                break;
            case FighterAnimation.death:
                this.death.play();
                this.death.visible = true;
                break;
        }
        this.animation = animation;
    }
    toBounds() {
        const midHor = this.x + this.width / 2;
        const midVer = this.y + this.height / 2;
        return {
            top: midVer - this.box.toTop,
            right: midHor + this.box.toRight,
            bottom: midVer + this.box.toBottom,
            left: midHor - this.box.toLeft
        };
    }
    toAttackBounds() {
        const x = this.x + this.attackBox.x * this.spritesScale;
        const y = this.y + this.attackBox.y * this.spritesScale;
        return {
            top: y,
            right: x + this.attackBox.width * this.spritesScale,
            bottom: y + this.attackBox.height * this.spritesScale,
            left: x
        };
    }
    updateAnimation() {
        if (this.isDying() || this.isDead) {
            if (this.death.currentFrame === this.death.totalFrames - 1) {
                this.death.stop();
                this.isDead = true;
            }
        }
        else if (this.isAttacking()) {
            if (this.attack.currentFrame === this.attackFrame && !this.attackHitProcessed) {
                this.attackHitAvailable = true;
            }
            else if (this.attack.currentFrame === this.attack.totalFrames - 1) {
                this.switchAnimation(Fighter.ANIMATION.idle);
            }
        }
        else {
            if (this.isTakingHit()) {
                if (this.takeHit.currentFrame === this.takeHit.totalFrames - 1) {
                    this.switchAnimation(Fighter.ANIMATION.idle);
                }
                // animate take hit
            }
            else {
                this.switchAnimation(Fighter.ANIMATION.idle);
            }
            if (this.velocity.vy < 0) {
                this.switchAnimation(Fighter.ANIMATION.jump);
            }
            else if (this.velocity.vy > 0) {
                this.switchAnimation(Fighter.ANIMATION.fall);
            }
            if (this.velocity.vy === 0 && this.velocity.vx !== 0) {
                this.switchAnimation(Fighter.ANIMATION.run);
            }
        }
        if (!this.isDying() && this.directionPressed.bottom && !this.isAttacking()) {
            this.directionPressed.bottom = false;
            this.attackHitAvailable = false;
            this.attackHitProcessed = false;
            this.switchAnimation(Fighter.ANIMATION.attack);
        }
    }
    update({ gravity, levelLeft, levelRight, levelBottom }) {
        if (this.isDead) {
            return;
        }
        if (this.directionPressed.top && this.velocity.vy === 0) {
            this.velocity.vy = -this.jumpSpeed;
        }
        if (this.directionPressed.left) {
            this.velocity.vx = -this.moveSpeed;
        }
        else if (this.directionPressed.right) {
            this.velocity.vx = this.moveSpeed;
        }
        else {
            this.velocity.vx = 0;
        }
        const { bottom, left, right } = this.toBounds();
        (0, logger_1.logFighterBounds)(`px=${this.x} py=${this.y} ph=${this.height} to-bot=${this.box.toBottom} bot=${bottom}`);
        if (bottom + this.velocity.vy >= levelBottom) {
            (0, logger_1.logFighterGravity)(`Floor bot=${bottom} vy=${this.velocity.vy} fl=${levelBottom}`);
            this.velocity.vy = 0;
            this.position.y = levelBottom - (this.height / 2 + this.box.toBottom);
        }
        else {
            (0, logger_1.logFighterGravity)(`Gravity bot=${bottom} vy=${this.velocity.vy} fl=${levelBottom}`);
            this.velocity.vy += gravity;
            this.position.y += this.velocity.vy;
        }
        (0, logger_1.logFighterMove)(`Move left=${left} right=${right} vy=${this.velocity.vx}`);
        if (left + this.velocity.vx < levelLeft) {
            this.velocity.vx = 0;
            this.position.x = levelLeft - (this.width / 2 - this.box.toLeft);
        }
        else if (right + this.velocity.vx > levelRight) {
            this.velocity.vx = 0;
            this.position.x = levelRight - (this.width / 2 + this.box.toRight);
        }
        else {
            this.position.x += this.velocity.vx;
        }
        this.updateAnimation();
    }
    takeDamage(damage) {
        (0, logger_1.logDamage)(`health=${this.health} damage=${damage}`);
        this.health -= damage;
        (0, logger_1.logDamage)(`health=${this.health}`);
        if (this.health <= 0) {
            this.health = 0;
            this.releaseAllPressures();
            this.switchAnimation(FighterAnimation.death);
        }
        else {
            this.switchAnimation(FighterAnimation.takeHit);
        }
    }
}
exports.Fighter = Fighter;
Fighter.ANIMATION = FighterAnimation;


/***/ }),

/***/ "./src/FightingScene.ts":
/*!******************************!*\
  !*** ./src/FightingScene.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FightingScene = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
const StatusBar_1 = __webpack_require__(/*! ./StatusBar */ "./src/StatusBar.ts");
const Fighter_1 = __webpack_require__(/*! ./Fighter */ "./src/Fighter.ts");
const logger_1 = __webpack_require__(/*! ./logger */ "./src/logger.ts");
const Collision_1 = __webpack_require__(/*! ./Collision */ "./src/Collision.ts");
class FightingScene extends pixi_js_1.Container {
    constructor(options) {
        super();
        this.gravity = 0.7;
        this.floorY = 480;
        this.shopSettings = {
            animationSpeed: 0.1,
            scale: 2.75,
            x: 600,
            y: 128
        };
        this.overlaySettings = {
            color: 0xffffff,
            alpha: 0.15
        };
        this.foregroundSettings = {
            size: 16,
            color: 0xffffff
        };
        this.player1Options = {
            initialPosition: {
                x: 10,
                y: -100
            }
        };
        this.player2Options = {
            initialPosition: {
                x: 400,
                y: -123
            }
        };
        this.handlePlayer1StartMove = (e) => {
            this.handlePlayer1Move(this.player1, true, e);
        };
        this.handlePlayer1KeepMove = (e) => {
            this.handlePlayer1Move(this.player1, undefined, e);
        };
        this.handlePlayer1StopMove = (e) => {
            this.handlePlayer1Move(this.player1, false, e);
        };
        this.handlePlayer2StartMove = (e) => {
            this.handlePlayer1Move(this.player2, true, e);
        };
        this.handlePlayer2KeepMove = (e) => {
            this.handlePlayer1Move(this.player2, undefined, e);
        };
        this.handlePlayer2StopMove = (e) => {
            this.handlePlayer1Move(this.player2, false, e);
        };
        this.handleKeyDown = (e) => {
            const { player1, player2 } = this;
            (0, logger_1.logKeydown)(`${e.code} ${e.key}`);
            switch (e.code) {
                case 'KeyW':
                    player1.setTopDirectionPressed(true);
                    break;
                case 'KeyA':
                    player1.setLeftDirectionPressed(true);
                    break;
                case 'KeyS':
                case 'Space':
                case 'ShiftLeft':
                    player1.setBottomDirectionPressed(true);
                    break;
                case 'KeyD':
                    player1.setRightDirectionPressed(true);
                    break;
            }
            switch (e.code) {
                case 'ArrowUp':
                    player2.setTopDirectionPressed(true);
                    break;
                case 'ArrowLeft':
                    player2.setLeftDirectionPressed(true);
                    break;
                case 'ArrowDown':
                case 'Numpad0':
                case 'ShiftRight':
                    player2.setBottomDirectionPressed(true);
                    break;
                case 'ArrowRight':
                    player2.setRightDirectionPressed(true);
                    break;
            }
        };
        this.handleKeyUp = (e) => {
            const { player1, player2 } = this;
            (0, logger_1.logKeyup)(`${e.code} ${e.key}`);
            switch (e.code) {
                case 'KeyW':
                    player1.setTopDirectionPressed(false);
                    break;
                case 'KeyA':
                    player1.setLeftDirectionPressed(false);
                    break;
                case 'KeyS':
                    player1.setBottomDirectionPressed(false);
                    break;
                case 'KeyD':
                    player1.setRightDirectionPressed(false);
                    break;
            }
            switch (e.code) {
                case 'ArrowUp':
                    player2.setTopDirectionPressed(false);
                    break;
                case 'ArrowLeft':
                    player2.setLeftDirectionPressed(false);
                    break;
                case 'ArrowDown':
                    player2.setBottomDirectionPressed(false);
                    break;
                case 'ArrowRight':
                    player2.setRightDirectionPressed(false);
                    break;
            }
        };
        this.setup(options);
        this.draw(options);
        this.setupFighters();
        this.addEventLesteners();
    }
    setup({ viewWidth, viewHeight, player1Textures, player2Textures, textures: { backgroundTexture, shopTexture } }) {
        this.player1 = new Fighter_1.Fighter({
            attackDamage: 25,
            attackFrame: 4,
            moveSpeed: 5,
            jumpSpeed: 20,
            box: {
                toTop: 70,
                toRight: 30,
                toBottom: 55,
                toLeft: 30
            },
            textures: player1Textures,
            texturesOptions: {
                offset: {
                    x: 16,
                    y: 67
                }
            },
            attackOptions: {
                offset: {
                    x: 125,
                    y: 53
                },
                width: 65,
                height: 66
            }
        });
        this.player2 = new Fighter_1.Fighter({
            attackDamage: 12,
            attackFrame: 2,
            moveSpeed: 6,
            jumpSpeed: 22,
            box: {
                toTop: 70,
                toRight: 17,
                toBottom: 70,
                toLeft: 27
            },
            textures: player2Textures,
            texturesOptions: {
                offset: {
                    x: 16,
                    y: 67
                }
            },
            attackOptions: {
                offset: {
                    x: 16,
                    y: 67
                },
                width: 55,
                height: 60
            }
        });
        const { shopSettings } = this;
        const background = new pixi_js_1.Sprite(backgroundTexture);
        this.addChild(background);
        this.background = background;
        const shop = new pixi_js_1.AnimatedSprite(shopTexture);
        shop.animationSpeed = shopSettings.animationSpeed;
        shop.play();
        shop.scale.set(shopSettings.scale);
        shop.position.x = shopSettings.x;
        shop.position.y = shopSettings.y;
        this.addChild(shop);
        this.shop = shop;
        const overlay = new pixi_js_1.Graphics();
        this.addChild(overlay);
        this.overlay = overlay;
        const statusBar = new StatusBar_1.StatusBar({});
        this.addChild(statusBar);
        this.statusBar = statusBar;
        const foreground = new pixi_js_1.Container();
        foreground.visible = false;
        const foregroundText = new pixi_js_1.Text('...', {
            fontFamily: 'Press Start 2P',
            fontSize: this.foregroundSettings.size,
            fill: this.foregroundSettings.color
        });
        foregroundText.anchor.set(0.5, 0.5);
        foregroundText.position.set(this.width / 2, this.height / 2);
        this.foregroundText = foregroundText;
        foreground.addChild(foregroundText);
        this.addChild(foreground);
        this.foreground = foreground;
    }
    draw(_) {
        this.overlay.beginFill(this.overlaySettings.color);
        this.overlay.drawRect(0, 0, this.background.width, this.background.height);
        this.overlay.endFill();
        this.overlay.alpha = this.overlaySettings.alpha;
    }
    setupFighters() {
        this.addChild(this.player1);
        this.addChild(this.player2);
    }
    handleResize({ viewWidth, viewHeight }) {
        const availableWidth = viewWidth;
        const availableHeight = viewHeight;
        const totalWidth = this.background.width;
        const totalHeight = this.background.height;
        let scale = 1;
        if (totalHeight >= totalWidth) {
            scale = availableHeight / totalHeight;
            if (scale * totalWidth > availableWidth) {
                scale = availableWidth / totalWidth;
            }
            (0, logger_1.logLayout)(`By height (sc=${scale})`);
        }
        else {
            scale = availableWidth / totalWidth;
            (0, logger_1.logLayout)(`By width (sc=${scale})`);
            if (scale * totalHeight > availableHeight) {
                scale = availableHeight / totalHeight;
            }
        }
        const occupiedWidth = Math.floor(totalWidth * scale);
        const occupiedHeight = Math.floor(totalHeight * scale);
        const x = availableWidth > occupiedWidth ? (availableWidth - occupiedWidth) / 2 : 0;
        const y = availableHeight > occupiedHeight ? (availableHeight - occupiedHeight) / 2 : 0;
        (0, logger_1.logLayout)(`aw=${availableWidth} (ow=${occupiedWidth}) x=${x} ah=${availableHeight} (oh=${occupiedHeight}) y=${y}`);
        this.x = x;
        this.width = occupiedWidth;
        this.y = y;
        this.height = occupiedHeight;
        (0, logger_1.logLayout)(`x=${x} y=${y} w=${this.width} h=${this.height}`);
    }
    handleUpdate(deltaMS) {
        [this.player1, this.player2].forEach(player => {
            player.update({
                gravity: this.gravity,
                levelLeft: 0,
                levelRight: this.background.width,
                levelBottom: this.floorY
            });
        });
        const isAliveBoth = this.player1.health > 0 && this.player2.health > 0;
        if (isAliveBoth) {
            this.statusBar.update(deltaMS);
        }
        if (isAliveBoth &&
            this.player1.attackHitAvailable && !this.player1.attackHitProcessed) {
            this.player1.attackHitProcessed = true;
            const p1AttackBounds = this.player1.toAttackBounds();
            const p2Bounds = this.player2.toBounds();
            const intersectionSquare = Collision_1.Collision.checkCollision(p1AttackBounds, p2Bounds);
            (0, logger_1.logDamage)(`inter=${intersectionSquare}`);
            if (intersectionSquare >= 0.05) {
                this.player2.takeDamage(Math.round(intersectionSquare * this.player1.attackDamage));
                this.statusBar.updatePlayer2Health(this.player2.health);
            }
        }
        if (isAliveBoth &&
            this.player2.attackHitAvailable && !this.player2.attackHitProcessed) {
            this.player2.attackHitProcessed = true;
            const p2AttackBounds = this.player2.toAttackBounds();
            const p1Bounds = this.player1.toBounds();
            const intersectionSquare = Collision_1.Collision.checkCollision(p2AttackBounds, p1Bounds);
            (0, logger_1.logDamage)(`inter=${intersectionSquare}`);
            if (intersectionSquare >= 0.05) {
                this.player1.takeDamage(Math.round(intersectionSquare * this.player2.attackDamage));
                this.statusBar.updatePlayer1Health(this.player1.health);
            }
        }
        this.checkEndFight();
    }
    handleMounted() {
        Promise.resolve().then(() => {
            this.startFighters();
        }).catch(console.error);
    }
    startFighters() {
        const { player1, player1Options, player2, player2Options } = this;
        player1.position = player1Options.initialPosition;
        player2.position = player2Options.initialPosition;
    }
    addEventLesteners() {
        this.background.interactive = true;
        this.on('mousedown', this.handlePlayer1StartMove);
        this.on('mousemove', this.handlePlayer1KeepMove);
        this.on('mouseup', this.handlePlayer1StopMove);
        this.on('touchstart', this.handlePlayer2StartMove);
        this.on('touchmove', this.handlePlayer2KeepMove);
        this.on('touchend', this.handlePlayer2StopMove);
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }
    removeEventListeners() {
        this.background.interactive = false;
        this.off('mousedown', this.handlePlayer1StartMove);
        this.off('mousemove', this.handlePlayer1KeepMove);
        this.off('mouseup', this.handlePlayer1StopMove);
        this.off('touchstart', this.handlePlayer2StartMove);
        this.off('touchmove', this.handlePlayer2KeepMove);
        this.off('touchend', this.handlePlayer2StopMove);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
    handlePlayer1Move(player, pressed, e) {
        const point = this.background.toLocal(e.global);
        (0, logger_1.logPointerEvent)(`${e.type} px=${point.x} py=${point.y}`);
        player.handleMove(pressed, point.x, point.y);
    }
    checkEndFight() {
        if (this.player1.isDying() || this.player2.isDying() || this.statusBar.time <= 0) {
            this.foreground.visible = true;
            if (this.player1.health === this.player2.health) {
                this.foregroundText.text = 'Tie';
            }
            else if (this.player1.health > this.player2.health) {
                this.foregroundText.text = 'Player 1 Wins';
            }
            else if (this.player1.health < this.player2.health) {
                this.foregroundText.text = 'Player 2 Wins';
            }
        }
        if (this.player1.isDead || this.player2.isDead) {
            this.removeEventListeners();
        }
    }
}
exports.FightingScene = FightingScene;


/***/ }),

/***/ "./src/HealthBar.ts":
/*!**************************!*\
  !*** ./src/HealthBar.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthBar = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
class HealthBar extends pixi_js_1.Container {
    constructor(options) {
        super();
        this.boxOptions = {
            border: 0xffffff,
            borderThick: 4,
            width: 442,
            height: 38,
            fill: 0x818cf8,
            empty: 0xff0000
        };
        this.setup(options);
        this.draw(options);
    }
    setup(_) {
        this.borderBox = new pixi_js_1.Graphics();
        this.addChild(this.borderBox);
        const bars = new pixi_js_1.Container();
        bars.rotation = Math.PI;
        bars.position.set(this.boxOptions.width, this.boxOptions.height - this.boxOptions.borderThick);
        this.emptyBar = new pixi_js_1.Graphics();
        bars.addChild(this.emptyBar);
        const fillBar = new pixi_js_1.Graphics();
        bars.addChild(fillBar);
        this.fillBar = fillBar;
        this.addChild(bars);
    }
    draw(_) {
        const { borderBox, boxOptions, fillBar, emptyBar } = this;
        borderBox.beginFill(boxOptions.border);
        borderBox.drawRect(0, 0, boxOptions.width, boxOptions.height);
        borderBox.endFill();
        emptyBar.beginFill(boxOptions.empty);
        emptyBar.drawRect(0, 0, boxOptions.width - boxOptions.borderThick, boxOptions.height - 2 * boxOptions.borderThick);
        emptyBar.endFill();
        fillBar.beginFill(boxOptions.fill);
        fillBar.drawRect(0, 0, boxOptions.width - boxOptions.borderThick, boxOptions.height - 2 * boxOptions.borderThick);
        fillBar.endFill();
    }
    setBetween(between) {
    }
}
exports.HealthBar = HealthBar;


/***/ }),

/***/ "./src/LoaderScene.ts":
/*!****************************!*\
  !*** ./src/LoaderScene.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoaderScene = exports.manifest = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
const logger_1 = __webpack_require__(/*! ./logger */ "./src/logger.ts");
exports.manifest = {
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
};
class LoaderScene extends pixi_js_1.Container {
    constructor(_) {
        super();
        this.barOptions = {
            width: 350,
            height: 40,
            fillColor: 0x008800,
            borderRadius: 5,
            borderThick: 5,
            borderColor: 0x000000
        };
        this.downloadProgress = (progressRatio) => {
            this.loaderBarFill.width = (this.barOptions.width - this.barOptions.borderThick * 2) * progressRatio;
        };
        this.setup();
        this.draw();
    }
    setup() {
        const loaderBarBorder = new pixi_js_1.Graphics();
        this.addChild(loaderBarBorder);
        this.loaderBarBorder = loaderBarBorder;
        const loaderBarFill = new pixi_js_1.Graphics();
        this.addChild(loaderBarFill);
        this.loaderBarFill = loaderBarFill;
    }
    draw() {
        const { loaderBarFill, loaderBarBorder, barOptions } = this;
        loaderBarBorder.beginFill(barOptions.borderColor);
        loaderBarBorder.drawRoundedRect(0, 0, barOptions.width, barOptions.height, barOptions.borderRadius);
        loaderBarBorder.endFill();
        loaderBarFill.beginFill(barOptions.fillColor);
        loaderBarFill.drawRoundedRect(barOptions.borderThick, barOptions.borderThick, barOptions.width - barOptions.borderThick * 2, barOptions.height - barOptions.borderThick * 2, barOptions.borderRadius);
        loaderBarFill.endFill();
    }
    async initializeLoader() {
        await pixi_js_1.Assets.init({ manifest: exports.manifest });
        await pixi_js_1.Assets.loadBundle(exports.manifest.bundles.map(bundle => bundle.name), this.downloadProgress);
    }
    getAssets() {
        return {
            spritesheet: pixi_js_1.Assets.get('spritesheet'),
            backgroundTexture: pixi_js_1.Assets.get('background'),
            font: pixi_js_1.Assets.get('font')
        };
    }
    handleResize({ viewWidth, viewHeight }) {
        const availableWidth = viewWidth;
        const availableHeight = viewHeight;
        const totalWidth = this.width;
        const totalHeight = this.height;
        if (availableWidth >= totalWidth && availableHeight >= totalHeight) {
            const x = availableWidth > totalWidth ? (availableWidth - totalWidth) / 2 : 0;
            const y = availableHeight > totalHeight ? (availableHeight - totalHeight) / 2 : 0;
            (0, logger_1.logLayout)(`Spacing aw=${availableWidth} tw=${totalWidth} ah=${availableHeight} th=${totalHeight}`);
            this.x = x;
            this.width = this.barOptions.width;
            this.y = y;
            this.height = this.barOptions.height;
        }
        else {
            let scale = 1;
            if (totalHeight >= totalWidth) {
                scale = availableHeight / totalHeight;
                if (scale * totalWidth > availableWidth) {
                    scale = availableWidth / totalWidth;
                }
                (0, logger_1.logLayout)(`By height (sc=${scale})`);
            }
            else {
                scale = availableWidth / totalWidth;
                (0, logger_1.logLayout)(`By width (sc=${scale})`);
                if (scale * totalHeight > availableHeight) {
                    scale = availableHeight / totalHeight;
                }
            }
            const occupiedWidth = Math.floor(totalWidth * scale);
            const occupiedHeight = Math.floor(totalHeight * scale);
            const x = availableWidth > occupiedWidth ? (availableWidth - occupiedWidth) / 2 : 0;
            const y = availableHeight > occupiedHeight ? (availableHeight - occupiedHeight) / 2 : 0;
            (0, logger_1.logLayout)(`aw=${availableWidth} (ow=${occupiedWidth}) ah=${availableHeight} (oh=${occupiedHeight})`);
            this.x = x;
            this.width = occupiedWidth;
            this.y = y;
            this.height = occupiedHeight;
        }
        (0, logger_1.logLayout)(`x=${this.x} y=${this.y} w=${this.width} h=${this.height}`);
    }
    handleMounted() {
    }
    handleUpdate() {
    }
}
exports.LoaderScene = LoaderScene;


/***/ }),

/***/ "./src/SceneManager.ts":
/*!*****************************!*\
  !*** ./src/SceneManager.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SceneManager = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
const logger_1 = __webpack_require__(/*! ./logger */ "./src/logger.ts");
class DefaultScene extends pixi_js_1.Container {
    handleMounted() {
    }
    handleUpdate() {
    }
    handleResize() {
    }
}
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class SceneManager {
    constructor() { }
    static get width() {
        // return Math.max(document.documentElement.clientWidth, window.innerWidth ?? 0)
        return window.innerWidth;
    }
    static get height() {
        // return Math.max(document.documentElement.clientHeight, window.innerHeight ?? 0)
        return window.innerHeight;
    }
    static async initialize() {
        var _a;
        const app = new pixi_js_1.Application({
            autoDensity: true,
            resolution: (_a = window.devicePixelRatio) !== null && _a !== void 0 ? _a : 1,
            width: SceneManager.width,
            height: SceneManager.height,
            backgroundColor: SceneManager.backgroundColor,
            resizeTo: window
        });
        document.body.appendChild(app.view);
        if (logger_1.logApp.enabled) {
            (0, logger_1.logApp)('window.app initialized!');
            window.app = app;
        }
        SceneManager.app = app;
        SceneManager.setupEventLesteners();
        // Manager.initializeAssetsPromise = Assets.init({ manifest: manifest });
        // Manager.initializeAssetsPromise.then(() => Assets.backgroundLoadBundle(manifest.bundles.map(b => b.name)));
    }
    static setupEventLesteners() {
        window.addEventListener('resize', SceneManager.resizeDeBounce);
        SceneManager.app.ticker.add(SceneManager.updateHandler);
    }
    static async changeScene(newScene) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        SceneManager.app.stage.removeChild(SceneManager.currentScene);
        SceneManager.currentScene.destroy();
        // await Assets.loadBundle(newScene.assetBundles)
        // we now store it and show it, as it is completely created
        SceneManager.currentScene = newScene;
        SceneManager.app.stage.addChild(SceneManager.currentScene);
        SceneManager.currentScene.handleMounted();
        SceneManager.resizeHandler();
    }
    static resizeDeBounce() {
        SceneManager.cancelScheduledResizeHandler();
        SceneManager.scheduleResizeHandler();
    }
    static cancelScheduledResizeHandler() {
        clearTimeout(SceneManager.resizeTimeoutId);
    }
    static scheduleResizeHandler() {
        SceneManager.resizeTimeoutId = setTimeout(() => {
            SceneManager.cancelScheduledResizeHandler();
            SceneManager.resizeHandler();
        }, SceneManager.resizeTimeout);
    }
    static resizeHandler() {
        SceneManager.currentScene.handleResize({
            viewWidth: SceneManager.width,
            viewHeight: SceneManager.height
        });
    }
    static updateHandler() {
        SceneManager.currentScene.handleUpdate(SceneManager.app.ticker.deltaMS);
    }
}
exports.SceneManager = SceneManager;
SceneManager.currentScene = new DefaultScene();
SceneManager.resizeTimeout = 300;
SceneManager.totalWidth = 1024;
SceneManager.totalHeight = 576;
SceneManager.backgroundColor = 0xe6e7ea;


/***/ }),

/***/ "./src/StatusBar.ts":
/*!**************************!*\
  !*** ./src/StatusBar.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatusBar = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
const gsap_1 = __importDefault(__webpack_require__(/*! gsap */ "./node_modules/gsap/index.js"));
const HealthBar_1 = __webpack_require__(/*! ./HealthBar */ "./src/HealthBar.ts");
class StatusBar extends pixi_js_1.Container {
    constructor(options) {
        super();
        this.barOptions = {
            padding: 20,
            healthPadding: 6,
            healthWidth: 442
        };
        this.time = 90 * 1000;
        this.timerBoxOptions = {
            textSize: 16,
            text: 0xffffff,
            fill: 0x000000,
            border: 0xffffff,
            borderThick: 4,
            width: 100,
            height: 50
        };
        this.setup(options);
        this.draw(options);
    }
    setup(_) {
        const { barOptions, timerBoxOptions } = this;
        this.timerBox = new pixi_js_1.Graphics();
        this.addChild(this.timerBox);
        const timerText = new pixi_js_1.Text(String(Math.round(this.time / 1000)), {
            fontFamily: 'Press Start 2P',
            fontSize: this.timerBoxOptions.textSize,
            fill: this.timerBoxOptions.text
        });
        timerText.anchor.set(0.5, 0.5);
        timerText.position.set(barOptions.padding + barOptions.healthWidth + timerBoxOptions.width / 2, barOptions.padding + timerBoxOptions.height / 2);
        this.addChild(timerText);
        this.timerText = timerText;
        const player1HealthBar = new HealthBar_1.HealthBar({});
        player1HealthBar.position.set(barOptions.padding, barOptions.padding + barOptions.healthPadding);
        this.addChild(player1HealthBar);
        this.player1HealthBar = player1HealthBar;
        const player2HealthBar = new HealthBar_1.HealthBar({});
        player2HealthBar.rotation = Math.PI;
        player2HealthBar.position.set(barOptions.padding + barOptions.healthWidth * 2 + timerBoxOptions.width, barOptions.padding + barOptions.healthPadding + player2HealthBar.height);
        this.addChild(player2HealthBar);
        this.player2HealthBar = player2HealthBar;
    }
    draw(_) {
        const { barOptions, timerBox, timerBoxOptions } = this;
        timerBox.beginFill(timerBoxOptions.border);
        timerBox.drawRect(barOptions.padding + barOptions.healthWidth, barOptions.padding, timerBoxOptions.width, timerBoxOptions.height);
        timerBox.endFill();
        timerBox.beginFill(timerBoxOptions.fill);
        timerBox.drawRect(barOptions.padding + barOptions.healthWidth + timerBoxOptions.borderThick, barOptions.padding + timerBoxOptions.borderThick, timerBoxOptions.width - 2 * timerBoxOptions.borderThick, timerBoxOptions.height - 2 * timerBoxOptions.borderThick);
        timerBox.endFill();
    }
    update(deltaMS) {
        this.time -= deltaMS;
        if (this.time < 0) {
            this.time = 0;
        }
        this.timerText.text = Math.round(this.time / 1000);
    }
    updatePlayer1Health(health) {
        if (health <= 0) {
            health = 0;
        }
        else if (health >= 100) {
            health = 100;
        }
        gsap_1.default.to(this.player1HealthBar.fillBar, {
            width: this.player1HealthBar.boxOptions.width * health / 100
        });
    }
    updatePlayer2Health(health) {
        if (health <= 0) {
            health = 0;
        }
        else if (health >= 100) {
            health = 100;
        }
        gsap_1.default.to(this.player2HealthBar.fillBar, {
            width: this.player2HealthBar.boxOptions.width * health / 100
        });
    }
}
exports.StatusBar = StatusBar;


/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./styles.css */ "./src/styles.css");
const SceneManager_1 = __webpack_require__(/*! ./SceneManager */ "./src/SceneManager.ts");
const FightingScene_1 = __webpack_require__(/*! ./FightingScene */ "./src/FightingScene.ts");
const LoaderScene_1 = __webpack_require__(/*! ./LoaderScene */ "./src/LoaderScene.ts");
async function run() {
    const ellipsis = document.querySelector('.ellipsis');
    if (ellipsis != null) {
        ellipsis.style.display = 'none';
    }
    await SceneManager_1.SceneManager.initialize();
    const loaderScene = new LoaderScene_1.LoaderScene({
        viewWidth: SceneManager_1.SceneManager.width,
        viewHeight: SceneManager_1.SceneManager.height
    });
    await SceneManager_1.SceneManager.changeScene(loaderScene);
    await loaderScene.initializeLoader();
    const { backgroundTexture, spritesheet: { animations } } = loaderScene.getAssets();
    await SceneManager_1.SceneManager.changeScene(new FightingScene_1.FightingScene({
        viewWidth: SceneManager_1.SceneManager.width,
        viewHeight: SceneManager_1.SceneManager.height,
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
    }));
}
run().catch(console.error);


/***/ }),

/***/ "./src/logger.ts":
/*!***********************!*\
  !*** ./src/logger.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logDamage = exports.logKeyup = exports.logKeydown = exports.logFighterMove = exports.logFighterGravity = exports.logFighterBounds = exports.logAttackBox = exports.logPointerEvent = exports.logMoveInterface = exports.logRectCollision = exports.logLayout = exports.logApp = void 0;
const debug_1 = __importDefault(__webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js"));
exports.logApp = (0, debug_1.default)('fighting-app');
exports.logLayout = (0, debug_1.default)('fighting-layout');
exports.logRectCollision = (0, debug_1.default)('fighting-rect-collision');
exports.logMoveInterface = (0, debug_1.default)('fighting-move-interface');
exports.logPointerEvent = (0, debug_1.default)('fighting-pointer-event');
exports.logAttackBox = (0, debug_1.default)('fighting-attack-box');
exports.logFighterBounds = (0, debug_1.default)('fighting-fighter-bounds');
exports.logFighterGravity = (0, debug_1.default)('fighting-fighter-gravity');
exports.logFighterMove = (0, debug_1.default)('fighting-fighter-move');
exports.logKeydown = (0, debug_1.default)('fighting-keydown');
exports.logKeyup = (0, debug_1.default)('fighting-keyup');
exports.logDamage = (0, debug_1.default)('fighting-fighter-damage');


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksimple_html5_fighting_game"] = self["webpackChunksimple_html5_fighting_game"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.bundle.js.map