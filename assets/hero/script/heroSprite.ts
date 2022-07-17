// import { test } from '../../scene/script/commonUtil';
import HeroNode from './heroNode';
import { HeroState } from './heroTypes';
const {ccclass, property} = cc._decorator;

enum HeroToward {
    Left = -1,
    Right = 1
}

enum HeroAnimation {
    Stand = "stand",
    Run = "run",
    NormalAtkA = "atk_a",
    NormalAtkB = "atk_b",
    BlastAtk = "atkBlast",
    Jump = "jump",
    Dash = "dash",
    Fail = "fail",
    Landing = "landing",
    Die = "die",
    Revive = "revive"
}

const stateAnimationMap = {
    'stand': HeroAnimation.Stand,
    'run': HeroAnimation.Run,
    'blastAtk': HeroAnimation.BlastAtk,
    'jump': HeroAnimation.Jump,
    'dash': HeroAnimation.Dash,
    'fail': HeroAnimation.Fail,
    'landing': HeroAnimation.Landing,
    'die': HeroAnimation.Die,
    "revive": HeroAnimation.Revive
}

// 重力
const g = 10;

@ccclass
export default class HeroSprite extends cc.Component {

    // 远程攻击效果预设
    @property(cc.Prefab)
    blastPrefab: cc.Prefab = null;

    // 冲刺效果预设
    @property(cc.Prefab)
    dashPrefab: cc.Prefab = null;

    // 移动速度
    @property
    maxMovingSpeed: number = 0;

    // 跳跃力度
    @property
    maxJumpPower: number = 0;

    @property
    maxDashSpeed: number = 0;

    // 攻击力
    @property
    attack: number = 0;

    // 最大生命值
    @property
    heroMaxHp: number = 0;

    @property(cc.Material)
    flashMaterial: cc.Material = null;

    @property(cc.Material)
    flashEndMaterial: cc.Material = null;

    @property(cc.Node)
    camera: cc.Node = null;

    @property
    currScene: string = 'main';

    @property(cc.Node)
    audio: cc.Node = null;

    private heroNode: cc.Node = null;

    private heroNodeScript: HeroNode = null;

    // 动画组件
    private animation: cc.Animation = null;

    // 英雄状态: 静止，奔跑等...
    private heroState: HeroState = HeroState.Stand;

    // 当前生命值
    private heroCurrHp: number = 0;

    // 朝向，由 左右 btn 传入更改
    private heroToward: HeroToward = HeroToward.Right;

    //　奔跑速度
    private heroRunspeed: number = 0;

    //　跳跃速度
    private jumpPower: number = 0;

    // 冲刺速度
    private dashSpeed: number = 0;

    // 普通攻击移动幅度递减量
    private heroDashMoveDecrease: number = 0;

    // 普通攻击时向前位移距离，递减
    private heroAtkMoveForce: number = 0;

    // 普通攻击移动幅度递减量
    private heroAtkMoveForceDecrease: number = 0;

    //　普通攻击次序
    private heroNormalAtkOrder:number = 0;

    // 普通攻击 cd
    private heroNormalAtkCd: number = 0;

    // 是否能够普通攻击
    private isNormalAtkConsition: boolean = false;

    // 远程攻击 cd
    private heroBlastAtkCd: number = 0;

    // 是否能够远程攻击
    private isBlastAtkConsition: boolean = false;

    // 冲刺 cd
    private heroDashCd: number = 0;

    // 是否能够冲刺
    private isDashConsition: boolean = false;

    // 远程攻击条件
    private isBlastConsition: boolean = false;

    private isRuning: boolean = false;

    private isListenHeroFail: boolean = false;

    private heroHp: number = 0;

    private isTouchPlaform: boolean = false;

    // 触发浮空特技，空中攻击或者空中冲刺
    private isFloatingStunt: boolean = false;

    onLoad () {
        // 获取各项组件
        this.animation = this.node.getComponent(cc.Animation);
        this.heroNode = cc.find('Game/heroNode');
        this.heroNodeScript = this.heroNode.getComponent('heroNode');

        // 设置普通攻击移动距离递减量
        this.setHeroAtkMoveForceDecrease(0.2);
        this.isNormalAtkConsition = true;
        this.isBlastAtkConsition = true;
        this.isDashConsition = true;
        this.heroNormalAtkCd = 400;
        this.heroBlastAtkCd = 2000;
        this.heroDashCd = 2000;
        this.heroAtkMoveForce = 100;
        this.heroAtkMoveForceDecrease = 10;
        this.heroDashMoveDecrease = 10;

        this.heroHp = this.heroMaxHp;
    }

    // 完成某项动作时触发
    finish() {
        // 如果完成某项动作时，处于浮空特技状态，则取消浮空特技状态
        if (this.isFloatingStunt) {
            this.isFloatingStunt = false;
        }
        if (!this.isRuning) {
            this.heroStand();
            return
        }
        // 继续奔跑
        this.heroRun(this.heroToward);
    }

    // 重置各项数据值为初始值
    stateDataReset() {
        this.heroRunspeed = 0;
        this.dashSpeed = 0;
        this.heroAtkMoveForce = 0;
    }

    // 设置状态，同时触发对应动画效果
    setHeroState(state: HeroState) {
        this.heroState = state;
        this.switchHeroAnimationByState();
    }
    
    // 设置英雄朝向或静止
    setHeroToward(LR: HeroToward) {
        this.heroToward = LR;
        this.node.scaleX = this.heroToward;
    }

    // 设置英雄攻击时向前移动的幅度
    setHeroAtkMoveForce(force: number) {
        this.heroAtkMoveForce = force;
    }

    // 获取英雄当前运动状态
    getHeroState() {
        return this.heroState;
    }

    // 获取当前英雄朝向
    getHeroToward() {
        return this.heroToward;
    }

    // 获取英雄攻击时唯一幅度
    getHeroAtkMoveForce() {
        return this.heroAtkMoveForce;
    }

    // 获取英雄奔跑时每一帧的移动距离
    getHeroRunMoveDtDistance(): number {
        return this.getHeroToward() * this.heroRunspeed;
    }

    // 获取英雄攻击时每一帧的移动距离
    getHeroAtkMoveDtDistance(): number {
        return this.getHeroToward() * this.heroAtkMoveForce;
    }

    // 播放英雄运动动画
    playHeroAnimation(animation: HeroAnimation) {
        this.animation.play(animation);
    }

    // 设置英雄攻击时的移动递减量
    setHeroAtkMoveForceDecrease(heroAtkMoveForceDecrease) {
        this.heroAtkMoveForceDecrease = heroAtkMoveForceDecrease;
    }

    // 普通攻击逐渐停止移动
    heroAtkDtDecrease() {
        if (this.heroAtkMoveForce > 0) {
            this.heroAtkMoveForce -= this.heroAtkMoveForceDecrease;
        } else {
            this.stateDataReset();
        }
    }

    getHeroDashMoveDtDistance() {
        return this.heroToward * this.dashSpeed;
    }

    // 冲锋逐渐停止
    heroDashDtDecrease() {
        if (this.dashSpeed > 0) {
            this.dashSpeed -= this.heroDashMoveDecrease;
        } else {
            this.stateDataReset();
        }
    }

    // 获取每一帧英雄在X轴上的移动距离，与奔跑，攻击有关
    getHeroMoveDtDistance(): number {
        let distance = 0;

        // 移动状态下的位移计算，包含正常移动与跳跃移动
        if (this.heroState !== HeroState.Dash && this.heroState !== HeroState.NormalAtk) {
            distance = this.getHeroRunMoveDtDistance();
        }

        // 普通攻击情况下的位移计算
        if (this.heroState === HeroState.NormalAtk) {
            distance = this.getHeroAtkMoveDtDistance();
            // 递减降速
            this.heroAtkDtDecrease();
        }

        // 冲刺状态下的位移计算
        if (this.heroState === HeroState.Dash) {
            distance = this.getHeroDashMoveDtDistance();
            // 递减降速
            this.heroDashDtDecrease();
        }
        return distance;
    }

    // 获取每一帧英雄在Y轴上的移动距离，与跳跃，降落有关
    getHeroJumpDtDistance(): number {
        let distance = 0;
        if (this.isFloating()) {
            distance = this.jumpPower;
            this.jumpPower -= g;
        }
        return distance;
    }

    //　播放英雄普通攻击动画
    playHeroOtherAnimation() {
        this.playHeroNormalAtkAnimation()
    }

    playHeroNormalAtkAnimation() {
        if (this.heroState === HeroState.NormalAtk) {
            if (this.heroNormalAtkOrder === 0) {
                this.heroNormalAtkOrder = 1;
                this.playHeroAnimation(HeroAnimation.NormalAtkA);
                // 默认恢复
                setTimeout(() => {
                    this.heroNormalAtkOrder = 0;
                }, 1000);
                return;
            }

            if (this.heroNormalAtkOrder === 1) {
                this.playHeroAnimation(HeroAnimation.NormalAtkB);
                this.heroNormalAtkOrder = 0;
                return;
            }
        }
    }

    //　通过英雄当前状态切换运动动画
    switchHeroAnimationByState() {
        if (stateAnimationMap[this.heroState]) {
            this.playHeroAnimation(stateAnimationMap[this.heroState]);
        } else {
            // 无一般映射关系动画特别处理
            this.playHeroOtherAnimation();
        }        
    }

    isFloating() {
        let isFloating = false;
        // 普通状态判断
        if (this.getHeroState() === HeroState.Jump || this.getHeroState() === HeroState.Fail) {
            isFloating = true;
        } else if (this.heroNodeScript.getHeroNodeY() > 0 && !this.isTouchPlaform) {
            // 不在地面上，不在平台上，则为浮空
            isFloating = true;
        }
        return isFloating;
    }

    //　执行英雄跳跃命令
    heroJump() {
        // 跳跃过程中不能再次跳跃
        if (!this.isFloating()) {
            this.stateDataReset();
            this.node.emit('hero:blastAtkConsitionDisabled');
            // 每次跳跃时赋予初始速度;
            this.jumpPower = this.maxJumpPower;
            if (this.isRuning) {
                this.heroRunspeed = this.maxMovingSpeed * 0.8;
            }
            this.setHeroState(HeroState.Jump);
            this.audio.getChildByName('jump').getComponent(cc.AudioSource).play();

            this.isTouchPlaform = false;
        }
    }

    //　执行英雄普通攻击命令, 补充攻击向前移动
    heroNormalAtk() {
        // 这里的属性和方法可以继续抽象一下
        if (this.isNormalAtkConsition) {
            this.isNormalAtkConsition = false;
            setTimeout(() => {
                this.isNormalAtkConsition = true;
            }, this.heroNormalAtkCd);
            this.stateDataReset();
            this.setHeroState(HeroState.NormalAtk);
            this.audio.getChildByName('sword').getComponent(cc.AudioSource).play();
        }
    }

    //　执行英雄向前冲刺命令
    heroDash() {
        if (this.isDashConsition) {
            this.isDashConsition = false;
            this.node.emit('hero:dashAtkConsitionDisabled');
            setTimeout(() => {
                this.isDashConsition = true;
                this.node.emit('hero:dashAtkConsitionActiva');
            }, this.heroDashCd);
            this.stateDataReset();
            this.addDashEffect();
            this.dashSpeed = this.maxDashSpeed;
            this.setHeroState(HeroState.Dash);
            this.audio.getChildByName('dash').getComponent(cc.AudioSource).play();
        }
    }

    //　执行英雄远程攻击命令
    heroBlastAtk() {
        if (this.isBlastAtkConsition) {
            this.isBlastAtkConsition = false;
            this.node.emit('hero:blastAtkConsitionDisabled');
            setTimeout(() => {
                this.isBlastAtkConsition = true;
                this.node.emit('hero:blastAtkConsitionActiva');
            }, this.heroBlastAtkCd);
            this.stateDataReset();
            this.setHeroState(HeroState.BlastAtk);
        }
    }

    //　执行英雄奔跑命令，需要奔跑朝向
    heroRun (LR) {
        // 跳跃和降落时不能奔跑，只能调整
        if (this.isFloating()) {
            this.heroRunspeed = this.maxMovingSpeed * 0.5;
            this.setHeroToward(LR);
            return;
        }
        this.stateDataReset();
        this.isRuning = true;
        this.heroRunspeed = this.maxMovingSpeed;
        this.setHeroToward(LR);
        this.setHeroState(HeroState.Run);
    }

    heroStopRun() {
        this.isRuning = false;
        this.heroStand();
    }

    //　执行英雄静止命令
    heroStand() {
        if (this.isFloating()) {
            return;
        }
        this.stateDataReset();
        this.setHeroState(HeroState.Stand);
    }

    //　监听英雄是否从跳跃转为降落
    listenHeroFail() {
        // 浮空特技保持浮空直至动作动画播放完成或自然落地
        if (this.isFloatingStunt) {
            return;
        }
        // 浮空状态下，跳跃速度归零则处于下落
        if (this.jumpPower < 0 && this.isFloating() && this.getHeroState() !== HeroState.Fail) {
            this.setHeroState(HeroState.Fail);
        }
    }

    //　监听英雄是否从降落转为落地
    listenHeroLanding() {
        // 检测落地
        if (!this.isFloating() || this.getHeroState() === HeroState.Landing) {
            return;
        }

        if (this.heroNodeScript.getHeroNodeY() <= 0 || this.isTouchPlaform ) {
            this.stateDataReset();
            this.setHeroState(HeroState.Landing);
            if (!this.isTouchPlaform) {
                // 防止出现进入地面的情况
                this.heroNodeScript.setHeroNodeY(0);
            }
            this.node.emit('hero:blastAtkConsitionActiva');
        }
    }

    listenHeroFloatingStunt() {
        if (!this.isFloating() || this.isFloatingStunt) {
            return;
        }
        if (this.getHeroState() !== HeroState.Jump || this.getHeroState() !== HeroState.Fail) {
            this.isFloatingStunt = true;
        }
    }

    setIsTouchPlaform(isTouch) {
        this.isTouchPlaform = isTouch;

        // 补丁
        if(isTouch) {
            this.node.emit('hero:blastAtkConsitionActiva');
        }
    }

    addAtkBlastEffect() {
        const effect = cc.instantiate(this.blastPrefab);
        effect.parent = this.heroNode.parent;
        effect.scaleX = this.node.scaleX;
        effect.x = this.heroNode.x + this.node.scaleX * 60;
        effect.y = this.heroNode.y + 10;   
    }

    addDashEffect() {
        const singleAddEffect = (time) => {
            setTimeout(() => {
                const effect = cc.instantiate(this.dashPrefab);
                effect.parent = this.heroNode.parent;
                effect.x = this.heroNode.x;
                effect.y = this.heroNode.y;
            }, time);
        }
        for(let i = 0; i < 8; i++) {
            singleAddEffect(100 + i*50);
        }
    }

    heroHurt() {
        if (this.heroHp > 0) {
            this.heroHp -= 1;
            this.node.getComponent(cc.Sprite).setMaterial(0, this.flashMaterial);
            setTimeout(() => {
                this.node.getComponent(cc.Sprite).setMaterial(0, this.flashEndMaterial);
            }, 200);
            this.camera.getComponent('camera').setShake(3);
            this.node.emit('hero:hurt', this.heroHp);
        }
        this.judgeHeroDie();
    }

    judgeHeroDie() {
        if (this.heroHp <= 0 && this.getHeroState() !== HeroState.Die) {
            this.setHeroState(HeroState.Die);
            setTimeout(() => {
                cc.director.loadScene("resurgence");
            }, 1000);
        }
    }

    heroRevive() {
        this.setHeroState(HeroState.Revive);
        this.node.emit('hero:revive');
    }

    start () {
        if (this.currScene === 'resurgence') {
            this.heroRevive();
        } else {
            this.heroStand();
        }
    }

    protected update(dt: number): void {
        this.listenHeroFail();
        this.listenHeroLanding();
        this.listenHeroFloatingStunt();
    }
}
