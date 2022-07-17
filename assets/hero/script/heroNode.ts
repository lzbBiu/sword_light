// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
const CarmeWidth = 585;

import HeroSprite from './heroSprite';

@ccclass
export default class HeroNode extends cc.Component {

    @property
    scenesLength: number = 0;

    private spriteScript: HeroSprite = null;

    private isReachEdge: boolean = false;

    onLoad () {
        this.spriteScript = this.node.getChildByName("sprite").getComponent("heroSprite");
    }

    getHeroNodeX () {
        return this.node.x;
    }

    getHeroNodeY () {
        return this.node.y;
    }

    setHeroNodeY (y) {
        this.node.y = y;
    }

    update (dt) {
        // 边缘重制
        if (this.isReachEdge) {
            this.isReachEdge = false;
        }
        // 边缘设置
        if (this.node.x >= -CarmeWidth/2 && this.node.x <= this.scenesLength) {
            this.node.x += this.spriteScript.getHeroMoveDtDistance() * dt;
            this.node.y += this.spriteScript.getHeroJumpDtDistance() * dt;
        } else if (this.node.x < -CarmeWidth/2) {
            this.node.x = -CarmeWidth/2;
        } else if (this.node.x > this.scenesLength) {
            this.node.x = this.scenesLength;
            if (!this.isReachEdge) {
                this.node.emit('hero:reachEdge');
                this.isReachEdge = true;
            }
        }
    }
}
