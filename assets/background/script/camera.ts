// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    private amplitude: number = 0;

    setShake (amplitude) {
        this.amplitude = amplitude;
    },

    update (dt) {
        const shakex = Math.random() < 0.5 ? -1 : 1;
        const shakey = Math.random() < 0.5 ? -1 : 1;

        this.node.x = shakex * this.amplitude;
        this.node.y = shakey * this.amplitude;

        if (this.amplitude > 0) {
            this.amplitude -= 0.3
        } else if (this.amplitude < 0) {
            this.amplitude = 0;
        }
        
    },
}
