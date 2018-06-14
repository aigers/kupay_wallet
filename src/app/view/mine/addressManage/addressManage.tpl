{{let content = it1.content1}}
{{if it1.showtype==2}}
    {{: content=it1.content2}}
{{end}}
<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #f9f9f9;">
    <div w-class="ga-top-banner">
        <img src="../../../res/image/btn_back.png" w-class="ga-back" on-tap="goback"/>
        <span w-class="ga-banner-title">
            <span w-class="titleitem {{it1.showtype==1?'isactive':''}}" style="border-radius: 8px 0 0 8px;" on-tap="tabchange(e,1)">我的地址</span>
            <span w-class="titleitem {{it1.showtype==2?'isactive':''}}" style="border-radius: 0 8px 8px 0;" on-tap="tabchange(e,2)">联系人</span>
        </span>
        <img src="../../../res/image/btn_trans_cont.png" w-class="ga-banner-btn" on-tap="goNotice(e)"/>
    </div>
    <div w-class="coinlist">
        {{for ind,val of it1.coins}}
            <span w-class="coinitem {{it1.selectnum==ind?'coinselect':''}}" on-tap="coinchange(e,{{ind}})">{{val.name}}</span>
        {{end}}
    </div> 
    <div w-class="addNewaddr" on-tap="addNewaddr">
        <img src="../../../res/image/btn_address_add.png" w-class="addbtn"/>
    </div>                             
    <div w-class="addressmanageContent" class="hide-scrollbar" style="overflow-y: auto;overflow-x: hidden;">
        {{for ind,val of content}}
            <addressitem$>{{val}}</addressitem$>
        {{end}}
    </div>           
</div>