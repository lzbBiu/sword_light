
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dash extends cc.Component {
    private heroSprite: cc.Node = null;

    private currSprite: cc.SpriteFrame = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.heroSprite = cc.find('Game/heroNode/sprite');
        this.currSprite = this.heroSprite.getComponent(cc.Sprite).spriteFrame;
    }

    start () {
        // 特效生成时，帧对应主角当前帧
        this.node.getComponent(cc.Sprite).spriteFrame = this.currSprite;

        // 生成时朝向
        this.node.scaleX = this.heroSprite.scaleX;
    }

    update (dt) {
        this.node.opacity -= 5;
        if ( this.node.opacity <=0 ){
            this.node.destroy();
        }
    }
}
