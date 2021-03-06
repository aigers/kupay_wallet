/**
 * HoldedFM
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getPurchaseRecord } from '../../../net/pull';
import { PurchaseRecordOne } from '../../../store/interface';
import { register } from '../../../store/store';
import { getLanguage } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isActive:boolean;
}
export class HoldedFM extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.state = {
            purchaseRecord:[],
            cfgData:getLanguage(this)
        };
        if (this.props.isActive) {
            getPurchaseRecord();
        }
    }

    public updatePurchaseRecord(purchaseRecord:PurchaseRecordOne[]) {
        this.state.purchaseRecord = purchaseRecord;
        this.paint();
    }

    public fmListItemClick(e:any,index:number) {
        const product = this.state.productList[index];
        popNew('app-view-wallet-financialManagement-productDetail',{ product });
    }
}

// =====================================本地
register('purchaseRecord', async (purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updatePurchaseRecord(purchaseRecord);
    }
    
});