/**
 * 理财产品详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { openBasePage } from '../../../utils/tools';
export class ProductDetail extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public setProps(props: any, oldProps: any) {
        super.setProps(props, oldProps);
        this.state.isSoldOut = props.item.isSoldOut;
        console.log(props);
    }
    public init() {
        this.state = {
            showStep: true,
            productName:'ETH1期',
            expectedEarnings: '+8%',
            unitPrice: '0.1',
            days: 'T+0',
            surplus: '0',
            purchaseDate: '2018-08-02',
            interestDate: '2018-08-02',
            endDate: '2018-08-02',
            productIntroduction: 'ETH资管第1期是KuPay退出的一种固定收益类，回报稳定、无风险定期产品。',
            limit: '5',
            amount: 1,
            lockday:'无',
            isSoldOut:false
        };
    }
    public goBackPage() {
        this.ok && this.ok();
    }

    public async readNotice() {
        this.hideStep();
        await openBasePage('app-view-financialManagement-notice-notice').then((r) => {
            this.showStep();
        });
        
    }
    public async purchaseClicked() {
        this.hideStep();
        const props = {
            money:this.state.amount * Number(this.state.unitPrice),
            unitPrice:this.state.unitPrice,
            productName:this.state.productName,
            amount:this.state.amount,
            expectedEarnings:this.state.expectedEarnings,
            lockday:this.state.lockday
        };
        props.money = strip(props.money);
        await openBasePage('app-view-financialManagement-purchase-purchase',props).then((r) => {
            // TODO 购买
            // 返回值r是输入的密码
            console.log(r);
        });
        this.showStep();

    }
    public hideStep() {
        this.state.showStep = false;
        this.paint();
    }
    public showStep() {
        this.state.showStep = true;
        this.paint();
    }
    public minus() {
        if (this.state.amount === 1) {
            return;
        }
        this.state.amount -= 1;
        this.paint();
    }
    public add() {
        const limit = Number(this.state.limit);
        if (this.state.amount === limit) {
            return;
        }
        this.state.amount += 1;
        this.paint();
    }
}

// 解决js浮点数运算误差 3*0.1=0.3000000000004
const strip = (num, precision = 12) => {
    return +parseFloat(num.toPrecision(precision));
};