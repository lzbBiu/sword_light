// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HeroSprite from "../../hero/script/heroSprite";
import {HeroState} from "../../hero/script/heroTypes";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Plaform extends cc.Component {

    @property(cc.Node)
    heroSprite: cc.Node = null;

    private heroSpriteScript: HeroSprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }
    

    start () {
        this.heroSpriteScript = this.heroSprite.getComponent('heroSprite');
    }

    onBeginContact() {
        console.log('触碰')
        this.heroSpriteScript.setIsTouchPlaform(true);
    }

    onEndContact() {
        console.log('离开')
        this.heroSpriteScript.setIsTouchPlaform(false);
    }

    // update (dt) {}
}
