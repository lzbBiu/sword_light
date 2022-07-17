// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Swaying extends cc.Component {

    @property
    time: number = 0;

    @property
    speed: number = 0;

    @property
    maxHeight: number = 0;

    private material: cc.Material = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
        this.material.setProperty("speed", this.speed);
        this.material.setProperty("maxHeight", this.maxHeight);
    }

    update (dt) {
        this.time += dt;
        this.material.setProperty("time", this.time);
    }
}
