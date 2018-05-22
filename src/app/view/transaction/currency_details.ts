import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { getCurrentWallet, getLocalStorage, wei2Eth, Eth2RMB, parseAccount, setLocalStorage } from "../../utils/tools";
import { Api } from "../../core/eth/api";
import { register } from "../../store/store";

interface Props {
    currencyName: string;
}

interface State {
    list: any[];
    currentAddr: string;
    balance: number;
    showBalance: string;
    showBalanceConversion: string;
}


export class AddAsset extends Widget {
    public props: Props;
    public state: State;
    public timerRef: number = 0;

    public ok: () => void;

    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init(): void {
        register("wallets", (wallets) => {
            const wallet = getCurrentWallet(wallets);
            this.state.list = this.getTransactionDetails(wallet, this.props.currencyName)
            this.parseBalance();
            this.paint();
        });
        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);

        this.state = { list: [], currentAddr: "", balance: 0, showBalance: "", showBalanceConversion: "" };
        this.state.list = this.getTransactionDetails(wallet, this.props.currencyName)
        this.parseBalance();

        // 启动定时器，每10秒更新一次记录
        this.openCheck()

    }

    /**
     * 处理关闭
     */
    public doClose() {
        if (this.timerRef) {
            clearTimeout(this.timerRef);
            this.timerRef = 0;
        }
        this.ok && this.ok();
    }

    /**
     * 处理选择地址
     */
    public doSearch() {
        popNew("app-view-transaction-choose_address")
    }

    /**
     * 显示交易详情
     */
    public showTransactionDetails(e, index) {
        popNew("app-view-transaction-transaction_details", this.state.list[index])
    }

    /**
     * 显示简介
     */
    public showIntroduction() {
        // console.log("onSwitchChange", e, index)
        // this.state.list[index].isChoose = e.newType;

        // // todo 这里处理数据变化
    }

    /**
     * 处理转账
     */
    public doTransfer() {
        if (!this.state.currentAddr) return
        popNew("app-view-transaction-transfer", {
            currencyBalance: this.state.balance,
            from: this.state.currentAddr,
            currencyName: this.props.currencyName
        })
    }

    /**
     * 处理收款
     */
    public doReceipt() {
        //todo 这里获取地址
        let addr = "1xdfsdfsfsdfgdsfgsddfg4d54g5sdg2sfgdsfgsddfg4d54g5sdg2sg4d54g5sdg2s";
        popNew("app-view-transaction-receipt", {
            currencyBalance: this.state.balance,
            addr: addr
        })
    }

    private getTransactionDetails(wallet, currencyName) {
        if (!wallet.currencyRecords || !currencyName) return [];

        let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0]
        if (!currencyRecord) return [];

        this.state.currentAddr = currencyRecord.currentAddr || wallet.walletId;
        let addr = currencyRecord.addrs.filter(v => v.addr === this.state.currentAddr)[0];
        if (!addr) return []

        return addr.record.map(v => {
            v.account = parseAccount(v.type == "收款" ? v.from : v.to);
            v.showPay = `${v.pay} ETH`;
            return v
        });
    }

    private parseBalance() {
        let api = new Api();
        let r: any = api.getBalance(this.state.currentAddr);
        if (this.props.currencyName === "ETH") {
            let num = wei2Eth(r.toNumber());
            this.state.balance = num;
            this.state.showBalance = `${num} ETH`;
            this.state.showBalanceConversion = `≈￥ ${Eth2RMB(num)}`;
        }
    }

    private openCheck() {
        this.timerRef = setTimeout(() => {
            this.timerRef = 0;
            this.openCheck();
        }, 10 * 1000);

        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);
        if (!wallet.currencyRecords || !this.props.currencyName) return;

        let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0]
        if (!currencyRecord) return;

        let addr = currencyRecord.addrs.filter(v => v.addr === this.state.currentAddr)[0];
        if (!addr) return
        let api = new Api();
        let isUpdate = false;
        addr.record = addr.record.map(v => {
            if (v.result === "已完成") return v;
            if (!api.getTransactionReceipt(v.id)) return v;
            isUpdate = true;
            v.result = "已完成";
            return v;
        })
        if (isUpdate) {
            setLocalStorage("wallets", wallets, true)
        }
    }

}

