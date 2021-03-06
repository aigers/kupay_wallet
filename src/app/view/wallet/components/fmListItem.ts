/**
 * 理财列表item
 */
import { Widget } from '../../../../pi/widget/widget';
import { Product } from '../../../store/interface';
import { getLanguage } from '../../../utils/tools';
interface Props {
    product:Product;
}
export class FmListItem extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {
            cfgData:getLanguage(this)
        };
        this.init();
    }
    public init() {
        console.log(this.props.product);
    }
}