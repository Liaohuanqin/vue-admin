# Introduction

这个项目是基于vue-cli构建的针对于后台业务的通用业务层，UI库采用了element-ui。

本项目的核心页面是 */src/components/list_view* 。

## model

对于这个核心列表页，有相当多的可配置信息，这些可配置项被抽象成为一个model统一管理，这就是 */src/model/* 要存放的内容。

一个model由以下几个部分构成：

* field_list 字段，是一个model最基础的配置项，具体的请先看[关于editor的介绍](https://github.com/jiangshanmeta/vue-admin/tree/master/src/components/common/editor)，然后看下面的具体描述

* listConfig，[列表组件的配置项](https://github.com/jiangshanmeta/vue-admin/tree/master/src/components/common#listinfo)

* operators 针对一条记录的操作集，更新、删除功能应该放在这里

* staticOperators 类似于operators，但staticOperators不针对于一条特定的记录，它对应的data是选中的数据数组。创建功能应该放在这里。

* filters，筛选组件的配置项。具体的请先看[关于editor的介绍](https://github.com/jiangshanmeta/vue-admin/tree/master/src/components/common/editor)，然后看下面的具体描述

* filterOperators 类似于operators，是为了拓展筛选功能设计的(目前没发现什么特别的用途)，除了传入代表筛选参数的data属性，它还传入了filters属性。

声明了一个model后，我们还需要在vue-router配置中指明用了哪个model，因而用到了vue-router的meta属性。


## field_list

field_list是一个字段集合，每一个键是对应的字段名，值是关于这个字段相关的描述。

关于字段的描述可以自行扩展，目前支持以下描述：

* label 这个字段的展示名

* editorComponent 这个字段编辑相关的配置，包括name(组件名),config(对组件的配置项),component(自定义组件，一般是结合动态导入import()方法),default(默认值)。我提供了一些[通用业务组件](https://github.com/jiangshanmeta/vue-admin/tree/master/src/editor)。声明示例如下：

```javascript
editorComponent:{
    name:"field_naive",
    component:import("@/components/test/field_naive"),
    config:{
        placeholder:'请输入用户名',
    },
    createConfig:{

    },
    editConfig:{
        placeholder:"测试editconfig"
    },
    default:'',
},
```

* view 字段展示时的配置项，目前支持两种模式，一种是组件，一种是函数。简单地转换函数就足够了，复杂的展示效果需要使用组件。组件式声明如下：

```javascript
view:{
    // 组件名
    name:"view_enum",
    // 组件路径
    component:import("@/components/common/views/view_enum"),
    // 组件配置项
    config:{
        enums:typHash
    },
},
```

函数式声明如下：

```javascript
view:{
    handler(data,config){
        return config.prefix + data;
    },
    config:{
        prefix:"用户名"
    }
},
```

对于view还有个特殊属性join,是为了获取其他字段一同展示而设计的，示例如下：

```javascript
view:{
    // 联合customername和address字段，但是传递给组件的时候名称分别为name和position
    join:{
        customername:"name",
        address:"position"
    },
    name:"test_view_join",
    component:import("@/components/book/views/test_view_join"),
    config:{
        glue:" 的收货地址是 ",
    },
},
view:{
    // 数组形式声明，不需要改变字段的名称
    join:["customername","address"],
    handler(data,config){
        return `${data.customername} ${config.glue} ${data.address}`;
    },
    config:{
        glue:" 的收货地址是 ",
    },
},
```

* validator 表单验证用的

* tip 展示在表单元素下面的用来提示用户的信息。

* colspan 用于info edit create 组件中的，用来控制组件对应的colspan。声明格式如下：

```javascript
colspan:{
    // 在create组件的colspan配置
    create:3,
    // 在edit组件的colspan配置 
    edit:3,
}
```

* tableColumnConfig 在表格中table column的配置项

* labelComponent 用组件处理复杂的label

```javascript
labelComponent:{
    default:{
        name:"label_redstar",
        component:()=>import("@/components/user/labels/label_redstar").then((rst)=>rst.default),
        exclude:['create']
    },
    info:{
        name:"label_redstar",
        component:()=>import("@/components/user/labels/label_redstar").then((rst)=>rst.default),
    },
    
},
```


## filters

filters是筛选的配置项，它是一个数组，其组成元素示例如下：

```javascript
{
    label:"自定义filter",
    field:"test",
    editorComponent:{
        name:"test_custom_filter",
        config:{
            msg:"测试自定义filter",
        },
        component:import("@/components/user/test_custom_filter"),
        default:"test",
    },
    watch:true,
}
```

* label是展示名
* field是请求时的key
* editorComponent是编辑组件相关配置项，name是编辑组件名称，config是对这个编辑组件的配置项，component是传入自定义组件，用于自定义编辑组件时动态引入，default是编辑组件的默认值
* watch是用来实现当一个编辑组件变化时就触发查询(默认是有个查询按钮，点击才查询)，值为true则开启此功能。


## operators

在model中的operators是一个数组，数组中每一项对应一个操作。操作支持两种声明方式：第一种是声明一个函数，第二种是声明一个组件。

第一种声明示例如下：

```javascript
{
    handler(resolve,data){
        this.$message({
            message:`${data.name}不要总想着搞个大新闻`,
            type:"success",
            duration:2000,
        });
        setTimeout(()=>{
            resolve();
        },1000)
    },
    triggerConfig:{
        text:"搞个大新闻",
        type:"warning",
        size:"small",
    },
},
```

这种声明方式被渲染为一个button，triggerConfig.text是button显示的文字，triggerConfig.type是按钮的类型(el-button的类型) ，handler是点击按钮时的调用的函数，调用resolve方法,operators组件会自动通知父组件状态更新，列表页会自动刷新。注意这里的this指向的是这个operators组件。

第二种声明方式示例如下：

```javascript
{
    name:"delete",
    component:import("@/components/common/operators/delete"),
    config:{
        // delete组件有个名为uri的props属性
        uri:"/user/delete",
    }
}
```

name字段是组件名，对应组件的name属性。component是要传入的组件，一般结合动态导入import()使用。考虑到组件复用问题，还有一个config参数，用来向这些子组件传递配置参数。在这种模式下，仅需声明这三项，其余的operators组件会自动处理。

在这种声明情况下，一个data参数会被自动传入。data对于operators、staticOperators和filterOperators含义是不同的，对于operators，data是这条记录的信息(一个对象)，对于staticOperators，data是列表中的所有数据(一个数组)，对于filterOperators，data是筛选框的数据集合(一个对象)。

对于staticOperators，还有一个参数selectedData，对应被选择的数据(一个数组)。

这种声明方式要想通知列表刷新需要手动触发update事件：

```javascript
this.$emit('update')
```


## TODO

* typescript
* commonChunk
