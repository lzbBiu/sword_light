// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

const CarmeWidth = 585;

@ccclass
export default class ViewFollower extends cc.Component {

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property
    scenesLength: number = 0;

    update (dt) {
        // 585 为相机宽度，坐标大于相机宽度一半或最大距离减去相机宽度一半时才跟随人物移动
        if (this.node.x >= 0 && this.node.x <= (this.scenesLength - (CarmeWidth/2))) {
            this.node.x = this.heroNode.x;
        }
        if(this.node.x < 0){
            this.node.x = 0;
        }
        if (this.node.x > (this.scenesLength - (CarmeWidth/2))) {
            this.node.x = this.scenesLength - (CarmeWidth/2);
        }
        
    }
}
