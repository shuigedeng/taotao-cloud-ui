# lsj-upload

### 插件地址：https://ext.dcloud.net.cn/plugin?id=5459

### 不清楚使用方式可导入示例项目运行完整示例

希望能帮到你！

使用插件有任何问题欢迎加入QQ讨论群：701468256

若能帮到你还请点亮5颗小星星以作鼓励哈~
---

## 使用说明
| 属性		| 是否必填	|  值类型	| 默认值	| 说明			|
| --------- | -------- 	| -----: 	| --: 	| :------------:|
| option	|	是 		| Object	|-		| 上传附件的接口地址和参数|
| width		|	否 		| String	|100%	| 容器宽度		|
| height	|	否 		| String	|80rpx	| 容器高度		|
| size		|	否 		| Number	|10		| 附件大小上限(M)|
| top,left,right,bottom		|	否 		| [Number,String]	|0		| 设置控件绝对位置，仅App端position=absolute时有效，其他端若需要绝对定位可自行在外层设置css position样式|
| value		|	否 		| Number	|0		| 上传进度，通过v-model双向绑定|
| childId	|	否 		| String	|lsjUpload| 控件的id(仅APP有效，尽量每个控件命名一个唯一Id)|
| position	|	否 		| String	|static	| 控件的排版位置(仅APP有效，static=控件随页面滚动;absolute=控件在页面中绝对定位，不随窗口内容滚动;nvue仅支持absolute)|
| @input	|	否 		| Function	|value	| 上传进度改变时回调|
| @callback	|	是 		| Function	|Object	| 上传成功时回调	|

## ref调用
|作用 | 方法| 传入参数类型|  说明|
|---- | --------- | -------- | :--: |
|渲染控件| show|Object| 需要手动渲染控件时调用,可见示例项目|
|隐藏控件| hide|-		| APP端手动隐藏webview层，用于切换tab视图,可见示例项目|

## 注意 
### 重要提示： 
### show() 需要在this.$nextTick内调用
### hide() 函数调用时机
### 因为是覆盖了一层webview窗口在视图上，若窗口有切换tab或弹出prop层，需要调用hide来禁止控件触发点击（调用show恢复）

### vue:
``` javascript
<lsj-upload 
ref="lsjUpload"
width="100px"
height="80rpx"
childId="upload"
:size="10"
:option="option"
v-model="percent"
@input="onInput"
@callback="onCallback">
	<view class="btn" style="height: 80rpx;">选择附件上传</view>
</lsj-upload>
```

---
* 函数说明


``` javascript
/*  */
export default {
	data() {
		return {
			option: {},
			tabIndex: 0,
			percent: '',
			list:[]
		}
	},
	onReady() {
		// 初始化参数并创建上传DOM
		this.option = {
			// #ifdef APP-PLUS
			cuWebview: this.$mp.page.$getAppWebview(), // app必传 
			// #endif
			url: 'https://www.example.com/upload', //替换为你的接口地址
			name: 'file', // 附件key
			size: 10, // 附件上传大小上限(M)，默认10M
			debug: true,
			//根据你接口需求自定义请求头
			header: {
				'Authorization': 'token'
			},
			//根据你接口需求自定义body参数
			formData: {
				'orderId': 1000
			}
		};
	},
	methods: {
		add() {
			this.list.push('DOM重排测试');
		},
		open() {
			uni.navigateTo({
				url:'../nvue-demo/nvue-demo'
			})
		},
		onTab(tabIndex) {
			this.tabIndex = tabIndex;
			
			if (tabIndex == 0 ) {
				this.$nextTick(()=>{
					this.$refs.lsjUpload.show();
				})
			}
			else {
				this.$refs.lsjUpload.hide();
			}
			
		}
		onInput(e) {
			console.log('上传进度',e);
		},
		onCallback(e) {
			console.log('上传结果',e);
		}
	}
}

```

## 温馨提示
	
* 文件上传
0. 如说明表达还不够清楚，怎么调用可导入完整示例项目运行体验和查看	
1. APP端请优先联调Android,上传成功后再运行iOS端，如iOS返回status=0则需要后端开启允许跨域；
2. header的Content-Type类型需要与服务端要求一致，否则收不到附件（服务端若没有明文规定则可不写，使用默认匹配）
3. 服务端不清楚怎么配置跨域可加群咨询，具体百度~
4. 欢迎加入QQ讨论群：701468256(已满)
5. 欢迎加入QQ讨论群：469580165
6. 欢迎加入QQ讨论群：469580165
7. 若能帮到你还请点亮5颗小星星以作鼓励哈~
8. 若能帮到你还请点亮5颗小星星以作鼓励哈~
9. 若能帮到你还请点亮5颗小星星以作鼓励哈~