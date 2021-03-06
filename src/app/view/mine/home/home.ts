/**
 * wallet home 
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { doScanQrCode, openNewActivity } from '../../../logic/native';
import { find, register } from '../../../store/store';
import { copyToClipboard, getFirstEthAddr, getLanguage, getUserInfo, popPswBox } from '../../../utils/tools';
import { backupMnemonic } from '../../../utils/walletTools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Home extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        const cfg = getLanguage(this);
        const wallet = find('curWallet');
        let hasBackupMnemonic = false;
        let hasWallet = false;
        let address = '';
        if (wallet) {
            hasWallet = true;
            address = getFirstEthAddr();
            hasBackupMnemonic = JSON.parse(wallet.gwlt).mnemonicBackup;
        }
        this.state = {
            list:[
                { img:'../../../res/image1/28.png',name: cfg.itemTitle[0],components:'' },
                { img:'../../../res/image1/10.png',name: cfg.itemTitle[1],components:'app-view-mine-other-help' },
                { img:'../../../res/image1/21.png',name: cfg.itemTitle[2],components:'app-view-mine-setting-setting' },
                { img:'../../../res/image1/23.png',name: cfg.itemTitle[3],components:'app-view-mine-other-contanctUs' },
                { img:'../../../res/image1/24.png',name: cfg.itemTitle[4],components:'app-view-mine-other-aboutus' },
                { img:'../../../res/image1/43.png',name: 'GitHub Repository',components:'' }
            ],
            address,
            userName:'',
            avatar:'',
            close:false,
            hasWallet,
            hasBackupMnemonic,
            cfgData:cfg
        };
        this.initData();
    }

    /**
     * 更新数据
     */
    public initData() {
        const userInfo = getUserInfo();
        if (userInfo) {
            this.state.userName = userInfo.nickName;
            this.state.avatar = userInfo.avatar;
        }

        const wallet = find('curWallet');
        if (wallet) {
            this.state.hasWallet = true;
            this.state.address = getFirstEthAddr();
            this.state.hasBackupMnemonic = JSON.parse(wallet.gwlt).mnemonicBackup;            
        }else{
            this.state.hasWallet = false;
            this.state.address = "";
        }
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    } 

    /**
     * 备份
     */
    public async backUp() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index',{ ...ret });
            // this.backPrePage();
        }
    }

    /**
     * 点击跳转
     */
    public itemClick(ind:number) {
        if (ind === 0) {
            if (this.state.hasWallet) {
                popNew('app-view-mine-account-home');
            } else {
                popNew('app-components-modalBox-modalBox',this.state.cfgData.modalBox,() => {
                    popNew('app-view-wallet-create-home');
                });
            }
        } else if (ind === 5) {
            // window.open('https://github.com/KuPayIo/kupay_wallet');
            openNewActivity('https://github.com/KuPayIo/kupay_wallet','KuPay');
        } else {
            popNew(this.state.list[ind].components);
        }
        // this.backPrePage();
    }

    /**
     * 复制地址
     */
    public copyAddr() {
        copyToClipboard(this.state.address);
        popNew('app-components1-message-message',{ content:this.state.cfgData.tips });
    }

    /**
     * 关闭侧边栏
     */
    public closePage() {
        this.state.close = true;
        setTimeout(() => {
            this.backPrePage();
        }, 200);
        this.paint();
    }

    /**
     * 扫描二维码
     */
    public scanQrcode() {
        doScanQrCode((res) => {
            console.log(res);
        });
    }

    /**
     * 展示我的二维码
     */
    public showMyQrcode() {
        popNew('app-view-mine-other-addFriend');
        // this.backPrePage();
    }

    /**
     * 创建钱包
     */
    public login() {
        if (this.state.hasWallet) {
            popNew('app-view-mine-account-home');
        } else {
            popNew('app-view-wallet-create-home');
        }
        // this.backPrePage();
    }
}

// ===================================================== 本地
// ===================================================== 立即执行
register('curWallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('userInfo', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});
register('languageSet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});