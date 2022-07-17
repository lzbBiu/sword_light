// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BgElementMove extends cc.Component {

    @property(cc.Float)
    speed: number = 0;

    private bgFollower: cc.Node = null;

    private moveDiff: number = 0;

    private originPosition: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bgFollower = cc.find('Game/bgFollower');
        this.originPosition = this.node.x;
    }

    update (dt) {
        // 移动差值: 如果速率为 1 则，背景同等距离倒退
        this.moveDiff = this.bgFollower.x * this.speed;
        this.node.x = this.originPosition - this.moveDiff;
    }
}
