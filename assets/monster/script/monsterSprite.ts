import HeroNode from '../../hero/script/heroNode';
import HeroSprite from '../../hero/script/heroSprite';
import MonsterNode from './monsterNode';
import { MonsterState } from './monsterTypes';

const {ccclass, property} = cc._decorator;

const monsterAtkRange = 50;

const monsterAlertnessRange = 120;

// 播放相机抖动
// this.camera.getComponent('Camera').setShake(3);

@ccclass
export default class MonsterSprite extends cc.Component {

    // 巡逻范围
    @property
    patrolRange: number = 0;

    @property
    maxHp: number = 0;

    @property
    maxSpeed: number = 0;
    
    @property
    hitback: number = 0;

    @property
    hitbackDecrease: number = 0;

    @property
    dazeTime: number = 0;

    @property(cc.Node)
    hpBar: cc.Node = null;

    @property(cc.Material)
    flash: cc.Material = null;

    @property(cc.Material)
    flashEnd: cc.Material = null;

    @property(cc.Node)
    camera: cc.Node = null;

    private hp: number = 0;

    private monsterState: MonsterState = null;

    private startPosition: number = 0;

    private leftDestination: number = 0;

    private rightDestination: number = 0;

    private animation: cc.Animation = null;

    private heroNodeScript: HeroNode = null;

    private heroSpriteScript: HeroSprite = null;

    private monsterNodeScript: MonsterNode = null;

    private hpBarProgresBar: cc.ProgressBar = null;

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.heroNodeScript = cc.find('Game/heroNode').getComponent('heroNode');
        this.heroSpriteScript = cc.find('Game/heroNode/sprite').getComponent('heroSprite');
        this.monsterNodeScript = this.node.parent.getComponent('monsterNode');
        this.hpBarProgresBar = this.hpBar.getComponent(cc.ProgressBar);

        this.monsterState = MonsterState.ToLeftPatrol;
        this.hp = this.maxHp;

        this.startPosition = this.getMonsterNodeX();
        this.leftDestination = this.startPosition - this.patrolRange;
        this.rightDestination = this.startPosition + this.patrolRange;
        this.monsterState = MonsterState.ToLeftPatrol;
    }

    autoSwitchState() {
        // 作用自动切换
        this.switchStateLeftToRight();
        this.switchStateRightToLeft();

        // 从巡逻状态切换到追踪
        this.switchStatePatrolToTrack();

        // 从追踪状态切换到攻击
        this.switchStateTrackToAtk();
    }

    switchStateAtkToTrack() {
        if (this.monsterState !== MonsterState.Die) {
            this.animation.play("move");
            this.setMonsterState(MonsterState.Track);
        }
    }

    switchStatePatrolToTrack() {
        if (this.monsterState !== MonsterState.Die && this.getMonsterHeroDist() < monsterAlertnessRange && this.monsterState !== MonsterState.Atk) {
            this.setMonsterState(MonsterState.Track);
        }
    }

    switchStateTrackToAtk() {
        if (this.monsterState === MonsterState.Track && this.getMonsterHeroDist() < monsterAtkRange) {
            
            this.setMonsterState(MonsterState.Atk);
            this.animation.play("atk");

            setTimeout(() => {
                this.switchStateAtkToTrack();
            }, this.dazeTime);
        }
    }

    switchStateLeftToRight() {
        if (this.monsterState !== MonsterState.Die && this.monsterState === MonsterState.ToLeftPatrol && this.getMonsterNodeX() <= this.leftDestination) {
            this.setMonsterState(MonsterState.ToRightPatrol);
            this.switchTowardsRight();
            this.switchStatePatrolToTrack()
        }
    }

    switchStateRightToLeft() {
        if (this.monsterState !== MonsterState.Die && this.monsterState === MonsterState.ToRightPatrol && this.getMonsterNodeX() >= this.rightDestination) {
            this.setMonsterState(MonsterState.ToLeftPatrol);
            this.switchTowardsLeft();
            this.switchStatePatrolToTrack()
        }
    }

    switchTowardsLeft() {
        this.node.scaleX = 1;
    }

    switchTowardsRight() {
        this.node.scaleX = -1;
    }

    setMonsterState(state: MonsterState) {
        this.monsterState = state;
    }

    getMonsterNodeX() {
        return this.monsterNodeScript.getMonsterNodeX();
    }

    getMonsterNodeY() {
        return this.monsterNodeScript.getMonsterNodeY();
    }

    getHeroNodeX() {
        return this.heroNodeScript.getHeroNodeX();
    }

    getMonsterHp() {
        return this.hp;
    }

    getMonsterMaxHp() {
        return this.maxHp;
    }

    getMonsterHeroDist() {
        return Math.abs(this.getMonsterNodeX() - this.getHeroNodeX());
    }

    getMonsterMoveDistance(): number {
        let distance = 0;
        distance += this.getMonsterTrackStateMoveDistance();
        distance += this.getMonsterPatrolStateMoveDistance();
        distance += this.getMonsterDieStateMoveDistance();

        return distance;
    }

    getMonsterTrackStateMoveDistance(): number {
        let distance = 0;
        const speed = this.maxSpeed;
        if (this.monsterState === MonsterState.Track) {
            if (this.getMonsterHeroDist() < 1) {
                return 0;
            }
            if (this.getMonsterNodeX() > this.getHeroNodeX()) {
                distance = -speed;
                this.switchTowardsLeft();
            }
            
            if (this.getMonsterNodeX() < this.getHeroNodeX()) {
                distance = speed;
                this.switchTowardsRight();
            }
        }

        return distance;
    }

    getMonsterPatrolStateMoveDistance(): number {
        let distance = 0;
        const speed = this.maxSpeed;
        if (this.monsterState === MonsterState.ToLeftPatrol) {
            distance = -speed;

        }
        if (this.monsterState === MonsterState.ToRightPatrol) {
            distance = speed;
        }

        return distance;
    }

    getMonsterDieStateMoveDistance(): number {
        let distance = 0;
        if (this.monsterState === MonsterState.Die) {
            if (this.getHeroNodeX() < this.getMonsterNodeX()) {
                distance = this.hitback;
            } else {
                distance = -this.hitback;
            }
            if (this.hitback >= this.hitbackDecrease) {
                this.hitback -= this.hitbackDecrease;
            }
            if (this.hitback < 0) {
                this.hitback = 0;
            }
        }
        return distance;
    }

    // 怪物受伤hp
    monsterHurt() {
        if (this.hp > 0) {
            this.hp -= this.heroSpriteScript.attack;
            this.hpBarProgresBar.node.opacity = 255;
            this.hpBarProgresBar.progress = this.hp / this.maxHp;
            this.node.getComponent(cc.Sprite).setMaterial(0, this.flash);
            this.camera.getComponent('camera').setShake(3);
            setTimeout(() => {
                this.node.getComponent(cc.Sprite).setMaterial(0, this.flashEnd);
            }, 200);
        }
        this.judgeMonsterDie();
    }

    judgeMonsterDie() {
        if (this.hp <= 0 && this.monsterState !== MonsterState.Die) {
            this.setMonsterState(MonsterState.Die);
            this.animation.play('die');
            this.hpBarProgresBar.node.opacity = 0;
        }
    }

    update (dt) {
        this.autoSwitchState();
    }
}