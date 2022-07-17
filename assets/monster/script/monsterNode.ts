// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MonsterSprite from "./monsterSprite";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterNode extends cc.Component {
    
    private sprite: MonsterSprite = null;

    onLoad() {
        this.sprite = this.node.getChildByName("sprite").getComponent('monsterSprite');
    }

    getMonsterNodeX() {
        return this.node.x;
    }

    getMonsterNodeY() {
        return this.node.y;
    }

    update (dt) {
        this.node.x += this.sprite.getMonsterMoveDistance();
    }

}