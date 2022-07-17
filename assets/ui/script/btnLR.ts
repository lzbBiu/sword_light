// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasisBtn from "./basisBtn";
import HeroSprite from "../../hero/script/heroSprite";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BtnLR extends BasisBtn {
    
    @property
    LR:number = 0;

    private heroScript: HeroSprite = null;

    onLoad () {
        this.initBasisBtn();
        this.heroScript = cc.find('Game/heroNode/sprite').getComponent("heroSprite");
    }

    start () {
        this.listenTouchStart(() => this.playHeroRun());
        this.listenTouchEnd(() => this.playHeroStopRUn());
    }

    playHeroRun () {
        this.heroScript.heroRun(this.LR);
    }

    playHeroStopRUn () {
        this.heroScript.heroStopRun();
    }
    
}
