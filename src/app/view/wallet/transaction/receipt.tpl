<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <img src="../../../res/image1/topbar_backimg.png" style="position: absolute;top: 0;right: 0;"/>
    <div w-class="top-head" ev-next-click="doScanClick">
        <app-components1-topBar-topBar>{"title":"{{it.currencyName + it1.cfgData.topBarTitle}}",background:"transparent"}</app-components1-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="main">
            <div w-class="title">
                <img src="../../../res/image1/default_avatar.png" w-class="avatar"/>
                <div>{{it1.cfgData.title}}</div>
            </div>
            <div w-class="content">
                <div w-class="qrcode-container"><app-components-qrcode-qrcode>{value:{{it1.fromAddr}},size:400}</app-components-qrcode-qrcode></div>
                <div w-class="addr-container">{{it1.fromAddr}}<img src="../../../res/image/copy.png" w-class="copy" on-tap="copyClick"/></div>
                <div w-class="btn-container" ev-btn-tap="shareClick"><app-components1-btn-btn>{"name":{{it1.cfgData.btnName}},"types":"big","color":"white"}</app-components1-btn-btn></div>
            </div>
        </div>
    </div>
</div>