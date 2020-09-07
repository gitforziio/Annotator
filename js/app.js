
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


var the_vue = new Vue({
    task: {},
    task_json: '',
    el: '#bodywrap',
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
            },
        ],
        items: [],
        editor:{
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
                });
            };
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
