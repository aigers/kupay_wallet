/**
 * 内存中的数据结构
 */

 // 创建钱包方式
export enum CreateWalletType {
     Random = 1,// 普通随机创建
     Image,// 通过图片创建
     StrandarImport,// 普通导入
     ImageImport,// 图片导入
     FragmentImport// 片段导入
 }
// 枚举登录状态
export enum LoginState {
    init = 0,
    logining,
    logined,
    relogining,
    logouting,
    logouted,
    logerror
}

// 云端货币类型
export enum CurrencyType {
    CNYT = 99,// 临时
    KT = 100,
    ETH,
    BTC
}

// 枚举云端货币类型
export const CurrencyTypeReverse = {
    99 : 'CNYT',
    100: 'KT',
    101: 'ETH',
    102:'BTC'
};

// 红包类型
export enum RedEnvelopeType {
    Normal = '00',
    Random = '01',
    Invite = '99'
}

// 矿工费等级
export enum MinerFeeLevel {
    STANDARD,
    FAST,
    FASTEST
}

// btc矿工费等级
export const priorityMap = {
    [MinerFeeLevel.STANDARD]: 36,
    [MinerFeeLevel.FAST]: 18,
    [MinerFeeLevel.FASTEST]: 12
};

// 交易状态
export enum TxStatus {
    PENDING, // 打包中
    CONFIRMED, // 确认 >= 1个区块确认
    FAILED, // 失败
    SUCCESS// 成功  一定的区块确认后认为succss
}
// 交易类型
export enum TxType {
    TRANSFER = 1, // 普通转账
    RECEIPT, // 收款
    RECHARGE,// 充值
    EXCHANGE // 币币兑换
}
// store数据管理
export interface Store {
    flag:any;// 代码过程中需要使用的标识
    // 基础数据
    hashMap: Map<string, string>;// 输入密码后hash缓存
    salt: string;// 盐--加密时使用
    conUser: string;// 连接用户
    conUserPublicKey: string;// 连接用户公钥
    conRandom: string;// 连接随机数
    conUid: number;// 连接uid
    userInfo:any;// 用户头像base64
    loginState: LoginState;// 连接状态
    lockScreen:LockScreen;// 锁屏相关
    token:string;// 自动登录token
    // 本地钱包
    walletList: Wallet[];// 钱包数据
    curWallet: Wallet;// 当前钱包
    addrs: Addr[];// 地址数据
    transactions: TransRecordLocal[];// 交易记录
    nonceMap:Map<string,number>;// 维护本地的nonce
    gasPrice:object;// gasPrice档次(3档)
    btcMinerFee:object;// btn minerFee档次(3档)
    gasLimitMap:Map<string,number>;// gasLimit
    realUserMap:Map<string,boolean>;// 真实用户map
    // 云端数据
    cloudBalance: Map<CurrencyType, number>;// 云端账户余额
    // tslint:disable-next-line:type-literal-delimiter
    accountDetail: Map<CurrencyType, {list:AccountDetail[],start:number,canLoadMore:boolean}>;// 云端账户详情
    sHisRec:SHisRec;// 发送红包记录
    cHisRec:CHisRec;// 兑换红包记录
    inviteRedBagRec:CHisRec;// 邀请红包记录
    miningTotal:MiningTotal;// 挖矿汇总信息
    dividTotal:DividTotal;// 分红汇总信息
    miningHistory:DividendHistory;// 挖矿历史记录
    dividHistory:DividendHistory;// 分红历史记录
    addMine:AddMineItem[];// 矿山增加项目
    mineRank:MineRank;// 矿山排名
    miningRank:MiningRank;// 挖矿排名
    mineItemJump:string;// 矿山增加项目跳转详情 
    // tslint:disable-next-line:type-literal-delimiter
    rechargeLogs:Map<CurrencyType, {list:RechargeWithdrawalLog[],start:number,canLoadMore:boolean}>;// 充值记录
    // tslint:disable-next-line:type-literal-delimiter
    withdrawLogs:Map<CurrencyType,{list:RechargeWithdrawalLog[],start:number,canLoadMore:boolean}>;// 提现记录
    // tslint:disable-next-line:type-literal-delimiter
    totalLogs:Map<CurrencyType,{list:AccountDetail[],start:number,canLoadMore:boolean}>;// 全部云端记录
    // shapeShift
    shapeShiftCoins:ShapeShiftCoin[];// shapeShift 支持的币种
    shapeShiftMarketInfo:MarketInfo;// shapeShift 汇率相关
    shapeShiftTxsMap:Map<string,ShapeShiftTxs>;// shapeshift 交易记录Map
    lastGetSmsCodeTime:number;
    languageSet:LanguageSet;
    currencyUnit:CurrencyUnit;//货币单位
    changeColor:ChangeColor;
    USD2CNYRate:number;// 人民币美元汇率
    currency2USDTMap:Map<string,currency2USDT>;// 货币对比USDT的比率
}

// tslint:disable-next-line:class-name
export interface currency2USDT {
    open:number; // 开盘价
    close:number; // 收盘价
}
/**
 * 云端用户基础数据
 */
export interface UserInfo {
    fromServer:boolean;// 数据来源
    nickName:string;// 昵称
    avatar:string;// 头像
}
/**
 * localstorage wallet object
 */
export interface WalletInfo {
    curWalletId: string;  // wallet id  (first address)
    salt: string;
    walletList: Wallet[];
}

/**
 * localstorage wallet object
 */
export interface Wallet {
    walletId: string;  // wallet id  (first address)
    avatar: string;
    walletPswTips?: string;// wallet password tips
    gwlt: string;  // Serialization EthWallet object
    showCurrencys: string[]; // home page show currencys
    currencyRecords: CurrencyRecord[];
}

/**
 * 货币记录
 */
export interface CurrencyRecord {
    currencyName: string; // currency Name 
    currentAddr: string;// current address
    addrs: string[];// address list
    updateAddr: boolean;
}

/**
 * 地址对象
 */
export interface Addr {
    addr: string;// 地址
    addrName: string;// 地址名
    balance: number;// 余额
    currencyName: string;// 货币类型
    record: any[];// 记录缓存
}

// /**
//  * 交易记录
//  */
// export interface TransactionRecord {
//     addr: string;// 地址
//     currencyName: string;// 货币类型
//     fees: number;// 矿工费
//     hash: number;// 交易hash
//     info: string;// 描述
//     time: number;// 时间
//     value: number;// 交易量
//     inputs?: string[];// 输入地址列表
//     outputs?: string[];// 输出地址列表
// }

/**
 * 本地缓存交易记录
 */
export interface TransRecordLocal {
    hash:string; // 交易hash
    addr:string;// 哪个地址的交易
    txType:TxType;// 交易类型 1 转账 2 收款 3 充值 4 币币兑换转账
    fromAddr:string;// 转账地址
    toAddr:string;// 收币地址
    pay:number;// 转账金额
    time:number;// 时间戳
    status:TxStatus;// 交易状态
    confirmedBlockNumber:number;// 已确认区块数
    needConfirmedBlockNumber:number;// 需要确认得区块数
    info:string;// 交易额外信息
    currencyName:string;// 货币名称
    fee:number;// 矿工费
    nonce:number;// nonce
    minerFeeLevel?:MinerFeeLevel;// 矿工费档次
}

/**
 * 锁屏密码相关
 */
export interface LockScreen {
    psw?:string;// 锁屏密码
    open?:boolean;// 锁屏功能是否打开
    jump?:boolean;// 创建钱包后是否跳过锁屏设置,如果跳过,再次创建钱包时默认不再跳出锁屏设置
    locked?:boolean;// 是否3次解锁机会都用完
}

/**
 * 挖矿汇总信息
 */
export interface MiningTotal {
    totalNum:number; // 矿山总量
    thisNum:number;  // 本次可挖
    holdNum:number;  // 已挖数量
}

/**
 * 
 */
export interface DividTotal {
    totalDivid:number; // 累计分红
    thisDivid:number;  // 本次分红
    totalDays:number;  // 分红天数
    yearIncome:number; // 年华收益
}

/**
 * 挖矿，分红历史记录单项
 */
export interface DividendItem {
    num:number;
    time:string;
    total:number;
}

/**
 * 挖矿，分红历史记录
 */
export interface DividendHistory {
    list:DividendItem[];
    start:number;
    canLoadMore:boolean;
}

/**
 * 矿山增加项目
 */
export interface AddMineItem {
    isComplete:boolean;  // 是否已完成该挖矿步骤
    itemNum:number;  // 该项目已得到数量
}

/**
 * 矿山，挖矿排名单项
 */
export interface MineRankItem {
    index:number;// 名次
    name:string;// 用户名称
    num:number;// 矿山，挖矿总量
}

/**
 * 矿山排名
 */
export interface MineRank {
    minePage:number;  // 矿山排名列表页码
    mineMore:boolean;  // 矿山排名是否还有更多  
    mineList:any[];  // 矿山排名总列表
    mineRank:MineRankItem[];  // 矿山排名分页数据
    myRank:number; // 当前用户的排名
}

/**
 * 挖矿排名
 */
export interface MiningRank {
    miningPage:number;  // 挖矿排名列表页码
    miningMore:boolean;  // 挖矿排名是否还有更多  
    miningList:any[];  // 挖矿排名总列表
    miningRank:MineRankItem[];  // 挖矿排名分页数据
    myRank:number; // 当前用户的排名
}

/**
 * 发送红包记录
 */
export interface SHisRec {
    sendNumber:number;// 发送红包总数
    start:string;// 翻页start
    list:SRecDetail[];// 详情列表
}
/**
 * 发送红包记录详情
 */
export interface SRecDetail {
    rid:string;// 红包id
    rtype:number;// 红包类型
    ctype:number;// 币种
    ctypeShow:string;
    amount:number;// 金额
    time:number;// 时间
    timeShow:string;
    codes:string[];// 兑换码
    // curNum:number;// 已兑换数量
    // totalNum:number;// 红包总数量
}

/**
 * 兑换红包记录
 */
export interface CHisRec {
    convertNumber:number;// 兑换红包总数
    start:string;// 翻页start
    list:CRecDetail[];// 详情列表
}
/**
 * 兑换红包记录详情
 */
export interface CRecDetail {
    suid: number;// 发送者uid
    rid: string;// 红包id
    rtype: number;// 红包类型 0-普通红包，1-拼手气红包，99-邀请红包
    rtypeShow:string;
    ctype: number;// 币种
    ctypeShow:string;
    amount: number;// 金额
    time: number;// 时间
    timeShow:string;
    // curNum:number;// 已兑换数量
    // totalNum:number;// 红包总数量
}
/**
 * 红包详情
 */
export interface RedBag {
    suid:number;// 发送者uid
    cuid:number; // 兑换者uid
    rtype:number;// 红包类型
    ctype:number;// 货币类型
    amount:number;// 金额
    time:number;// 时间
    timeShow:string;
}
/**
 * shapeShift支持的货币类型
 */
export interface ShapeShiftCoin {
    // tslint:disable-next-line:no-reserved-keywords
    symbol:string;// 货币类型
    status:string;// 状态
    name:string;// 货币全称
    minerFee:number;// 矿工费
    image:string;// 图片url
    imageSmall:string;// 小图url
}
/**
 * shapeShift汇率相关
 */
export interface MarketInfo {
    rate:number;// 兑换汇率
    pair:string;// 交易对 eg:BTC_ETH
    minimum:number;// 最小发出数量
    maxLimit:number;// 最大发出数量
    minerFee:number;// 矿工费
    limit:number;// 限制数量
}
/**
 * shapeshift兑换记录详情
 */
export interface ShapeShiftTx  {
    hasConfirmations:string;// 是否确认
    inputAddress:string;// Address that the input coin was paid to for this shift
    inputAmount:number;// Amount of input coin that was paid in on this shift
    inputCurrency:string;// Currency type of the input coin
    inputTXID:string;// Transaction ID of the input coin going into shapeshift
    outputAddress:string;// Address that the output coin was sent to for this shift
    outputAmount:number;// Amount of output coin that was paid out on this shift
    outputCurrency:string;// Currency type of the output coin
    outputTXID:string;// Transaction ID of the output coin going out to user
    shiftRate:string;// The effective rate the user got on this shift.
    status:string;// status of the shift
    timestamp:number; // timestamp
}
/**
 * shapeshift兑换记录
 */
export interface ShapeShiftTxs {
    addr:string;// 这个地址的交易记录
    list:ShapeShiftTx[];// 交易记录列表
}
/**
 * 充值提现记录
 */
export interface RechargeWithdrawalLog {
    time:number; // timestamp
    timeShow:string;
    amount:number;// 金额
    status:number;// 状态码
    statusShow:string;
    hash:string;// 交易ha'sh
}

export enum TaskSid {
    recharge = 301,// 充值
    withdraw = 302,// 提现
    createWlt = 1001,// 创建钱包
    firstChargeEth = 1002,// 首次转入
    bindPhone = 1003,// 注册手机
    chargeEth = 1004,// 存币
    inviteFriends = 1005,// 邀请真实好友
    buyFinancial = 1007,// 购买理财产品
    transfer = 1008,// 交易奖励
    bonus = 1009,// 分红
    mines = 1010,// 挖矿
    chat = 1011,// 聊天
    financialManagement = 330, // 理财
    redEnvelope = 340 // 红包
}

export interface AccountDetail {
    iType: TaskSid;// 类型
    amount: number;// 数据
    behavior: string;// 标签
    time: number;// 时间
}

// 理财产品数据结构
export interface Product {
    id:string;
    title: string;
    profit: string;
    productName: string;
    productDescribe: string;
    unitPrice: number;
    coinType:string;
    days: string;
    total:number;
    surplus: number;
    purchaseDate: string;
    interestDate: string;
    endDate: string;
    productIntroduction: number;
    limit: any;
    lockday:string;
    isSoldOut:boolean;
    
}
// 购买记录数据结构
export interface PurchaseRecordOne {
    id:string;// 产品id
    yesterdayIncoming:any;// 昨日收益
    totalIncoming:any;// 总收益
    profit: string;// 预期年化收益
    productName: string;// 产品名称
    unitPrice: number;// 单价
    amount:number;// 购买数量
    coinType:string;// 购买币种
    days: string;// 累计天数
    purchaseDate: string;// 起购日
    interestDate: string;// 起息日
    endDate: string;// 结束日
    purchaseTimeStamp:string;// 购买时间戳
    productIntroduction: number;// 产品简介
    lockday:string;// 锁定期
    state:any;
}

// 语言配置
export interface LanguageSet {
    selected:number; // 当前选中的语言，0 简体中文，1 繁体中文，2 英文
    languageList:['simpleChinese','tranditionalChinese','English']; // 语言列表
}

// 涨跌颜色配置
export interface ChangeColor {
    selected:number; // 当前选中的涨颜色，0 红涨绿跌(红)，1 红跌绿涨(绿)
    colorList:['redUp','greenUp']; // 颜色列表
}

// 货币单位配置
export enum CurrencyUnit {
    CNY,
    USD
}
