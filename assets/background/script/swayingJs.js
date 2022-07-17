// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// 小草的摆动
cc.Class({
    extends: cc.Component,

    properties: {
        time: 0,
        speed: 0,
        maxHeight: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
        this.material.setProperty("speed", this.speed);
        this.material.setProperty("maxHeight", this.maxHeight);
    },

    update (dt) {
        this.time += dt;
        this.material.setProperty("time", this.time);
    },
});
