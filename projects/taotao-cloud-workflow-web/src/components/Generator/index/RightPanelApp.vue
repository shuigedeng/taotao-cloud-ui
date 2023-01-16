<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px"
          labelPosition="left">
          <template v-if="activeData.__config__">
            <template v-if="$store.getters.hasTable">
              <template v-if="activeData.__config__.workflowKey === 'table'">
                <el-form-item
                  v-if="activeData.__vModel__ !== undefined && !noVModelList.includes(activeData.__config__.workflowKey)"
                  label="控件字段">
                  <el-input v-model="activeData.__vModel__" placeholder="请输入控件字段(v-model)"
                    disabled />
                </el-form-item>
              </template>
              <template v-else>
                <template v-if="!activeData.__config__.isSubTable">
                  <el-form-item
                    v-if="activeData.__vModel__!==undefined && !noVModelList.includes(activeData.__config__.workflowKey)"
                    label="数据库表" filterable>
                    <el-select v-model="activeData.__config__.tableName" placeholder="请选择数据库表"
                      @change="tableChange">
                      <el-option v-for="item in allTable" :key="item.table" :value="item.table"
                        :label="item.tableName?item.table+'('+item.tableName+')':item.table">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="activeData.__vModel__ !== undefined && !noVModelList.includes(activeData.__config__.workflowKey)"
                    label="控件字段">
                    <el-select v-model="activeData.__vModel__" placeholder="请选择控件字段(v-model)"
                      clearable @change="fieldChange" filterable>
                      <el-option v-for="item in fieldOptions" :key="item.realField"
                        :value="item.realField"
                        :label="item.fieldName?item.field+'('+item.fieldName+')':item.field">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="activeData.__config__.isSubTable && subTable.length">
                  <el-form-item
                    v-if="activeData.__vModel__ !== undefined && !noVModelList.includes(activeData.__config__.workflowKey)"
                    label="控件字段">
                    <el-select v-model="activeData.__vModel__" placeholder="请选择控件字段(v-model)"
                      clearable @change="fieldChange1" filterable>
                      <el-option
                        v-for="item in getSubTableFiled(activeData.__config__.relationTable)"
                        :key="item.field" :value="item.field"
                        :label="item.fieldName?item.field+'('+item.fieldName+')':item.field">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </template>
            </template>
            <template v-else>
              <el-form-item
                v-if="activeData.__vModel__ !== undefined && !noVModelList.includes(activeData.__config__.workflowKey)"
                label="控件字段">
                <el-input v-model="activeData.__vModel__" placeholder="请输入控件字段(v-model)" disabled />
              </el-form-item>
            </template>
            <el-form-item label="控件标题"
              v-if="activeData.__config__.label !== undefined && !['WORKFLOWText','card','groupTitle','tab','collapse','button'].includes(activeData.__config__.workflowKey)">
              <el-input v-model="activeData.__config__.label" placeholder="请输入控件标题" />
            </el-form-item>
            <el-form-item v-if="activeData.placeholder !== undefined" label="占位提示">
              <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
            </el-form-item>
            <el-form-item label="最多输入" v-if="activeData.maxlength !== undefined">
              <el-input v-model="activeData.maxlength" placeholder="请输入字符长度" type="number">
                <template slot="append">个字符</template>
              </el-input>
            </el-form-item>
            <template v-if="activeData.__config__.workflowKey === 'switch'">
              <el-form-item label="开启展示值">
                <el-input v-model="activeData.activeTxt" placeholder="请输入开启展示值" />
              </el-form-item>
              <el-form-item label="关闭展示值">
                <el-input v-model="activeData.inactiveTxt" placeholder="请输入关闭展示值" />
              </el-form-item>
            </template>
            <template
              v-if="activeData.__config__.workflowKey === 'uploadFz'||activeData.__config__.workflowKey === 'uploadImg'">
              <el-form-item label="文件类型" v-if="activeData.__config__.workflowKey === 'uploadFz'">
                <el-select v-model="activeData.accept" placeholder="不限制" clearable>
                  <el-option label="图片" value="image/*" />
                  <el-option label="视频" value="video/*" />
                  <el-option label="音频" value="audio/*" />
                  <el-option label="excel" value=".xls,.xlsx" />
                  <el-option label="word" value=".doc,.docx" />
                  <el-option label="pdf" value=".pdf" />
                  <el-option label="txt" value=".txt" />
                </el-select>
              </el-form-item>
              <el-form-item label="文件大小">
                <el-input v-model.number="activeData.fileSize" placeholder="请输入文件大小">
                  <el-select slot="append" v-model="activeData.sizeUnit" :style="{ width: '66px' }">
                    <el-option label="KB" value="KB" />
                    <el-option label="MB" value="MB" />
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="按钮文字" v-if="activeData.__config__.workflowKey === 'uploadFz'">
                <el-input v-model="activeData.buttonText" placeholder="请输入按钮文字" />
              </el-form-item>
              <el-form-item label="最大上传数">
                <el-input-number v-model="activeData.limit" :min="0" placeholder="最大上传数" :step="1"
                  controls-position="right" />
              </el-form-item>
            </template>
            <template
              v-if="activeData.__config__.workflowKey === 'numInput' ||activeData.__config__.workflowKey === 'slider'">
              <el-form-item label="最小值">
                <el-input-number v-model="activeData.min" placeholder="最小值"
                  controls-position="right" />
              </el-form-item>
              <el-form-item label="最大值">
                <el-input-number v-model="activeData.max" placeholder="最大值"
                  controls-position="right" />
              </el-form-item>
              <el-form-item label="步长">
                <el-input-number v-model="activeData.step" placeholder="步数" :min="1"
                  controls-position="right" />
              </el-form-item>
            </template>
            <template
              v-if="['radio', 'checkbox', 'select'].indexOf(activeData.__config__.workflowKey) > -1">
              <el-divider>数据选项</el-divider>
              <el-form-item label="" label-width="40px">
                <el-radio-group v-model="activeData.__config__.dataType" size="small"
                  style="text-align:center" @change="dataTypeChange">
                  <el-radio-button label="static">静态数据</el-radio-button>
                  <el-radio-button label="dictionary">数据字典</el-radio-button>
                  <el-radio-button label="dynamic">远端数据</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <template v-if="activeData.__config__.dataType === 'static'">
                <draggable :list="activeData.__slot__.options" :animation="340" group="selectItem"
                  handle=".option-drag">
                  <div v-for="(item, index) in activeData.__slot__.options" :key="index"
                    class="select-item">
                    <div class="select-line-icon option-drag">
                      <i class="icon-ym icon-ym-darg" />
                    </div>
                    <el-input v-model="item.fullName" placeholder="选项名" size="small" />
                    <el-input v-model="item.id" placeholder="选项值" size="small" />
                    <div class="close-btn select-line-icon"
                      @click="activeData.__slot__.options.splice(index, 1)">
                      <i class="el-icon-remove-outline" />
                    </div>
                  </div>
                </draggable>
                <div style="margin-left: 20px;">
                  <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline"
                    type="text" @click="addSelectItem">
                    添加选项
                  </el-button>
                </div>
              </template>
              <template v-if="activeData.__config__.dataType === 'dictionary'">
                <el-form-item label="远端数据">
                  <WORKFLOW-TreeSelect v-model="activeData.__config__.dictionaryType"
                    :options="treeData" placeholder="请选择数据字典" lastLevel clearable>
                  </WORKFLOW-TreeSelect>
                </el-form-item>
                <el-form-item label="存储字段">
                  <el-select v-model="activeData.__config__.props.value" placeholder="请选择存储字段">
                    <el-option label="id" value="id"></el-option>
                    <el-option label="enCode" value="enCode"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <template v-if="activeData.__config__.dataType === 'dynamic'">
                <el-form-item label="远端数据">
                  <WORKFLOW-TreeSelect :options="dataInterfaceSelector"
                    v-model="activeData.__config__.propsUrl" placeholder="请选择远端数据" lastLevel
                    lastLevelKey="categoryId" lastLevelValue="1" clearable />
                </el-form-item>
                <el-form-item label="存储字段">
                  <el-input v-model="activeData.__config__.props.value" placeholder="请输入存储字段" />
                </el-form-item>
                <el-form-item label="显示字段">
                  <el-input v-model="activeData.__config__.props.label" placeholder="请输入显示字段" />
                </el-form-item>
              </template>
              <el-divider></el-divider>
            </template>
            <template
              v-if="activeData.__config__.workflowKey === 'treeSelect' || activeData.__config__.workflowKey === 'cascader'">
              <el-divider>数据选项</el-divider>
              <el-form-item label="" label-width="40px">
                <el-radio-group v-model="activeData.__config__.dataType" size="small"
                  style="text-align:center" @change="dataTypeChange">
                  <el-radio-button label="static">静态数据</el-radio-button>
                  <el-radio-button label="dictionary">数据字典</el-radio-button>
                  <el-radio-button label="dynamic">远端数据</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <template v-if="activeData.__config__.dataType === 'static'">
                <!-- 级联选择静态树 -->
                <el-tree draggable :data="activeData.options" node-key="id"
                  :expand-on-click-node="false" :render-content="renderContent" :props="props" />
                <div style="margin-left: 20px;margin-bottom: 20px;">
                  <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline"
                    type="text" @click="addTreeItem">添加父级</el-button>
                </div>
              </template>
              <template v-if="activeData.__config__.dataType === 'dictionary'">
                <el-form-item label="远端数据">
                  <WORKFLOW-TreeSelect v-model="activeData.__config__.dictionaryType"
                    :options="treeData" placeholder="请选择数据字典" lastLevel clearable>
                  </WORKFLOW-TreeSelect>
                </el-form-item>
                <el-form-item label="存储字段">
                  <el-select v-model="activeData.props.props.value" placeholder="请选择存储字段">
                    <el-option label="id" value="id"></el-option>
                    <el-option label="enCode" value="enCode"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <template v-if="activeData.__config__.dataType === 'dynamic'">
                <el-form-item label="远端数据">
                  <WORKFLOW-TreeSelect :options="dataInterfaceSelector"
                    v-model="activeData.__config__.propsUrl" placeholder="请选择远端数据" lastLevel
                    lastLevelKey="categoryId" lastLevelValue="1" clearable />
                </el-form-item>
                <el-form-item label="存储字段">
                  <el-input v-model="activeData.props.props.value" placeholder="请输入存储字段" />
                </el-form-item>
                <el-form-item label="显示字段">
                  <el-input v-model="activeData.props.props.label" placeholder="请输入显示字段" />
                </el-form-item>
                <el-form-item label="子级字段">
                  <el-input v-model="activeData.props.props.children" placeholder="请输入子级字段" />
                </el-form-item>
              </template>
              <el-divider></el-divider>
            </template>
            <template v-if="activeData.__config__.workflowKey === 'WORKFLOWText'">
              <el-form-item label="文本内容">
                <el-input v-model="activeData.__config__.defaultValue" placeholder="请输入文本内容" />
              </el-form-item>
              <el-form-item label="行高">
                <el-input-number v-model="activeData.textStyle['line-height']" :min="12"
                  placeholder="请输入行高" controls-position="right" />
              </el-form-item>
              <el-form-item label="字体大小">
                <el-input-number v-model="activeData.textStyle['font-size']" :min="12"
                  placeholder="请输入字体大小" controls-position="right" />
              </el-form-item>
              <el-form-item label="对齐方式">
                <el-radio-group v-model="activeData.textStyle['text-align']">
                  <el-radio-button label="left">左对齐</el-radio-button>
                  <el-radio-button label="center">居中对齐</el-radio-button>
                  <el-radio-button label="right">右对齐</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="字体颜色">
                <el-color-picker v-model="activeData.textStyle['color']"></el-color-picker>
              </el-form-item>
              <el-form-item label="是否加粗">
                <el-switch v-model="activeData.textStyle['font-weight']" active-value="bold"
                  inactive-value="normal" />
              </el-form-item>
              <el-form-item label="是否斜体">
                <el-switch v-model="activeData.textStyle['font-style']" active-value="italic"
                  inactive-value="normal" />
              </el-form-item>
              <el-form-item label="下划线样式">
                <el-radio-group v-model="activeData.textStyle['text-decoration']">
                  <el-radio-button label="none">无样式</el-radio-button>
                  <el-radio-button label="underline">下划线</el-radio-button>
                  <el-radio-button label="line-through">删除线</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey === 'table'">
              <el-form-item label="关联子表" v-if="$store.getters.hasTable">
                <el-select v-model="activeData.__config__.tableName" placeholder="请选择关联子表" clearable
                  @change="onTableNameChange">
                  <el-option v-for="item in subTable" :key="item.table"
                    :label="item.tableName?item.table+'('+item.tableName+')':item.table"
                    :value="item.table">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="activeData.actionText !== undefined" label="动作文字">
                <el-input v-model="activeData.actionText" placeholder="请输入动作文字" />
              </el-form-item>
              <el-form-item label="是否合计">
                <el-switch v-model="activeData['show-summary']" />
              </el-form-item>
              <el-form-item label="合计字段" v-if="activeData['show-summary']">
                <el-select v-model="activeData.summaryField" multiple placeholder="请选择合计字段">
                  <template v-for="(item,i) in activeData.__config__.children">
                    <el-option :key="i" :label="item.__config__.label" :value="item.__vModel__"
                      v-if="['comInput','numInput','calculate'].includes(item.__config__.workflowKey)" />
                  </template>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey === 'groupTitle'">
              <el-form-item label="标题">
                <el-input v-model="activeData.content" placeholder="请输入标题" />
              </el-form-item>
              <el-form-item label="对齐方式">
                <el-radio-group v-model="activeData['content-position']">
                  <el-radio-button label="left">左对齐</el-radio-button>
                  <el-radio-button label="center">居中对齐</el-radio-button>
                  <el-radio-button label="right">右对齐</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey === 'date'">
              <el-form-item label="时间类型">
                <el-select v-model="activeData.type" placeholder="请选择时间类型">
                  <el-option label="日(date)" value="date" />
                  <el-option label="日期时间(datetime)" value="datetime" />
                </el-select>
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey === 'relationForm'">
              <el-form-item label="关联功能">
                <WORKFLOW-TreeSelect :options="featureData" v-model="activeData.modelId"
                  placeholder="请选择关联功能" lastLevel clearable @change="onModelIdChange" />
              </el-form-item>
              <el-form-item label="显示字段">
                <el-select v-model="activeData.relationField" placeholder="请选择显示字段"
                  @visible-change="visibleChange" clearable>
                  <el-option v-for="item in relationFormFieldOptions" :key="item.vmodel"
                    :label="item.label" :value="item.vmodel" />
                </el-select>
              </el-form-item>
              <el-divider>列表字段</el-divider>
              <draggable :list="activeData.columnOptions" :animation="340" group="selectItem"
                handle=".option-drag">
                <div v-for="(item, index) in activeData.columnOptions" :key="index"
                  class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="icon-ym icon-ym-darg" />
                  </div>
                  <el-select v-model="item.value" placeholder="请选择显示字段"
                    @visible-change="visibleChange" clearable
                    @change="onColumnFieldChange($event,item)">
                    <el-option v-for="item in relationFormFieldOptions" :key="item.vmodel"
                      :label="item.label" :value="item.vmodel" />
                  </el-select>
                  <div class="close-btn select-line-icon"
                    @click="activeData.columnOptions.splice(index, 1)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 29px;">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                  @click="addColumnOptionsItem">
                  添加字段
                </el-button>
              </div>
              <el-divider>分页设置</el-divider>
              <el-form-item label="列表分页">
                <el-switch v-model="activeData.hasPage"></el-switch>
              </el-form-item>
              <el-form-item label="分页条数" label-width="80px">
                <el-radio-group v-model="activeData.pageSize">
                  <el-radio-button :label="20">20条</el-radio-button>
                  <el-radio-button :label="50">50条</el-radio-button>
                  <el-radio-button :label="100">100条</el-radio-button>
                  <el-radio-button :label="500">500条</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-divider />
            </template>
            <template v-if="activeData.__config__.workflowKey === 'popupSelect'">
              <el-form-item label="远端数据">
                <WORKFLOW-TreeSelect :options="dataInterfaceSelector" v-model="activeData.interfaceId"
                  placeholder="请选择远端数据" lastLevel lastLevelKey='categoryId' lastLevelValue='1'
                  clearable>
                </WORKFLOW-TreeSelect>
              </el-form-item>
              <el-form-item label="存储字段">
                <el-input v-model.number="activeData.propsValue" placeholder="请输入存储字段" />
              </el-form-item>
              <el-form-item label="显示字段">
                <el-input v-model="activeData.relationField" placeholder="请输入显示字段" />
              </el-form-item>
              <el-divider>列表字段</el-divider>
              <draggable :list="activeData.columnOptions" :animation="340" group="selectItem"
                handle=".option-drag">
                <div v-for="(item, index) in activeData.columnOptions" :key="index"
                  class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="icon-ym icon-ym-darg" />
                  </div>
                  <el-input v-model="item.label" placeholder="列名" size="small" />
                  <el-input v-model="item.value" placeholder="字段" size="small" />
                  <div class="close-btn select-line-icon"
                    @click="activeData.columnOptions.splice(index, 1)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 29px;">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                  @click="addColumnOptionsItem">
                  添加字段
                </el-button>
              </div>
              <el-divider>分页设置</el-divider>
              <el-form-item label="列表分页">
                <el-switch v-model="activeData.hasPage"></el-switch>
              </el-form-item>
              <el-form-item label="分页条数" label-width="80px">
                <el-radio-group v-model="activeData.pageSize">
                  <el-radio-button :label="20">20条</el-radio-button>
                  <el-radio-button :label="50">50条</el-radio-button>
                  <el-radio-button :label="100">100条</el-radio-button>
                  <el-radio-button :label="500">500条</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-divider />
            </template>
            <template v-if="activeData.__config__.workflowKey==='relationFormAttr'">
              <el-form-item label="关联功能">
                <el-select v-model="activeData.relationField" placeholder="请选择关联功能" clearable
                  @change="onRelationFieldChange">
                  <el-option v-for="(item,i) in relationFormOptions" :key="i"
                    :label="item.__config__.label" :value="item.prop" />
                </el-select>
              </el-form-item>
              <el-form-item label="关联字段">
                <el-select v-model="activeData.showField" placeholder="请选择关联字段"
                  @visible-change="visibleRelationChange" clearable>
                  <el-option v-for="item in relationFieldOptions" :key="item.vmodel"
                    :label="item.label" :value="item.vmodel" />
                </el-select>
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey==='popupAttr'">
              <el-form-item label="关联弹窗">
                <el-select v-model="activeData.relationField" placeholder="请选择关联弹窗" clearable>
                  <el-option v-for="(item,i) in popupOptions" :key="i"
                    :label="item.__config__.label" :value="item.prop" />
                </el-select>
              </el-form-item>
              <el-form-item label="关联字段">
                <el-input v-model="activeData.showField" placeholder="请输入关联字段" />
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey==='barcode'">
              <el-form-item label="编码格式">
                <el-select v-model="activeData.format" placeholder="请选择">
                  <el-option :label="item.label" :value="item.value"
                    v-for="(item,i) in barcodeFormatOptions" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="条码颜色">
                <el-color-picker v-model="activeData.lineColor"></el-color-picker>
              </el-form-item>
              <el-form-item label="宽度">
                <el-input-number v-model="activeData.width" placeholder="宽度" :min="0" :precision="0"
                  controls-position="right" />
              </el-form-item>
              <el-form-item label="高度">
                <el-input-number v-model="activeData.height" placeholder="高度" :min="0"
                  :precision="0" controls-position="right" />
              </el-form-item>
              <el-form-item label="默认值">
                <el-select v-model="activeData.dataType" placeholder="请选择">
                  <el-option label="固定值" value="static"></el-option>
                  <el-option label="组件联动" value="relation"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="固定值" v-if="activeData.dataType==='static'">
                <el-input v-model="activeData.staticText" placeholder="请输入固定值"
                  @change="onBarcodeTextChange" />
              </el-form-item>
              <el-form-item label="选择组件" v-if="activeData.dataType==='relation'">
                <el-select v-model="activeData.relationField" placeholder="请选择" clearable
                  filterable>
                  <el-option :label="item.__config__.label" :value="item.__vModel__"
                    v-for="(item,i) in drawingOptions" :key="i"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey==='qrcode'">
              <el-form-item label="实点颜色">
                <el-color-picker v-model="activeData.colorDark"></el-color-picker>
              </el-form-item>
              <el-form-item label="尺寸">
                <el-input-number v-model="activeData.size" placeholder="尺寸" :min="0" :precision="0"
                  controls-position="right" />
              </el-form-item>
              <el-form-item label="默认值">
                <el-select v-model="activeData.dataType" placeholder="请选择">
                  <el-option label="固定值" value="static"></el-option>
                  <el-option label="组件联动" value="relation"></el-option>
                  <el-option label="当前表单路径" value="form"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="固定值" v-if="activeData.dataType==='static'">
                <el-input v-model="activeData.staticText" placeholder="请输入固定值" />
              </el-form-item>
              <el-form-item label="选择组件" v-if="activeData.dataType==='relation'">
                <el-select v-model="activeData.relationField" placeholder="请选择" clearable
                  filterable>
                  <el-option :label="item.__config__.label" :value="item.__vModel__"
                    v-for="(item,i) in drawingOptions" :key="i"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey==='button'">
              <el-form-item label="控件文本">
                <el-input v-model="activeData.buttonText" placeholder="请输入控件文本" />
              </el-form-item>
              <el-form-item label="位置">
                <el-radio-group v-model="activeData.align">
                  <el-radio-button label="left">居左</el-radio-button>
                  <el-radio-button label="center">居中</el-radio-button>
                  <el-radio-button label="right">居右</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="样式">
                <el-select v-model="activeData.type" placeholder="请选择">
                  <el-option label="默认按钮" value=""></el-option>
                  <el-option label="主要按钮" value="primary"></el-option>
                  <el-option label="成功按钮" value="success"></el-option>
                  <el-option label="信息按钮" value="info"></el-option>
                  <el-option label="警告按钮" value="warning"></el-option>
                  <el-option label="危险按钮" value="danger"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="显示内容" v-if="activeData.__config__.workflowKey==='currOrganize'">
              <el-select v-model="activeData.showLevel" placeholder="请选择显示内容">
                <el-option label="显示组织" value="all"></el-option>
                <el-option label="显示部门" value="last"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否密码" v-if="activeData['show-password'] !== undefined">
              <el-switch v-model="activeData['show-password']" />
            </el-form-item>
            <el-form-item v-if="activeData.__config__.rule !== undefined" label="选择模板">
              <BillRule v-model="activeData.__config__.rule" placeholder="选择模板" />
            </el-form-item>
            <el-form-item v-if="activeData.allowHalf !== undefined" label="允许半星">
              <el-switch v-model="activeData.allowHalf" />
            </el-form-item>
            <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
              <el-switch v-model="activeData.readonly" />
            </el-form-item>
            <el-form-item label="能否多选" v-if="activeData.multiple !== undefined">
              <el-switch v-model="activeData.multiple" />
            </el-form-item>
            <el-form-item
              v-if="activeData.disabled !== undefined && activeData.__config__.workflowKey!=='button'"
              label="是否禁用">
              <el-switch v-model="activeData.disabled" />
            </el-form-item>
            <el-form-item v-if="activeData.__config__.noShow !== undefined" label="是否隐藏">
              <el-switch v-model="activeData.__config__.noShow" />
            </el-form-item>
            <template v-if="activeData.__config__.workflowKey === 'comInput'">
              <el-divider>校验</el-divider>
              <el-form-item label="是否必填">
                <el-switch v-model="activeData.__config__.required" />
              </el-form-item>
              <div v-for="(item, index) in activeData.__config__.regList" :key="index"
                class="reg-item">
                <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                  <i class="el-icon-close" />
                </span>
                <el-form-item label="表达式">
                  <el-input v-model="item.pattern" placeholder="请输入正则" />
                </el-form-item>
                <el-form-item label="错误提示" style="margin-bottom:0">
                  <el-input v-model="item.message" placeholder="请输入错误提示" />
                </el-form-item>
              </div>
              <div class="mt-10">
                <el-dropdown>
                  <el-button type="primary">添加常用校验<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addRuleHandle(item)"
                      v-for="(item,i) in ruleList" :key="i">
                      {{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" @click="addReg" style="margin-left:10px">
                  自定义规则
                </el-button>
              </div>
            </template>
            <template v-else>
              <template v-if="activeData.__config__.required !== undefined">
                <el-form-item label="是否必填">
                  <el-switch v-model="activeData.__config__.required" />
                </el-form-item>
              </template>
            </template>
            <template v-if="activeData.__config__.workflowKey==='card'">
              <el-form-item label="卡片标题">
                <el-input v-model="activeData.header" placeholder="请输入卡片标题" />
              </el-form-item>
            </template>
            <template v-if="activeData.__config__.workflowKey==='tab'">
              <el-divider>标签页配置</el-divider>
              <draggable :list="activeData.__config__.children" :animation="340" group="selectItem"
                handle=".option-drag">
                <div v-for="(item, index) in activeData.__config__.children" :key="index"
                  class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="icon-ym icon-ym-darg" />
                  </div>
                  <el-input v-model="item.title" placeholder="标签名称" size="small" />
                  <div class="close-btn select-line-icon" @click="delTabItem(index,item)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 29px;">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                  @click="addTabItem">
                  添加标签页
                </el-button>
              </div>
            </template>
            <template v-if="activeData.__config__.workflowKey==='collapse'">
              <el-form-item label="是否手风琴">
                <el-switch v-model="activeData.accordion" />
              </el-form-item>
              <el-divider>面板配置</el-divider>
              <draggable :list="activeData.__config__.children" :animation="340" group="selectItem"
                handle=".option-drag">
                <div v-for="(item, index) in activeData.__config__.children" :key="index"
                  class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="icon-ym icon-ym-darg" />
                  </div>
                  <el-input v-model="item.title" placeholder="标签名称" size="small" />
                  <div class="close-btn select-line-icon" @click="delCollapseItem(index,item)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 29px;">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                  @click="addCollapseItem">
                  添加面板
                </el-button>
              </div>
            </template>
            <template v-if="activeData.on && modelType==2">
              <el-divider>组件事件</el-divider>
              <div v-for="(value,key) in activeData.on" :key="key">
                <el-form-item :label="key">
                  <el-button style="width: 100%;" @click="editFunc(value,key)">
                    {{getTipText(key)}}
                  </el-button>
                </el-form-item>
              </div>
            </template>
          </template>
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="100px"
          labelPosition="left">
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
              <el-radio-button label="top">顶部对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标题宽度">
            <el-input v-model.number="formConf.labelWidth" type="number" placeholder="标题宽度" />
          </el-form-item>
          <template v-if="webType!=3">
            <el-divider>表单按钮</el-divider>
            <div class="per-cell">
              <el-checkbox v-model="formConf.hasConfirmBtn" disabled>确定</el-checkbox>
              <el-input v-model="formConf.confirmButtonText" />
            </div>
            <div class="per-cell">
              <el-checkbox v-model="formConf.hasCancelBtn" disabled>取消</el-checkbox>
              <el-input v-model="formConf.cancelButtonText" />
            </div>
          </template>
          <template v-if="formConf.funcs && modelType==2">
            <el-divider>表单事件</el-divider>
            <el-form-item label="onLoad">
              <el-button style="width: 100%;"
                @click="editFunc(formConf.funcs.onLoad,'onLoad',true)">表单加载触发
              </el-button>
            </el-form-item>
            <el-form-item label="beforeSubmit">
              <el-button style="width: 100%;"
                @click="editFunc(formConf.funcs.beforeSubmit,'beforeSubmit',true)">提交前置触发
              </el-button>
            </el-form-item>
            <el-form-item label="afterSubmit">
              <el-button style="width: 100%;"
                @click="editFunc(formConf.funcs.afterSubmit,'afterSubmit',true)">提交后置触发</el-button>
            </el-form-item>
          </template>
        </el-form>
      </el-scrollbar>
    </div>
    <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    <form-script :visible.sync="formScriptVisible" :tpl="activeScript" :fields="drawingList"
      @updateScript="updateScript" />
  </div>
</template>

<script>
import { noVModelList } from '@/components/Generator/generator/comConfig'
import { isNumberStr } from "@/components/Generator/utils"
import draggable from "vuedraggable"
import { getFeatureSelector, getFormDataFields } from '@/api/onlineDev/visualDev'
import { getDictionaryTypeSelector, getDictionaryDataSelector } from "@/api/systemData/dictionary"
import { getDataInterfaceSelector, getDataInterfaceRes } from "@/api/systemData/dataInterface"
import { saveFormConf, getDrawingList } from "@/components/Generator/utils/db"
import TreeNodeDialog from "./RightComponents/TreeSelect/TreeNodeDialog"
import FormScript from './FormScript'

export default {
  components: { FormScript, draggable, TreeNodeDialog },
  props: ["showField", "activeData", "formConf", "modelType", 'webType', 'drawingList'],
  data() {
    return {
      currentTab: "field",
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      formScriptVisible: false,
      currentIconModel: null,
      activeScript: '',
      activeFunc: '',
      noVModelList,
      treeData: [],
      featureData: [],
      dataInterfaceSelector: [],
      fieldOptions: [],
      justifyOptions: [
        {
          label: "start",
          value: "start"
        },
        {
          label: "end",
          value: "end"
        },
        {
          label: "center",
          value: "center"
        },
        {
          label: "space-around",
          value: "space-around"
        },
        {
          label: "space-between",
          value: "space-between"
        }
      ],
      barcodeFormatOptions: [
        {
          label: 'code128',
          value: 'code128'
        },
        {
          label: 'ean13',
          value: 'ean13'
        },
        {
          label: 'ean8',
          value: 'ean8'
        },
        {
          label: 'ean5',
          value: 'ean5'
        },
        {
          label: 'ean2',
          value: 'ean2'
        },
        {
          label: 'code39',
          value: 'code39'
        },
        {
          label: 'itf14',
          value: 'itf14'
        },
        {
          label: 'msi10',
          value: 'msi10'
        },
        {
          label: 'msi11',
          value: 'msi11'
        },
        {
          label: 'pharmacode',
          value: 'pharmacode'
        },
        {
          label: 'upc',
          value: 'upc'
        },
        {
          label: 'codabar',
          value: 'codabar'
        }
      ],
      ruleList: [
        {
          pattern: '/^\\d+$/',
          message: '请输入正确的数字',
          label: '数字'
        },
        {
          pattern: '/^[1-9]\\d*\\.\\d*|0\\.\\d*[1-9]\\d*|0?\\.0+|0$/',
          message: '请输入正确的金额',
          label: '金额'
        },
        {
          pattern: '/^0\\d{2,3}-?\\d{7,8}$/',
          message: '请输入正确的电话号码',
          label: '电话'
        },
        {
          pattern: '/^1[3456789]\\d{9}$/',
          message: '请输入正确的手机号码',
          label: '手机'
        },
        {
          pattern: '/^1[3456789]\\d{9}$|^0\\d{2,3}-?\\d{7,8}$/',
          message: '请输入正确的联系方式',
          label: '电话/手机'
        },
        {
          pattern: '/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/',
          message: '请输入正确的邮箱',
          label: '邮箱'
        },
        {
          pattern: '/^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/',
          message: '请输入正确的身份证号码',
          label: '身份证'
        },
      ],
      props: {
        value: "id",
        label: "fullName",
        children: "children"
      },
      relationFormOptions: [],
      relationFormFieldOptions: [],
      relationFieldOptions: [],
      popupOptions: [],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__
          return data.componentName || `${config.label}: ${data.__vModel__}`
        }
      }
    }
  },
  computed: {
    activeTag() {
      return this.activeData.__config__.tag
    },
    formItemList() {
      return this.$store.state.generator.formItemList
    },
    subTable() {
      return this.$store.state.generator.subTable || []
    },
    allTable() {
      return this.$store.state.generator.allTable || []
    },
    mainTable() {
      let allTable = this.$store.state.generator.allTable
      let item = allTable.filter(o => o.typeId == '1')[0]
      if (!item || !item.table) return ''
      return item.table
    },
    drawingOptions() {
      let list = []
      const loop = (data, parent) => {
        if (!data) return
        if (data.__config__ && data.__config__.workflowKey !== 'table' && data.__config__.children && Array.isArray(data.__config__.children)) {
          loop(data.__config__.children, data)
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent))
        if (data.__vModel__ && data.__config__.workflowKey !== 'table') {
          list.push(data)
        }
      }
      loop(this.drawingList)
      return list
    }
  },
  watch: {
    formConf: {
      handler(val) {
        // saveFormConf(val)
      },
      deep: true
    },
    activeData(val) {
      if (!val.__config__.tableName && val.__config__.workflowKey !== 'table') {
        val.__config__.tableName = this.mainTable
      }
      if (val.__config__.workflowKey == 'relationForm') {
        this.getRelationFormFieldOptions()
      }
      if (val.__config__.workflowKey === 'relationFormAttr') this.getRelationFormOptions()
      if (val.__config__.workflowKey === 'popupAttr') this.getPopupOptions()
      this.setDefaultOptions()
    }
  },
  created() {
    this.getDictionaryType()
    this.getDataInterfaceSelector()
    this.getFeatureSelector()
    this.getRelationFormFieldOptions()
    if (!this.activeData || !this.activeData.__config__) return
    if (!this.activeData.__config__.tableName && this.activeData.__config__.workflowKey !== 'table') {
      this.activeData.__config__.tableName = this.mainTable
    }
    this.setDefaultOptions()
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: "",
        message: ""
      })
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(",")
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === "boolean") {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (Array.isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          "defaultValue",
          str.split(",").map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, "defaultValue", JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          "defaultValue",
          isNumberStr(str) ? +str : str
        )
      }
    },
    getSubTableFiled(key) {
      let item = {}
      let list = this.subTable.filter(o => o.table === key)
      if (list.length) {
        item = list[0]
      }
      let arr = []
      if (item && item.fields) arr = item.fields.filter(o => o.primaryKey != 1)
      return arr
    },
    fieldChange1(val) {
      if (!val) return
      const drawingList = getDrawingList() || []
      let boo = false
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const e = list[i]
          const config = e.__config__
          if (config.workflowKey === 'table' && config.tableName === this.activeData.__config__.relationTable) {
            for (let j = 0; j < config.children.length; j++) {
              const child = config.children[j]
              if (child.__vModel__ === val) {
                boo = true
                break
              }
            }
          }
          if (config && config.workflowKey != 'table' && config.children && Array.isArray(config.children)) {
            loop(config.children)
          }
        }
      }
      loop(drawingList)
      if (boo) {
        this.$message.warning(`子表字段【${val}】已存在,请重新选择!`)
        this.activeData.__vModel__ = ''
        return
      }
      let options = this.getSubTableFiled(this.activeData.__config__.relationTable)
      let item = options.filter(o => o.field == val)[0]
      if (!item || !item.fieldName) return
      this.activeData.__config__.label = item.fieldName
    },
    fieldChange(val) {
      if (!val) return
      const drawingList = getDrawingList() || []
      let boo = false
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const e = list[i]
          const config = e.__config__
          if (e.__vModel__ === val) {
            boo = true
            break
          }
          if (config && config.workflowKey != 'table' && config.children && Array.isArray(config.children)) {
            loop(config.children)
          }
        }
      }
      loop(drawingList)
      if (boo) {
        this.$message.warning(`字段【${val}】已存在,请重新选!`)
        this.activeData.__vModel__ = ''
        return
      }
      let item = this.fieldOptions.filter(o => o.realField == val)[0]
      if (!item || !item.fieldName) return
      this.activeData.__config__.label = item.fieldName
    },
    tableChange() {
      this.activeData.__vModel__ = ''
      this.setDefaultOptions()
    },
    setDefaultOptions() {
      if (!this.$store.getters.hasTable) return
      if (this.activeData.__vModel__ === undefined || this.activeData.__config__.workflowKey === 'table') return
      if (!this.activeData.__config__.tableName || this.activeData.__config__.tableName === this.mainTable) {
        let fieldOptions = this.formItemList.map(o => ({ ...o, realField: o.field }))
        this.fieldOptions = fieldOptions.filter(o => o.primaryKey != 1)
      } else {
        let list = this.allTable.filter(o => o.table === this.activeData.__config__.tableName)
        if (!list.length) {
          this.activeData.__config__.tableName = this.mainTable
          let fieldOptions = this.formItemList.map(o => ({ ...o, realField: o.field }))
          this.fieldOptions = fieldOptions.filter(o => o.primaryKey != 1)
          this.activeData.__vModel__ = ''
        } else {
          let item = list[0]
          let options = item.fields.map(o => ({
            ...o,
            realField: 'workflow_' + this.activeData.__config__.tableName + '_workflow_' + o.field,
          }))
          this.fieldOptions = options.filter(o => o.primaryKey != 1)
        }
      }
    },
    spanChange(val) {
      this.formConf.span = val
    },
    onTableNameChange(tableName) {
      if (!tableName) return
      const drawingList = getDrawingList() || []
      let boo = false
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const e = list[i]
          const config = e.__config__
          if (config.workflowKey === 'table' && config.tableName === tableName) {
            boo = true
            break
          }
          if (config && config.workflowKey != 'table' && config.children && Array.isArray(config.children)) {
            loop(config.children)
          }
        }
      }
      loop(drawingList)
      if (boo) {
        this.$message.warning(`子表【${tableName}】已存在,请重新选择!`)
        this.activeData.__config__.tableName = ''
        return
      }
      for (let i = 0; i < this.activeData.__config__.children.length; i++) {
        this.$set(this.activeData.__config__.children[i].__config__, 'relationTable', tableName)
        this.$set(this.activeData.__config__.children[i], '__vModel__', '')
      }
    },
    getDictionaryType() {
      getDictionaryTypeSelector().then(res => {
        this.treeData = res.data.list
      })
    },
    getDataInterfaceSelector() {
      getDataInterfaceSelector().then(res => {
        this.dataInterfaceSelector = res.data
      })
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({ fullName: "", id: "" })
    },
    dataTypeChange(val) {
      if (val === "static") {
        this.activeData.__config__.dictionaryType = ""
        this.activeData.__config__.propsUrl = ""
      }
      if (val === "dynamic") {
        this.activeData.__config__.dictionaryType = ""
      }
      if (val === "dictionary") {
        this.activeData.__config__.propsUrl = ""
      }
      if (this.activeData.__config__.workflowKey === 'treeSelect' || this.activeData.__config__.workflowKey === 'cascader') {
        this.activeData.props.props.value = 'id'
        this.activeData.props.props.label = 'fullName'
        this.activeData.props.props.children = 'children'
      } else {
        this.activeData.__config__.props.value = 'id'
        this.activeData.__config__.props.label = 'fullName'
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span class="text">{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)}
              class="el-icon-plus"
              title="添加" />
            <i on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="删除" />
          </span>
        </div>
      )
    },
    addRuleHandle(row) {
      this.activeData.__config__.regList.push({
        pattern: row.pattern,
        message: row.message
      })
    },
    addTreeItem() {
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    append(data) {
      if (!data.children) {
        this.$set(data, "children", [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = [] // 避免删除时报错
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    getFeatureSelector() {
      getFeatureSelector({ type: 1 }).then(res => {
        this.featureData = res.data.list
      })
    },
    getRelationFormFieldOptions() {
      if (!this.activeData.modelId) return
      getFormDataFields(this.activeData.modelId).then(res => {
        this.relationFormFieldOptions = res.data.list
      })
    },
    getRelationFormOptions() {
      const drawingList = getDrawingList() || []
      let list = []
      const loop = (data, parent) => {
        if (!data) return
        if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
          loop(data.__config__.children, data)
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent))
        if (data.__config__ && data.__config__.workflowKey) {
          if (data.__config__.workflowKey === 'relationForm' && data.__vModel__) {
            list.push(data)
          }
        }
      }
      loop(drawingList)
      this.relationFormOptions = list.map(o => ({
        ...o,
        prop: o.__config__ && o.__config__.tableName ? o.__vModel__ + '_workflowTable_' + o.__config__.tableName + (o.__config__.isSubTable ? '0' : "1") : o.__vModel__
      }))
      this.getRelationFieldOptions()
    },
    getRelationFieldOptions() {
      if (!this.activeData.relationField || !this.relationFormOptions.length) return
      let list = this.relationFormOptions.filter(o => o.prop === this.activeData.relationField)
      if (!list.length) return
      let item = list[0]
      if (!item.modelId) return
      getFormDataFields(item.modelId).then(res => {
        this.relationFieldOptions = res.data.list
      })
    },
    onRelationFieldChange(val) {
      this.activeData.showField = ''
      if (!val) {
        this.fieldOptions = []
        return
      }
      this.getRelationFieldOptions()
    },
    visibleRelationChange(val) {
      if (!val) return
      if (!this.activeData.relationField) this.$message.warning('请先选择关联功能')
    },
    getPopupOptions() {
      const drawingList = getDrawingList() || []
      let list = []
      const loop = (data, parent) => {
        if (!data) return
        if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
          loop(data.__config__.children, data)
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent))
        if (data.__config__ && data.__config__.workflowKey) {
          if (data.__config__.workflowKey === 'popupSelect' && data.__vModel__) {
            list.push(data)
          }
        }
      }
      loop(drawingList)
      this.popupOptions = list.map(o => ({
        ...o,
        prop: o.__config__ && o.__config__.tableName ? o.__vModel__ + '_workflowTable_' + o.__config__.tableName + (o.__config__.isSubTable ? '0' : "1") : o.__vModel__
      }))
    },
    visibleChange(val) {
      if (!val) return
      if (!this.activeData.modelId) this.$message.warning('请先选择关联功能')
    },
    onModelIdChange(val) {
      this.activeData.relationField = ''
      if (!val) {
        this.fieldOptions = []
        return
      }
      this.getRelationFormFieldOptions()
    },
    addColumnOptionsItem() {
      this.activeData.columnOptions.push({
        value: '',
        label: ''
      })
    },
    onColumnFieldChange(val, item) {
      const list = this.fieldOptions.filter(o => o.vmodel === val) || []
      if (!list.length) return
      const active = list[0]
      item.label = active.label
    },
    getTipText(key) {
      let text = ''
      switch (key) {
        case 'change':
          text = '发生变化时触发'
          break;
        case 'blur':
          text = '失去焦点时触发'
          break;
        case 'click':
          text = '点击时触发'
          break;
        case 'tab-click':
          text = '面板点击时触发'
          break;
        default:
          text = ''
          break;
      }
      return text
    },
    updateScript(data) {
      if (this.isConf) {
        this.formConf.funcs[this.activeFunc] = data
      } else {
        this.activeData.on[this.activeFunc] = data
      }
    },
    editFunc(str, funcName, isConf) {
      this.activeScript = str
      this.activeFunc = funcName
      this.isConf = isConf || false
      this.formScriptVisible = true
    },
    addTabItem() {
      this.activeData.__config__.children.push({
        title: 'New Tab',
        __config__: {
          children: []
        }
      })
    },
    delTabItem(index, item) {
      let list = this.activeData.__config__.children
      let length = list.length
      if (length < 2) {
        this.$message({
          message: '最后一项不能删除',
          type: 'warning'
        });
        return
      }
      this.$confirm('删除后不能撤销，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.activeData.__config__.active === item.name) {
          let nextTab = list[index + 1] || list[index - 1];
          if (nextTab) this.activeData.__config__.active = nextTab.name;
        }
        this.activeData.__config__.children.splice(index, 1)
      }).catch(() => { });
    },
    addCollapseItem() {
      this.activeData.__config__.children.push({
        title: '新面板',
        name: this.workflow.idGenerator(),
        __config__: {
          children: []
        }
      })
    },
    delCollapseItem(index, item) {
      let list = this.activeData.__config__.children
      let length = list.length
      if (length < 2) {
        this.$message({
          message: '最后一项不能删除',
          type: 'warning'
        });
        return
      }
      this.$confirm('删除后不能撤销，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.activeData.__config__.children.splice(index, 1)
      }).catch(() => { });
    },
    onBarcodeTextChange(val) {
      if (!val) return
      let reg = /^[A-Za-z0-9]+$/
      if (!reg.test(val)) {
        this.$message({
          message: '固定值请输入数字或者英文字母',
          type: 'error',
          duration: 1500,
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 340px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  .field-box {
    position: relative;
    height: calc(100% - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
::v-deep .select-item,
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .el-input + .el-input {
    margin-left: 4px;
  }
  & + .select-item {
    margin-top: 4px;
  }
  &.sortable-chosen {
    border: 1px dashed #409eff;
  }
  .select-line-icon {
    line-height: 32px;
    font-size: 22px;
    padding: 0 4px;
    color: #606266;
    .icon-ym-darg {
      font-size: 20px;
      line-height: 31px;
      display: inline-block;
    }
  }
  .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  .option-drag {
    cursor: move;
  }
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}
.right-scrollbar {
  .el-form {
    ::v-deep .el-date-editor,
    ::v-deep .el-cascader,
    ::v-deep .el-select {
      width: 100%;
    }
  }
}
.custom-tree-node {
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  .node-operation {
    float: right;
  }
  i[class*='el-icon'] + i[class*='el-icon'] {
    margin-left: 6px;
  }
  .el-icon-plus {
    color: #409eff;
  }
  .el-icon-delete {
    color: #157a0c;
  }
}
.per-cell {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  .el-checkbox {
    width: 146px;
  }
  &.last {
    margin-bottom: 0;
  }
}
</style>
