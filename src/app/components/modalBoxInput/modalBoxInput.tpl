<div w-class="modal-mask" class="new-page">
    <div w-class="body">
        <div w-class="title">
            {{it.title}}
            <span w-class="forgetPsw" on-tap="foegetPsw">{{it1.cfgData.forgetPsw}}</span>
        </div>
        <div w-class="content">
            {{for ind,val of it.content}}
            <p>{{val}}</p>
            {{end}}
        </div>

        <div style="height: 90px;border-bottom: 1px solid #3294E6;" ev-input-change="change">
            <app-components1-input-input>{placeHolder: {{it.placeholder?it.placeholder:""}},itype:{{it.itype?it.itype:"text"}},style:"padding:0;font-size:28px;" }</app-components1-input-input>
        </div>
        <div w-class="btns">
            <div w-class="btn-cancel" on-tap="cancelBtnClick">{{it.cancelText ? it.cancelText : it1.cfgData.cancelText}}</div>
            <div w-class="btn-ok" on-tap="okBtnClick">{{it.sureText ? it.sureText : it1.cfgData.sureText}}</div>
        </div>
    </div>
</div>