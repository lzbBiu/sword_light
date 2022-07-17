// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HeroSprite from "./heroSprite";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroHurtBox extends cc.Component {

    @property(cc.Node)
    heroSprite: cc.Node = null;

    private heroSpriteScript: HeroSprite = null;

    onLoad () {
        this.heroSpriteScript = this.heroSprite.getComponent('heroSprite');
    }

    onCollisionEnter() {
        this.node.getComponent(cc.AudioSource).play();
        this.heroSpriteScript.heroHurt();
    }

    // update (dt) {}
}
