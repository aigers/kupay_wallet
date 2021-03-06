/**
 * Exchange
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
// tslint:disable-next-line:max-line-length
import { convertRedBag, getCloudBalance, getData, inputInviteCdKey, queryRedBagDesc, setData } from '../../../net/pull';
import { CurrencyType, CurrencyTypeReverse, RedEnvelopeType } from '../../../store/interface';
import {  updateStore } from '../../../store/store';
import { showError } from '../../../utils/toolMessages';
import { getLanguage } from '../../../utils/tools';
import { eth2Wei,smallUnit2LargeUnit } from '../../../utils/unitTools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Exchange extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.state = {
            cid: '',
            cfgData:getLanguage(this)
        };
    }
    
    public backPrePage() {
        this.ok && this.ok(); 
    }

    // 输入兑换码
    public inputChange(e: any) {
        this.state.cid = e.value;
        this.paint();
    }
    // 点击兑换按钮
    public async convertClick() {
        this.inputBlur();
        const code = this.state.cid.trim();
        if (code.length <= 0) {
            popNew('app-components1-message-message', { itype: 'error', content: this.state.cfgData.errorList[0], center: true });

            return;
        }
        const close = popNew('app-components1-loading-loading', { text: this.state.cfgData.loading });        
        const value: any = await this.convertRedEnvelope(code);
        close.callback(close.widget);
        if (!value) return;
        updateStore('cHisRec',undefined);
        getCloudBalance();
        const r: any = await this.queryDesc(code);

        const redEnvelope = {
            message: r.value,
            ctypeShow: CurrencyTypeReverse[value[0]],
            amount: smallUnit2LargeUnit(CurrencyTypeReverse[value[0]], value[1]),
            rtype: code.slice(0, 2)
        };
        
        popNew('app-view-earn-exchange-openRedEnv', redEnvelope);
        this.state.cid = '';
        this.paint();
    }

    /**
     * 查看历史记录
     */
    public goHistory() {
        popNew('app-view-earn-exchange-exchangeHistory');
    }

    /**
     * 实际兑换
     */
    public async convertRedEnvelope(code: string) {
        const perCode = code.slice(0, 2);
        const validCode = code.slice(2);
        let value = [];
        if (perCode === RedEnvelopeType.Normal || perCode === RedEnvelopeType.Random) {
            value = await convertRedBag(validCode);  // 兑换普通红包，拼手气红包
        } else if (perCode === RedEnvelopeType.Invite) {
            const data = await getData('convertRedEnvelope');
            if (data.value) {
                showError(-2);

                return;
            }
            value = await inputInviteCdKey(validCode);  // 兑换邀请红包
            if (!value) return;
            value = [CurrencyType.ETH, eth2Wei(0.015).toString()];
            setData({ key: 'convertRedEnvelope', value: new Date().getTime() });
        } else {
            popNew('app-components1-message-message', { content: this.state.cfgData.errorList[1] });

            return null;
        }

        return value;
    }

    /**
     * 查看详情
     */
    public async queryDesc(code: string) {
        const perCode = code.slice(0, 2);
        const validCode = code.slice(2);
        let res = { result: -1, value: '' };
        if (perCode === RedEnvelopeType.Invite) {
            res.result = 1;
            res.value = this.state.cfgData.defaultMess;
        } else {
            res = await queryRedBagDesc(validCode);
        }

        return res;
    }
    /**
     * 输入框取消聚焦
     */
    public inputBlur() {
        const inputs: any = document.getElementsByTagName('input');
        for (let i = 0;i < inputs.length;i++) {
            inputs[i].blur();
        }
    }
}