// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BasisBtn extends cc.Component {

    private btnDisabled: boolean = false;

    private originalScaleX: number = 1;
    private originalScaleY: number = 1;

    initBasisBtn() {
        this.originalScaleX = this.node.scaleX;
        this.originalScaleY = this.node.scaleY;
    }

    listenTouchStart(callbacks) {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (!this.btnDisabled) {
                this.enlargeBtn();
                callbacks && callbacks();
            }
        });
    }

    listenTouchEnd(callbacks) {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (!this.btnDisabled) {
                this.shrinkBtn();
                callbacks && callbacks();
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            if (!this.btnDisabled) {
                this.shrinkBtn();
                callbacks && callbacks();
            }
        });
    }

    enlargeBtn() {
        this.node.scaleX = 1.2 * this.originalScaleX;
        this.node.scaleY = 1.2 * this.originalScaleY;
    }

    shrinkBtn() {
        this.node.scaleX = 1 * this.originalScaleX;
        this.node.scaleY = 1 * this.originalScaleY;
    }

    disableBtn() {
        this.node.opacity = 50;
        this.btnDisabled = true;
        this.shrinkBtn();
    }

    activeBtn() {
        // 这个值应该常态化或者获取组件，目前不用
        this.node.opacity = 100;
        this.btnDisabled = false;
    }

    // update (dt) {}
}
