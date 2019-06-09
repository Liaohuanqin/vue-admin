# StaticOperators

StaticOperators类似于Operators，但是它的data不是一条记录，而是当前列表的所有记录(Array)。

它还有会被传入selectedData，如果有选择的话，对应选中的记录(Array)。

还有一个formData，是筛选项构成的对象。

如果采用函数模式，可通过```this.$attrs.selectedData```和```this.$attrs.formData```在handler中访问到这两个属性

## 内置StaticOperators

### StaticOperatorCreate

创建model的组件

配置项：

| 属性名 | 是否必需  | 类型      | 属性描述 |  备注 |
| :---:  | :--:  | :--: | :-----:  | :--: |
| fields | 是 | Object | model的字段列表 | 作为staticOperator被自动传入 |
| getCreateFields | 是 | Function | 获取创建需要的字段的请求 | - |
| doCreateRequest | 是 | Function | 创建需要进行的请求 | - |
| triggerConfig | 否 | Object | 触发弹框的按钮的配置项 | 默认为空对象 |
| dialogConfig | 否 | Object | 弹框的配置项 | 默认为空对象 |
| createBtnConfig | 否 | Object | 创建按钮的配置项 | 默认为空对象 |
| cancelBtnConfig | 否 | Object | 取消配置项 | 默认为空对象 |
| transformData | 否  | Function | 用来在doCreateRequest前对表单数据进行一次处理，比如修改某个字段的格式 | 默认方法是原样返回表单数据 |
| autoValidate | 否 | Boolean | 是否一开始输入就表单验证 | 默认为false，第一次点击确定才开始表单验证 |

更多说明:

* 按钮的文案可以通过相应配置项的text属性配置
* getCreateFields(resolve) 获取的创建字段通过调用resolve返回，一般情况下该函数的this指向create组件实例，传给resolve的数据示例：

```javascript
// 总共有三行 第一行有customername字段和totalPrice字段
[
    ["customername","totalprice"],
    ["address"],
    ["store","saler"]
]
```

* transformData(data) data为表单中的数据，需要返回一个对象(处理后的数据)
* doCreateRequest(resolve,data) data是经过transformData处理过的表单数据，resolve是个函数，创建完成后需调用resolve方法刷新列表。一般情况下该函数的this指向create组件实例
