import {getTypConfig} from "@/server/user.js"
const cache = {

}
export default{
    field_list:{
        name:{
            label:'用户名',
            editorComponent:{
                name:"username",
                path:"components/user/username",
                config:{
                    placeholder:'请输入用户名',
                    msg:"测试传入业务editor",
                    default:'',
                },
            },
            // editor:'username',
            // editorConfig:{
            //     placeholder:'请输入用户名',
            //     msg:"测试传入业务editor",
            //     default:'',
            // },
            // editorComponentPath:"components/user/username",
            showComponent:{
                name:"showusername",
                path:"components/user/showusername",
                config:{
                    msg:"测试列表页组件形式展示"
                }
            },
            validator:[
                {
                    validator:function(rule,value,cb){
                        if(value.length<2){
                            cb([new Error("姓名最少两个字符")])
                        }else{
                            cb()
                        }
                    }
                }
            ],
        },
        password:{
            label:'密码',
            editorComponent:{
                name:"field_pwd",
                config:{
                    placeholder:'请输入密码',
                    default:'',
                }
            },
            // editor:'field_pwd',
            // editorConfig:{
            //     placeholder:'请输入密码',
            //     default:'',
            // },
            validator:[
                {
                    validator(rule,value,cb){
                        if(value.length>15){
                            cb([new Error('密码位数最多为15位')])
                        }else{
                            cb();
                        }
                    }
                }

            ],
        },
        gender:{
            label:'性别',
            editorComponent:{
                name:"field_sex",
                config:{
                    default:0,
                }
            },

            // editor:'field_sex',
            // editorConfig:{
            //     default:0,
            // },
            showComponent:{
                name:"showgender",
                path:"components/user/showgender",
                config:{
                    genderCfg:{
                        0:"男",
                        1:"女"
                    }

                },
            },
            tip:"测试tip功能",
        },
        typ:{
            label:'类型',
            editorComponent:{
                name:"field_enum_select",
                config:{
                    candidate:[
                        {value:0,label:'路人甲'},
                        {value:1,label:'店小二'},
                        {value:2,label:'收银员'},
                        {value:99,label:'店掌柜'},
                        {value:999,label:'管理员'},
                    ],
                    default:0,
                    valuefield:'value',
                    labelfield:'label',
                }
            },
            // editor:'field_enum_select',
            // editorConfig:{
            //     candidate:[
            //         {value:0,label:'路人甲'},
            //         {value:1,label:'店小二'},
            //         {value:2,label:'收银员'},
            //         {value:99,label:'店掌柜'},
            //         {value:999,label:'管理员'},
            //     ],
            //     default:0,
            //     valuefield:'value',
            //     labelfield:'label',
            // },

        },
        privilege:{
            label:'权限',
            editorComponent:{
                name:"field_relates_tag",
                config:{
                    uri:'/user/getPrivilege',
                    labelfield:'name',
                    valuefield:'id',
                    relates:{
                        usertyp:{
                            inValidValue:0,
                            relatefield:'typ'
                        }
                    },
                    default(){
                        return [];
                    },
                }
            },
            // editor:"field_relates_tag",
            // editorConfig:{
            //     uri:'/user/getPrivilege',
            //     labelfield:'name',
            //     valuefield:'id',
            //     relates:{
            //         usertyp:{
            //             inValidValue:0,
            //             relatefield:'typ'
            //         }
            //     },
            //     default(){
            //         return [];
            //     },
            // },
        },
        desc:{
            label:"备注",
            editorComponent:{
                name:"field_text_rich",
                config:{
                    default:"这是富文本编辑器蛤",
                }
            },
            // editor:"field_text_rich",
            // editorConfig:{
            //     default:"这是富文本编辑器蛤",
            // }
            
        }
    },
    createConfig:{
        createLink:'/user/create_link',
        doCreateLink:'/user/docreate',
    },
    filters:[
        {
            label:"姓名",
            field:"username",
            editor:"field_string",
            config:{
                placeholder:"请输入用户姓名",
            },
            default:"",
        },
        {
            label:"类型",
            field:"typ",
            editor:"filter_enum",
            config:{
                candidate:[
                    {value:0,label:'路人甲'},
                    {value:1,label:'店小二'},
                    {value:2,label:'收银员'},
                    {value:99,label:'店掌柜'},
                    {value:999,label:'管理员'},
                ],
                allvalue:-1,
                alllabel:"全部", 
            },
            default:-1,
        },
        {
            label:"权限",
            field:"privilege",
            editor:"filter_async_enum",
            config:{
                uri:"/user/getPrivilege",
                valuefield:"id",
                labelfield:"name",
                placeholder:"请选择权限",
                allvalue:"all",
                alllabel:"不限",
            },
            default:"all",
        },
        {
            label:"自定义filter",
            field:"test",
            editor:"test_custom_filter",
            config:{
                msg:"测试自定义filter",
            },
            componentPath:"components/user/test_custom_filter",
            default:"test"
        }
    ],
    listConfig:{
        baseUrl:"/user/list",
        sortFields:['typ'],
        async treatData(data){
            if(!cache['typCfg']){
                let {data:typCfg} = await getTypConfig();
                cache['typCfg'] = typCfg
            }

            data.forEach((item)=>{
                item['typ'] = cache['typCfg'][item['typ']];
            })
            return data
        },
    },
    operators:[
        {
            component:"info",
            componentPath:"components/common/info.vue",
            config:{
                uri:"/user/info",
                title:"用户详情"
            },
        },
        {
            component:"edit",
            componentPath:"components/common/edit",
            config:{
                editLink:"/user/edit_link",
                doEditLink:"/user/doedit_link",
                autoValidate:false,
            }
        },
        {
            label:"搞个大新闻",
            type:"warning",
            function(data){
                console.log(data.name);
                this.$message({
                    message:"不要总想着搞个大新闻",
                    type:"success",
                    duration:2000,
                })
            },
        },
        {
            component:"run",
            componentPath:"components/user/run.vue",
        },
        {
            component:"delete",
            componentPath:"components/common/delete",
            config:{
                uri:"/user/delete",
            }
        }

    ],
}