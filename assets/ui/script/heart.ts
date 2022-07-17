// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HeroSprite from "../../hero/script/heroSprite";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Heart extends cc.Component {

    @property(cc.Node)
    heroSprite: cc.Node = null;

    private heroSpriteScript: HeroSprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.heroSpriteScript = this.heroSprite.getComponent('heroSprite');
    }

    start () {
        this.heroSprite.on('hero:hurt', (currHp) => {
            this.node.children[currHp].children[0].opacity = 0;
        });
    }

    // update (dt) {}
}
