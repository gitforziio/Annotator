
const TaskDefinition = {
    root_node: 'document',
    item_tags: ['sentence'],
    tag_attributes: {
        'sentence': ['annotated'],
        'cxn': ['emotion', 'custom-emotion', 'standpoint', 'evaluation', 'intensity', 'type'],
    },
    attribute: [
        ['annotated', {'title':'类型', 'method': 'bool'}],
        ['type', {'title':'类型', 'method': 'options', 'options': ["主观情感类构式"]}],
        ['evaluation', {'title':'评价', 'method': 'options', 'options': ["负面","正面","中立"]}],
        ['standpoint', {'title':'立场', 'method': 'options', 'options': ["拒绝","接受","不置可否"]}],
        ['intensity', {'title':'强度', 'method': 'options', 'options': ["极","很","不很"]}],
        ['emotion', {'title':'情感', 'method': 'options', 'options': ["喜欢","愤怒","恐惧","悲伤","厌恶","爱慕","自定义"]}],
        ['custom-emotion', {'title':'自定义情感', 'method': 'text'}],
    ],
};

var ComponentBangView = {
    name: 'bangview',
    props: ['tree_obj', 'bang_obj'],
    template: `
    <div class="bang-flex"><div v-for="frag in tree_obj['%FRAGMENTS']" class="frag" :class="[frag.isChar?'char':(frag['@nodeName']?'box box-'+frag['@nodeName']:'box')]">
        <span v-if="frag.isChar">{{frag.value}}</span>
        <div v-if="!frag.isChar" class="name">{{frag['@nodeName']}}</div>
        <bangview v-if="!frag.isChar" :tree_obj="frag" :bang_obj="bang_obj"></bangview>
    </div></div>`,
};

var ComponentBangInner = {
    name: 'banginner',
    props: ['tree_obj', 'bang_obj', 'select_state'],
    methods: {
        onClickChar: function(thing, bang) {
            // console.log(thing);
            let self = this;
            let state = self.select_state;
            if (state == 0) {
                let msg = `左侧选择 idx-${thing.idx} ${thing.value} level-${thing.level}`;
                console.log(msg);
                this.$emit('childClickChar', thing, bang);
                //
            } else if (state == 1) {
                let msg = `右侧选择 idx-${thing.idx} ${thing.value} level-${thing.level}`;
                console.log(msg);
                this.$emit('childClickChar', thing, bang);
                //
            }
        },
        onClickBox: function(thing) {
            let msg = `点击了box range-${thing.range} level-${thing.level}`;
            console.log(msg);
        },
    },
    template: `
    <div class="bang-flex"><div v-for="frag in tree_obj['%FRAGMENTS']" class="frag" :class="[frag.isChar?'char':(frag['@nodeName']?'box box-'+frag['@nodeName']:'box')]" v-on:click.stop="onClickBox(frag)">
        <span v-if="frag.isChar" v-on:click.stop="onClickChar(frag, bang_obj)">{{frag.value}}</span>
        <div v-if="!frag.isChar" class="name">{{frag['@nodeName']}}</div>
        <banginner v-if="!frag.isChar" :tree_obj="frag" :bang_obj="bang_obj" :select_state="select_state" @childClickChar="onClickChar"></banginner>
    </div></div>`,
};

var ComponentBang = {
    name: 'bang',
    data: function() {
        return {
            select_state: 0,// 0=未选，1=选了一个，2=选了两个
            selected_left: false,
            selected_right: false,
            selected_left_idx: 0,
            selected_right_idx: 0,
            selected_left_level: 0,
            selected_right_level: 0,
        };
    },
    computed: {
        show_cancel: function() {return this.selected_left||this.selected_right},
    },
    props: ['tree_obj', 'bang_obj'],
    methods: {
        onClick: function(thing) {
        },
        onClickFrag: function(thing) {
            console.log(thing);
        },
        onClickChar: function(thing, bang) {
            // console.log(thing);
            let self = this;
            let state = self.select_state;
            // 0=还未选
            //   - 直接点击就开始选择
            if (state == 0) {
                console.log(`首次点击 idx-${thing.idx} ${thing.value} level-${thing.level}`);
                //
                self.selected_left = true;
                self.selected_left_idx = thing.idx;
                self.selected_left_level = thing.level;
                //
                state = 1;
                self.select_state = state;
            // 1=已经选了一个
            //   - 取消选择
            //   - 点击选择另一个
            //     - 选择了的范围内改变样式从而可视化
            //     - 如果另一个不行，则警告一下
            //   - 如果选的是frag，那么可以对这个frag进行设置
            } else if (state == 1) {
                console.log(`再次点击 idx-${thing.idx} ${thing.value} level-${thing.level}`);
                let left_idx = self.selected_left_idx;
                let right_idx = thing.idx;
                if (right_idx < left_idx) {
                    left_idx = thing.idx;
                    right_idx = self.selected_left_idx;
                }
                // 检查现在点击的字符是否允许操作。
                let access = true;
                if (thing.level != self.selected_left_level) {
                    this.$emit("childmsg", "danger", "两端不一致！");
                    console.log("两端层级不一致！");
                    access = false;
                }
                for (let idx = left_idx; idx<=right_idx; idx++) {
                    if (bang.crisps[idx].level < self.selected_left_level) {
                        this.$emit("childmsg", "danger", "范围内存在更低层级的内容！");
                        console.log("范围内存在更低层级的内容！");
                        access = false;
                    }
                }
                //
                if (access) {
                    self.selected_right = true;
                    self.selected_right_idx = thing.idx;
                    self.selected_right_level = thing.level;
                    //
                    state = 2;
                    self.select_state = state;
                }
                //
            }
        },
        onClickBox: function(thing) {
            console.log(thing);
        },
        clearSelection: function() {
            self = this;
            self.select_state = 0;
            self.selected_left = false;
            self.selected_right = false;
            self.selected_left_idx = 0;
            self.selected_right_idx = 0;
            self.selected_left_level = 0;
            self.selected_right_level = 0;
        },
    },
    components: {
        'banginner': ComponentBangInner,
    },
    template: `
    <div>
    <div class="bang">
    <banginner :tree_obj="tree_obj" :bang_obj="bang_obj" :select_state="select_state" @childClickChar="onClickChar"></banginner>
    </div>
    <div v-if="show_cancel"><button type="button" class="btn btn-sm btn-primary" v-on:click.stop="clearSelection">不再选择</button></div>
    </div>`,
};

// var ComponentBangOld = {
//     name: 'bang',
//     data: function() {
//         return {
//             select_state: 0,// 0=未选，1=选了一个，2=选了两个
//             selected_left: false,
//             selected_right: false,
//             selected_left_idx: 0,
//             selected_right_idx: 0,
//             selected_left_level: 0,
//             selected_right_level: 0,
//         };
//     },
//     computed: {
//         show_cancel: function() {return this.selected_left||this.selected_right},
//     },
//     props: ['tree_obj', 'bang_obj'],
//     methods: {
//         onClick: function(thing) {
//         },
//         onClickFrag: function(thing) {
//             console.log(thing);
//         },
//         onClickChar: function(thing, bang) {
//             // console.log(thing);
//             let self = this;
//             let state = self.select_state;
//             // 0=还未选
//             //   - 直接点击就开始选择
//             if (state == 0) {
//                 console.log(`首次点击 idx-${thing.idx} ${thing.value} level-${thing.level}`);
//                 //
//                 self.selected_left = true;
//                 self.selected_left_idx = thing.idx;
//                 self.selected_left_level = thing.level;
//                 //
//                 state = 1;
//                 self.select_state = state;
//             // 1=已经选了一个
//             //   - 取消选择
//             //   - 点击选择另一个
//             //     - 选择了的范围内改变样式从而可视化
//             //     - 如果另一个不行，则警告一下
//             //   - 如果选的是frag，那么可以对这个frag进行设置
//             } else if (state == 1) {
//                 console.log(`再次点击 idx-${thing.idx} ${thing.value} level-${thing.level}`);
//                 let left_idx = self.selected_left_idx;
//                 let right_idx = thing.idx;
//                 if (right_idx < left_idx) {
//                     left_idx = thing.idx;
//                     right_idx = self.selected_left_idx;
//                 }
//                 // 检查现在点击的字符是否允许操作。
//                 let access = true;
//                 if (thing.level != self.selected_left_level) {
//                     // push_alert("danger", "两端不一致！");
//                     console.log("两端不一致！");
//                     access = false;
//                 }
//                 for (let idx = left_idx; idx<=right_idx; idx++) {
//                     if (bang.crisps[idx].level < self.selected_left_level) {
//                         // push_alert("danger", "范围内存在更低层级的内容！");
//                         console.log("范围内存在更低层级的内容！");
//                         access = false;
//                     }
//                 }
//                 //
//                 if (access) {
//                     self.selected_right = true;
//                     self.selected_right_idx = thing.idx;
//                     self.selected_right_level = thing.level;
//                     //
//                     state = 2;
//                     self.select_state = state;
//                 }
//                 //
//             }
//             // 2=已经选了两个
//             //   - 取消选择
//             //   - 进行包装，即在外层套上一层frag
//         },
//         onClickBox: function(thing) {
//             console.log(thing);
//         },
//         clearSelection: function() {
//             self = this;
//             self.select_state = 0;
//             self.selected_left = false;
//             self.selected_right = false;
//             self.selected_left_idx = 0;
//             self.selected_right_idx = 0;
//             self.selected_left_level = 0;
//             self.selected_right_level = 0;
//         },
//     },
//     template: `
//     <div>
//     <div class="bang-flex"><div v-for="frag in tree_obj['%FRAGMENTS']" class="frag" :class="[frag.isChar?'char':(frag['@nodeName']?'box box-'+frag['@nodeName']:'box')]" v-on:click.stop="onClickBox(frag)">
//         <span v-if="frag.isChar" v-on:click.stop="onClickChar(frag, bang_obj)">{{frag.value}}</span>
//         <div v-if="!frag.isChar" class="name">{{frag['@nodeName']}}</div>
//         <bang v-if="!frag.isChar" :tree_obj="frag" :bang_obj="bang_obj"></bang>
//     </div></div>
//     <div v-if="show_cancel"><button type="button" class="btn btn-sm btn-primary" v-on:click.stop="clearSelection">不再选择</button></div>
//     </div>`,
// };

var the_vue = new Vue({
    task: {},
    task_json: '',
    el: '#bodywrap',
    components: {
        'bang': ComponentBang,
        'banginner': ComponentBangInner,
        'bangview': ComponentBangView,
    },
    data: {
        mode: 'file',
        file_list: [],
        current_file: {},
        //
        current_file_content: "",
        current_xml_obj: {},
        current_xml_items_collection: {},
        current_xml_items: [],
        //
        data: [
            {
                xml: '<sentence annotated="0">拍卖业以假充真，或对赝品<cxn id="3" emotion="自定义" standpoint="不置可否" evaluation="负面" intensity="不很" type="主观情感类构式" custom-emotion=""><constant>爱</constant><variable>理</variable><constant>不</constant><variable>理</variable></cxn>，是为了一个“钱”字。</sentence>',
                text: '拍卖业以假充真，或对赝品爱理不理，是为了一个“钱”字。',
                annotated: '0',
                node: {},
                tree_obj: {},
                bang_obj: {},
            },
        ],
        items: [],
        editor:{
            current_idx: 0,
            current_item: {},
        },
        ui: {
            modal_open: 0,
            nav_collapsed: 1,
            alerts_last_idx: 1,
            alerts: [],
        },
        state: {
            unsaved: 0,
        },
    },
    computed: {
        data_len: function() {return this.data.length},
        data_done_len: function() {return this.data.filter(d => (typeof(d)=='object'?d.annotated=='1':false)).length},
        data_done_pct: function() {return (this.data_len > 0 ? `${(this.data_done_len/this.data_len)*100}%` : `0`)},
    },
    methods: {
        editor_load: function(idx) {
            this.editor.current_idx = idx;
            this.editor.current_item = this.data[idx];
        },
        editor_load_last: function() {
            let idx = this.editor.current_idx;
            idx = (idx > 0) ? (idx - 1) : (this.data.length - 1);
            this.editor.current_idx = idx;
            this.editor.current_item = this.data[idx];
        },
        editor_load_next: function() {
            let idx = this.editor.current_idx;
            idx = (idx < this.data.length - 1) ? (idx + 1) : 0;
            this.editor.current_idx = idx;
            this.editor.current_item = this.data[idx];
        },
        message: function(msg) {
            console.log(msg);
        },
        do_import: function() {
            let files = this.$refs.file_element.files;
            this.file_list.push(...files);
        },
        load_file: function(file) {
            let self = this;
            self.current_file = file;
            var reader = new FileReader();
            reader.readAsText(file, "utf-8");
            reader.onload = function(evt) {
                self.current_file_content = this.result;
                self.load_data();
            };
            self.switch_mode('preview');
        },
        load_data: function() {
            let self = this;
            let ctt = self.current_file_content;
            let domParser = new DOMParser();
            let xmlObject = domParser.parseFromString(ctt, "text/xml");
            self.current_xml_obj = xmlObject;
            self.current_xml_items_collection = self.current_xml_obj.childNodes[0].children;
            self.current_xml_items = [];
            self.data = [];
            for (let item of self.current_xml_items_collection) {
                self.current_xml_items.push(item);
                self.data.push({
                    xml: item.outerHTML,
                    text: item.textContent,
                    annotated: item.attributes.annotated ? item.attributes.annotated.value : '0',
                    node: item,
                    tree_obj: xml_node_2_tree(item),
                    bang_obj: tree_2_crisps_and_frags(xml_node_2_tree(item)),
                });
            };
        },
        tree_analyze: function(sentence) {
            let self = this;
        },
        load_task_settings: function() {
            this.task_json = JSON.stringify(this.task, null, 4);
        },
        apply_task_settings: function() {
            let has_error = 0;
            let tmp_task = {}
            try {
                let tmp_task = JSON.parse(this.task_json);
            } catch (error) {
                has_error = 1;
            } finally {
                if (has_error) {
                    this.push_alert('danger', '存在错误，无法应用。');
                } else {
                    this.task = JSON.parse(this.task_json);
                    this.push_alert('success', '已应用。');
                };
            };
        },
        toggle_modal: function() {
            this.ui.modal_open = 1 - this.ui.modal_open;
        },
        push_alert: function(cls, ctt) {
            let idx = this.ui.alerts_last_idx+1;
            this.ui.alerts.push({
                'idx': idx,
                'class': cls,
                'html': ctt,
                'show': 1,
            });
            this.ui.alerts_last_idx += 1;
            let that = this;
            setTimeout(function(){that.remove_alert(idx);},2000)
        },
        remove_alert: function(idx) {
            this.ui.alerts.filter(alert => alert.idx==idx)[0].show = 0;
        },
        toggle_nav: function() {
            this.ui.nav_collapsed = 1 - this.ui.nav_collapsed;
        },
        switch_mode: function(mode) {
            this.mode = mode;
        },
    },
    created: function() {
        this.task = TaskDefinition;
        console.log("the_vue created");
    },
})
