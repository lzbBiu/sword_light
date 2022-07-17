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
export default class BtnAtkBlast extends BasisBtn {

    private heroScript: HeroSprite = null;

    onLoad () {
        this.initBasisBtn();
        this.heroScript = cc.find('Game/heroNode/sprite').getComponent("heroSprite");
        
    }

    start () {
        this.listenTouchStart(() => this.playHeroBlastAtk());
        this.listenTouchEnd(() => 0);
        this.listenHeroBlastAtkConsition();
    }

    playHeroBlastAtk () {
        this.heroScript.heroBlastAtk();
    }
    
    listenHeroBlastAtkConsition() {
        this.heroScript.node.on('hero:blastAtkConsitionDisabled', () => {
            this.disableBtn();
        });
        this.heroScript.node.on('hero:blastAtkConsitionActiva', () => {
            this.activeBtn();
        })
    }

}
