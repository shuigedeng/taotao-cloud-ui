import WORKFLOWTreeSelect from '@/components/WORKFLOW-treeSelect'
import topOperation from '@/components/WORKFLOW-topOperation/index'
import tableOperation from '@/components/WORKFLOW-tableOperation'
import Pagination from '@/components/Pagination'
import WORKFLOWTable from '@/components/WORKFLOW-table'
import UserBox from '@/components/WORKFLOW-userBox'
import Screenfull from '@/components/Screenfull'
import ColumnSettings from '@/components/ColumnSettings'
import WORKFLOWQuill from '@/components/WORKFLOWEditor/quill'
import UserSelect from '@/components/WORKFLOW-userSelect'
import uploadBtn from '@/components/WORKFLOW-uploadBtn'
// 代码生成器专供
import WORKFLOWText from '@/components/Generator/components/WORKFLOWText'
import WorfkflowBarcode from '@/components/Generator/components/WorfkflowBarcode'
import WorfkflowQrcode from '@/components/Generator/components/WorfkflowQrcode'
import WorfkflowButton from '@/components/Generator/components/WorfkflowButton'
import WORKFLOWUploadFz from '@/components/Generator/components/Upload/UploadFz'
import WORKFLOWUploadImg from '@/components/Generator/components/Upload/UploadImg'
import PopupSelect from '@/components/Generator/components/PopupSelect'
import PopupAttr from '@/components/Generator/components/PopupAttr'
import NumRange from '@/components/Generator/components/NumRange'
import ComSelect from '@/components/Generator/components/ComSelect'
import DepSelect from '@/components/Generator/components/DepSelect'
import PosSelect from '@/components/Generator/components/PosSelect'
import DicSelect from '@/components/Generator/components/DicSelect'
import BillRule from '@/components/Generator/components/BillRule'
import WORKFLOWInputTable from '@/components/Generator/components/InputTable'
import WORKFLOWAddress from '@/components/Generator/components/Address'
import GroupTitle from '@/components/Generator/components/GroupTitle'
import RelationForm from '@/components/Generator/components/RelationForm'
import RelationFormAttr from '@/components/Generator/components/RelationFormAttr'
import Calculate from '@/components/Generator/components/Calculate'

export default {
  install(Vue, options) {
    Vue.component('WORKFLOWTreeSelect', WORKFLOWTreeSelect)
    Vue.component('topOpts', topOperation)
    Vue.component('tableOpts', tableOperation)
    Vue.component('Pagination', Pagination)
    Vue.component('WORKFLOWTable', WORKFLOWTable)
    Vue.component('uploadBtn', uploadBtn)
    Vue.component('UserBox', UserBox)
    Vue.component('WORKFLOWText', WORKFLOWText)
    Vue.component('WorfkflowBarcode', WorfkflowBarcode)
    Vue.component('WorfkflowQrcode', WorfkflowQrcode)
    Vue.component('WorfkflowButton', WorfkflowButton)
    Vue.component('WORKFLOWUploadFz', WORKFLOWUploadFz)
    Vue.component('WORKFLOWUploadImg', WORKFLOWUploadImg)
    Vue.component('PopupSelect', PopupSelect)
    Vue.component('PopupAttr', PopupAttr)
    Vue.component('NumRange', NumRange)
    Vue.component('ComSelect', ComSelect)
    Vue.component('DepSelect', DepSelect)
    Vue.component('PosSelect', PosSelect)
    Vue.component('UserSelect', UserSelect)
    Vue.component('DicSelect', DicSelect)
    Vue.component('BillRule', BillRule)
    Vue.component('WORKFLOWInputTable', WORKFLOWInputTable)
    Vue.component('WORKFLOWAddress', WORKFLOWAddress)
    Vue.component('GroupTitle', GroupTitle)
    Vue.component('RelationForm', RelationForm)
    Vue.component('RelationFormAttr', RelationFormAttr)
    Vue.component('Calculate', Calculate)
    Vue.component('WORKFLOWQuill', WORKFLOWQuill)
    Vue.component('Screenfull', Screenfull)
    Vue.component('ColumnSettings', ColumnSettings)
  }
}
