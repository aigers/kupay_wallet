/**
 * 输入框的逻辑处理
 * {input:"",placehold:"",disabled:false,clearable:false,itype:"text",style:"",autofacus:false}
 * input?: 初始内容
 * placeHolder?: 提示文字
 * disabled?: 是否禁用
 * clearable?: 是否可清空
 * itype?: 输入框类型 text number password
 * style?: 样式
 * 外部可监听 ev-input-change，ev-input-blur，ev-input-focus，ev-input-clear事件
 */
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    input?:string;
    placeHolder?:string;
    itype?:string;
    style?:string;
    disabled?:boolean;
}

interface State {
    currentValue:string;
    focused:boolean;
    showClear:boolean;
}
export class Input extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public create() {
        this.state = {
            currentValue:'',
            focused: false,
            showClear:false
        };
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        if (props.input) {
            this.state.currentValue = props.input;
        }
        console.log('000000000',props);
    }

    public change(event:any) {
        const currentValue = event.currentTarget.value;
        this.state.currentValue = currentValue;
        notify(event.node,'ev-input-change',{ value:this.state.currentValue });
        this.changeInputValue();
        this.paint();
    }
    public blur(event:any) {
        this.state.focused = false;
        notify(event.node,'ev-input-blur',{});
        this.paint();
    }
    public focus(event:any) {
        this.state.focused = true;
        notify(event.node,'ev-input-focus',{});
        this.paint();
    }
    
    // 设置input value
    public changeInputValue() {
        const child = (<any>this.tree).children[0];
        const childNode = getRealNode(child);
        (<any>childNode).value = this.state.currentValue;
    }
}
