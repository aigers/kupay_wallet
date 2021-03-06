/**
 * 云端绑定手机
 */
// =================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { regPhone } from '../../../net/pull';
import { find, updateStore } from '../../../store/store';
import { getLanguage } from '../../../utils/tools';
// =================================================导出
export class BindPhone extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.state = {
            phone:'',
            code:[],
            isSuccess:true,
            cfgData:getLanguage(this)
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    
    /**
     * 输入完成后确认
     */
    public async doSure() {
        if (!this.state.phone) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips });
            this.state.code = [];
            this.paint();

            return;
        }
        const data = await regPhone(this.state.phone, this.state.code.join(''));
        if (data && data.result === 1) {
            const userinfo = find('userInfo');
            userinfo.bphone = this.state.phone;
            userinfo.fromServer = false;
            updateStore('userInfo',userinfo);
            this.ok();
        } else {
            this.state.isSuccess = false;
            this.state.code = [];
            this.paint();
        }
    }

    /**
     * 手机号改变
     */
    public phoneChange(e: any) {
        this.state.phone = e.value;  
    }

    /**
     * 验证码改变
     */
    public codeChange(e: any) {
        if (e.value) {
            this.state.code.push(e.value);
            const ind = this.state.code.length;
            // tslint:disable-next-line:prefer-template
            document.getElementById('codeInput' + (ind - 1)).getElementsByTagName('input')[0].blur();
            if (ind < 4) {
                // tslint:disable-next-line:prefer-template
                document.getElementById('codeInput' + ind).getElementsByTagName('input')[0].focus();
            }
        } 
        this.paint();
        
        if (this.state.code.length === 4) {
            this.doSure();
        }
    }

    /**
     * 验证码输入框聚焦
     */
    public codeFocus() {
        const ind = this.state.code.length < 4 ? this.state.code.length : 3;
        // tslint:disable-next-line:prefer-template
        document.getElementById('codeInput' + ind).getElementsByTagName('input')[0].focus() ;
        this.paint();
    }

}