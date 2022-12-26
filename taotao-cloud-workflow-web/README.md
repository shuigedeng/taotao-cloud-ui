# 四联原型地址
https://modao.cc/app/UAp3GdAErcopxbZwOjpFvL #四联疫情防控v0.2-四联疫情防控v0.2  

# jnpf-web

## 环境要求

- Node.js 最新版本
- git

## 使用说明
### 安装依赖
```bash
npm i

# 如果下载速度比较慢，可通过以下方式解决
npm i --registry=https://registry.npm.taobao.org
```
### 开发环境
- 打开`src/utils/define.js`,修改接口地址
```bash
  // 开发环境接口配置
  const APIURl = 'http://192.168.0.25:30000'
```
- 运行前端项目(默认会自动打开浏览器)
```bash
npm run dev
```

### 测试生产发布
```bash
# 构建测试环境,对应.env.staging文件配置
npm run build:staging

# 构建生产环境，对应.env.production文件配置
npm run build
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix


```

# 代申请
```
({ formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {
    
    // 在此编写代码
    
    if (formData.dateField105 != null) {
        return false;
    }
    let treeData = null;
    let addressIds = [];
    request('/api/oauth/CurrentUser').then((res) => {
        console.log('res.data.userInfo',res.data.userInfo)
        setFormData('createUserField101', res.data.userInfo.userName)
        setFormData('currOrganizeField119', res.data.userInfo.organizeName)
        setFormData('currPositionField102', res.data.userInfo.departmentName)
        
    })
    
    request('/api/system/Area/tree','get',{maxDept:3}).then((res) => {
        treeData = res.data
        // console.log('res.data', res.data)
        console.log('formData---')
        if (uni) {
            uni.getLocation({ //获取定位
                type: 'gcj02',
                geocode: true,
                success: function (res) {
                    console.log(JSON.stringify(res))
                    let locationAddress = res.address;
                    //省
                    let currentArea = treeData.filter((item)=>{
                        return item.fullName.indexOf(locationAddress.province) != -1
                    })[0]
                    addressIds.push(currentArea.id)
                    //市
                    let cityArea = currentArea.children.filter((item)=>{
                        return item.fullName.indexOf(locationAddress.city) != -1
                    })
                    
                    if(cityArea.length > 0){
                        //区
                        let districtArea = cityArea[0].children.filter((item)=>{
                            return item.fullName.indexOf(locationAddress.district) != -1
                        })[0]
                        addressIds.push(cityArea[0].id);
                        addressIds.push(districtArea.id);
                    }else{
                        //区
                        let district = currentArea.children.map((item)=>{
                            return item.children
                        })
                        let districtAreaList = [].concat.apply([], district)
                        let districtArea = districtAreaList.filter((item)=>{
                            return item.fullName.indexOf(locationAddress.district) != -1
                        })[0]
                        //通过区ID反推市ID（市ID为区ID前4位）
                        let cityId = districtArea.id.slice(0, 4);
                        addressIds.push(cityId)
                        addressIds.push(districtArea.id)
                    }
                    setFormData('addressField121', addressIds)   
                }
            });
            
        }
    })
   
}

```

# 返回常驻地

```
({ formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {
    // 在此编写代码
    if (formData.dateField103 != null) {
        return false;
    }
    request('/api/oauth/CurrentUser').then((res) => {
        let data = res.data.userInfo;
        let positionNames = data.positionIds.map((item) => {
            return item.name
        }).join(',') || '';
        setFormData('createUserField101', data.userName)
        setFormData('currOrganizeField110', data.organizeName)
        setFormData('currPositionField102', positionNames)
    })
}
```

# 离开常驻地

```
({ formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {
    // 在此编写代码
    if (formData.dateField103 != null) {
        return false;
    }
    let treeData = null;
    let addressIds = [];
    setShowOrHide('addressField116', false);
    request('/api/oauth/CurrentUser').then((res) => {
        let data = res.data.userInfo;
        let positionNames = data.positionIds.map((item) => {
            return item.name
        }).join(',') ||'';
        setFormData('createUserField101', data.userName)
        setFormData('currOrganizeField114', data.organizeName)
        setFormData('currPositionField102', positionNames)
    })
    request('/api/system/Area/tree', 'get', { maxDept: 3 }).then((res) => {
        treeData = res.data
        console.log('res.data', res.data)
        
        if (uni) {
            setShowOrHide('addressField116', true);
            uni.getLocation({ //获取定位
                type: 'gcj02',
                geocode: true,
                success: function (res) {
                    console.log(JSON.stringify(res))
                    let locationAddress = res.address;
                    //省
                    let currentArea = treeData.filter((item) => {
                        return item.fullName.indexOf(locationAddress.province) != -1
                    })[0]
                    addressIds.push(currentArea.id)
                    //市
                    let cityArea = currentArea.children.filter((item) => {
                        return item.fullName.indexOf(locationAddress.city) != -1
                    })

                    if (cityArea.length > 0) {
                        //区
                        let districtArea = cityArea[0].children.filter((item) => {
                            return item.fullName.indexOf(locationAddress.district) != -1
                        })[0]
                        addressIds.push(cityArea[0].id);
                        addressIds.push(districtArea.id);
                    } else {
                        //区
                        let district = currentArea.children.map((item) => {
                            return item.children
                        })
                        let districtAreaList = [].concat.apply([], district)
                        let districtArea = districtAreaList.filter((item) => {
                            return item.fullName.indexOf(locationAddress.district) != -1
                        })[0]
                        //通过区ID反推市ID（市ID为区ID前4位）
                        let cityId = districtArea.id.slice(0, 4);
                        addressIds.push(cityId)
                        addressIds.push(districtArea.id)
                    }
                    setFormData('addressField116', addressIds)
                }
            });

        }
    })
}
```
## 离开常驻地 》 查询目的地中、高风险区
```
({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {
    // 在此编写代码 addressField105
    let params = {};
    let ids = null;
    if (formData.addressField105.length > 0) {
        console.log('formData.addressField105', formData.addressField105)
        ids = formData.addressField105.map((item) => {
            return item[1]
        });
        let currentIds = Array.from(new Set(ids)).join(',');

        console.log('currentIds', currentIds)
        request('/api/yiqing/listByProvince', 'get', { ids: currentIds }).then((res) => {
            let data = res.data
            let newData = data.map((item) => {
                return item.yiQingPreventions
            })
            let yiQingPreventions = [].concat.apply([], newData);
            if (yiQingPreventions.length == 0) {

                console.log(typeof uni)
                if (typeof uni == 'undefined') {
                    this.$alert('目的地无中高风险区域', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                } else {
                    uni.showModal({
                        title: '提示',
                        content: `目的地无中高风险区域`,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                }
                return false;

            }
            let highArea = yiQingPreventions.filter((item) => {
                return item.level == '高风险'
            })
            let middleArea = yiQingPreventions.filter((item) => {
                return item.level == '中风险'
            })
            let higtText = `高风险：\n`;
            let higtTextPc = '<h3>高风险</h3>'
            if (highArea.length > 0) {
                for (let i = 0; i < highArea.length; i++) {
                    higtText += `${highArea[i].province}${highArea[i].city}${highArea[i].county}${highArea[i].village} \n`;
                    higtTextPc += `<p>${highArea[i].province}${highArea[i].city}${highArea[i].county}${highArea[i].village}</p>`
                }
                // setShowOrHide('textareaField128', true);
                // setFormData('textareaField128', higtText)
            }
            let middleText = `中风险：\n`;
            let middleTextPc = '<h3>中风险</h3>';
            if (middleArea.length > 0) {
                for (let i = 0; i < middleArea.length; i++) {
                    middleText += `${middleArea[i].province} ${middleArea[i].city} ${middleArea[i].county} ${middleArea[i].village} \n`;
                    middleTextPc += `<p>${middleArea[i].province} ${middleArea[i].city} ${middleArea[i].county} ${middleArea[i].village}</p>`
                }
                // setShowOrHide('textareaField127', true);
                // setFormData('textareaField127', middleText)
            }
            if (typeof uni == 'undefined') {
                this.$alert(`${higtTextPc}${middleTextPc}`, '提示', {
                    dangerouslyUseHTMLString: true
                });
            } else {
                uni.showModal({
                    title: '提示',
                    content: `${higtText}${middleText}`,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            }

        })
    }
}
```
## 离开常驻地 》查询目的地现有确诊人数

```
({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {
    // 在此编写代码 addressField105
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    let currentDay = `截至${m}月${d}日${hh}时${mm}分  数据统计`
    let ids = null;
    if (formData.addressField105.length > 0) {
        console.log('formData.addressField105', formData.addressField105)
        ids = formData.addressField105.map((item) => {
            return item[0]
        });
        let currentIds = Array.from(new Set(ids)).join(',');

        request('/api/yiqing/listByProvinceWithUser', 'get', { ids: currentIds }).then((res) => {
            let data = res.data;
            let newData = data.map((item) => {
                return item.yiQingPreventions
            })
            let yiQingPreventions = [].concat.apply([], data);
            let _date = `${currentDay} \n`;
            let _html = '';
            for (let i = 0; i < yiQingPreventions.length; i++) {
                let item = yiQingPreventions[i].yiQingDistribution;
                if (item != null) {
                    _html += `${item.cityName} \n 新增本土确诊${item.confirmedIncrStr} | 新增本土无症状${item.mainlandConfirmedIncrStr} \n`
                }
            }

            if (_html == '') {
                _html = '目的地均无新增病例'
            }
            if (typeof uni == 'undefined') {
                this.$alert(`${_date}${_html}`, '提示', {
                    dangerouslyUseHTMLString: true
                });
            } else {
                uni.showModal({
                    title: '提示',
                    content: `${_date}${_html}`,
                    cancelText: '关闭',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
             }
        })
    }
}

```

## 员工异常情况填报表 ≥ 表单unload
```
({ formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {
    // 在此编写代码

    //分类1 详情&居住地社区意见
    setShowOrHide('comInputField122', false);
    setShowOrHide('comInputField123', false);

    //分类2 详情&居住地社区意见
    setShowOrHide('comInputField114', false);
    setShowOrHide('comInputField124', false);

    //分类3 详情&居住地社区意见
    setShowOrHide('comInputField115', false);
    setShowOrHide('comInputField125', false);

    //分类4 详情&居住地社区意见
    setShowOrHide('comInputField118', false);
    setShowOrHide('comInputField126', false);

    //分类5 详情&居住地社区意见
    setShowOrHide('comInputField119', false);
    setShowOrHide('comInputField127', false);

    //分类6 详情&居住地社区意见
    setShowOrHide('comInputField111', false);
    setShowOrHide('comInputField128', false);
}

```

## 员工异常情况填报表 ≥ 人员分类change
```
({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {
    // 在此编写代码
    setShowOrHide('comInputField122', false);
    setShowOrHide('comInputField123', false);
    setShowOrHide('comInputField114', false);
    setShowOrHide('comInputField124', false);
    setShowOrHide('comInputField115', false);
    setShowOrHide('comInputField125', false);
    setShowOrHide('comInputField118', false);
    setShowOrHide('comInputField126', false);
    setShowOrHide('comInputField119', false);
    setShowOrHide('comInputField127', false);
    setShowOrHide('comInputField111', false);
    setShowOrHide('comInputField128', false);
    let typeList = formData.checkboxField108;
    for (let i = 0; i < typeList.length; i++){
        switch (typeList[i]) {
            case '1':
                //分类1 详情&居住地社区意见
                setShowOrHide('comInputField122', true);
                setShowOrHide('comInputField123', true);

                continue;
            case '2':
                //分类2 详情&居住地社区意见
                setShowOrHide('comInputField114', true);
                setShowOrHide('comInputField124', true);

                continue;
            case '3':
                //分类3 详情&居住地社区意见
                setShowOrHide('comInputField115', true);
                setShowOrHide('comInputField125', true);
                
                continue;
            case '4':
                //分类4 详情&居住地社区意见
                setShowOrHide('comInputField118', true);
                setShowOrHide('comInputField126', true);
                
                continue;
            case '5':
                //分类5 详情&居住地社区意见
                setShowOrHide('comInputField119', true);
                setShowOrHide('comInputField127', true);
                
                continue;
            case '6':
                //分类6 详情&居住地社区意见
                setShowOrHide('comInputField111', true);
                setShowOrHide('comInputField128', true);

                continue;
        }
    }
}


```
## 常见问题

- 出现`
npm ERR! fatal: unable to access 'https://github.com/nhn/raphael.git/': Failed connect to github.com:443; Connection timed out`报错

Windows环境下，打开`C:\Windows\System32\drivers\etc\host`文件，添加以下内容

```bash
52.74.223.119  github.com
```

参考文档`https://hknaruto.blog.csdn.net/article/details/105134485`
