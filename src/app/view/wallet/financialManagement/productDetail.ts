/**
 * 理财详情
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getPurchaseRecord } from '../../../net/pull';
import { Product, PurchaseRecordOne } from '../../../store/interface';
import { find, register } from '../../../store/store';
import { calPercent, fetchHoldedProductAmount, getLanguage, hasWallet } from '../../../utils/tools';

// ====================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    product:Product;
}
export class ProductDetail extends Widget {
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        if (find('conUid')) {
            // 获取购买记录
            getPurchaseRecord();
        }
        const product = this.props.product;
        const res = calPercent(product.surplus,product.total);
        console.log(res);
        this.state = {
            holdedAmout:0,
            amount:1,
            leftPercent:  res.left,
            usePercent: res.use,
            cfgData:getLanguage(this),
            isScroll:false
        };
        console.log(this.props.product);
    }

    // 减少购买数量
    public minus(e:any) {
        if (this.state.amount === 1) {
            return;
        }
        this.state.amount -= 1;
        this.paint();
    }
    // 增加购买数量
    public add(e:any) {
        const limit = Number(this.props.product.limit);
        // 超过限购量直接返回
        if (this.state.amount + this.state.holdedAmout >= limit) {
            return;
        }
        this.state.amount += 1;
        this.paint();
    }

    // 购买记录改变
    public updatePurchaseRecord(purchaseRecord:PurchaseRecordOne[]) {
        this.state.holdedAmout = fetchHoldedProductAmount(this.props.product.id);
    }

    // 页面滚动
    public pageScroll() {
        if (document.getElementById('body').scrollTop > 0) {
            this.state.isScroll = true;
            
        } else {
            this.state.isScroll = false;
        }
        this.paint();
        
    }

    /**
     * 点击购买按钮
     */
    public purchaseClicked() {
        if (!hasWallet()) return;
        popNew('app-view-wallet-financialManagement-productStatement',{ product:this.props.product,amount:this.state.amount });
    }

    /**
     * 点击阅读声明
     */
    public readAgree() {
        popNew('app-view-wallet-financialManagement-productStatement',{ fg:1 });        
    }
}

// =====================================本地
register('purchaseRecord', async (purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updatePurchaseRecord(purchaseRecord);
    }
    
});