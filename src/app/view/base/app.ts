/**
 * 首页
 */
// ================================ 导入
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { applyAutoLogin, autoLogin, setUserInfo } from '../../net/pull';
import { LoginState, UserInfo } from '../../store/interface';
import { find, register } from '../../store/store';
import { getLanguage } from '../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_modules : any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class App extends Widget {
    public old: any = {};
    public create() {
        super.create();
        this.init();
    }

    public init(): void {
        const isActive = 3;
        this.old[isActive] = true;

        const cfg = getLanguage(this);

        const loading = localStorage.getItem('level_2_page_loaded') ? false : true;
        localStorage.removeItem('level_2_page_loaded');

        this.state = {
            type: 2, // 用户可以单击选项，来切换卡片。支持3种模式，惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。
            isActive,
            old: this.old,
            loading,
            tabBarList: [{
                text: cfg.taps[0],
                icon: 'play.png',
                iconActive: 'play_active.png',
                components: 'app-view-play-home-home'
            },
            {
                text: cfg.taps[1],
                icon: 'chat.png',
                iconActive: 'chat_active.png',
                components: 'app-view-chat-home-home'
            },
            {
                text: cfg.taps[2],
                icon: 'earn.png',
                iconActive: 'earn_active.png',
                components: 'app-view-earn-home-home'
            }, 
            {
                text: cfg.taps[3],
                icon: 'wallet.png',  
                iconActive: 'wallet_active.png',
                components: 'app-view-wallet-home-home'
            }],
            cfgData:cfg

        };
    }
    public closeLoading() {
        this.state.loading = false;
        this.paint();
    }
    public async tabBarChangeListener(event: any, index: number) {
        if (this.state.isActive === index) return;
        this.state.isActive = index;
        this.old[index] = true;
        this.paint();
    }

}

// ===================================================== 本地
// ===================================================== 立即执行

register('level_2_page_loaded',(loaded:boolean) => {
    const dataCenter = pi_modules.commonjs.exports.relativeGet('app/logic/dataCenter').exports.dataCenter;
    dataCenter.init();
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.closeLoading();
    } else { // 处理导航页过程中资源已经加载完毕
        localStorage.setItem('level_2_page_loaded','1');
    }
});

// 用户信息变化
register('userInfo',(userInfo:UserInfo) => {
    const loginState = find('loginState');
    if (loginState === LoginState.logined && userInfo && !userInfo.fromServer) {
        setUserInfo();
    }
});

// 连接建立 登录
register('conRandom',(conRandom:string) => {
    if (conRandom && find('token')) {
        autoLogin();
    }
});

// 登录状态成功
register('loginState',(loginState:LoginState) => {
    if (loginState === LoginState.logined) {
        const userInfo = find('userInfo');
        if (userInfo && !userInfo.fromServer) {
            setUserInfo();
        }
        if (!find('token')) {
            applyAutoLogin();
        }
    }
});