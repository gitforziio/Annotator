
// console.log("bang");

// //// XML_node to Tree

// function xml_node_2_tree(node, current_idx=0, current_level=0) {
//     // node: 当前在处理的节点
//     // current_idx: 当前字符的序号
//     // current_level: 当前字符所在层级
//     let tree = {};
//     tree["@nodeName"] = node.nodeName;
//     tree["@nodeType"] = node.nodeType;

//     tree["%FRAGMENTS"] = []; // 直接子元素的有序列表

//     if (tree["@nodeType"] == 9) { // #document 文档节点
//         tree["@nodeValue"] = node.nodeValue;
//     };

//     if (tree["@nodeType"] == 3) { // #text 文本节点
//         tree["@nodeValue"] = node.nodeValue;
//     };
//     if (tree["@nodeType"] == 8) { // #comment 注释节点
//         tree["@nodeValue"] = node.nodeValue;
//     };

//     let idx_start = current_idx; // 记录范围开端
//     let idx_end = -1;

//     // 如果有属性的话，创建一个属性字段，将所有属性存为一个对象
//     if (node.attributes) { if (node.attributes.length) {
//         tree["@attributes"] = {};
//         for (let i = 0; i < node.attributes.length; i++) {
//             tree["@attributes"][node.attributes[i].nodeName] = node.attributes[i].nodeValue;
//         };
//     }; };
//     // 如果（确实）有子节点
//     if (node.childNodes) { if (node.childNodes.length) {
//         // 如果只有一个子节点，并且类型是文本
//         if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {
//             tree["@textContent"] = node.textContent; // 文本内容
//             // 把每个字符拆开构造成对象存入「直接子元素的有序列表」
//             idx_start = current_idx;
//             for (let char of node.textContent) {
//                 let char_obj = {};
//                 char_obj["value"] = char;
//                 char_obj["idx"] = current_idx;
//                 idx_end = current_idx + 1;
//                 char_obj["level"] = current_level;
//                 current_idx += 1;
//                 char_obj["isChar"] = true;
//                 tree["%FRAGMENTS"].push(char_obj);
//             };
//         } else {
//             // 不只有一个子节点，或者类型不是文本
//             // // todo 只有一个不是文本的子节点？
//             // 创建子节点列表
//             tree["@childNodes"] = [];
//             // 遍历这些子节点（如果没有子节点那么就没有任何处理了）
//             for (let nd of node.childNodes) {
//                 let child_toy = xml_node_2_tree(nd, current_idx, current_level+1); // 对每个子节点递归执行本函数，返回包装好的对象
//                 // current_idx += 1;
//                 current_idx = child_toy["ref_idx"];
//                 tree["@childNodes"].push(child_toy); // 存入「子节点列表」
//                 //
//                 if (nd.nodeType == 3) {
//                     // 如果子节点的类型是文本
//                     // 把文本拆成字符，每个字符都构造一个对象放到「直接子元素的有序列表」
//                     for (let char of nd.nodeValue) {
//                         let char_obj = {};
//                         char_obj["value"] = char;
//                         char_obj["idx"] = current_idx;
//                         idx_end = current_idx + 1;
//                         char_obj["level"] = current_level;
//                         current_idx += 1;
//                         char_obj["isChar"] = true;
//                         tree["%FRAGMENTS"].push(char_obj);
//                     };
//                 } else {
//                     // 如果子节点的类型不是文本
//                     // 把前面递归得到的对象放到「直接子元素的有序列表」
//                     tree["%FRAGMENTS"].push(child_toy);
//                     idx_end = child_toy["range"][1] + 1;
//                 };
//             };
//         };
//     }; };
//     tree["ref_idx"] = current_idx;
//     tree["level"] = current_level;
//     tree["range"] = [idx_start, idx_end];
//     return tree;
// }

//// XML_node to Tree

function xml_node_2_tree(node, current_idx=0, current_level=0) {
    // node: 当前在处理的节点
    // current_idx: 当前字符的序号
    // current_level: 当前字符所在层级
    let tree = {};
    tree["@nodeName"] = node.nodeName;
    // tree["@nodeType"] = node.nodeType;

    tree["%FRAGMENTS"] = []; // 直接子元素的有序列表

    // if (tree["@nodeType"] == 9) { // #document 文档节点
    //     tree["@nodeValue"] = node.nodeValue;
    // };

    if (tree["@nodeType"] == 3) { // #text 文本节点
        tree["@nodeValue"] = node.nodeValue;
    };
    // if (tree["@nodeType"] == 8) { // #comment 注释节点
    //     tree["@nodeValue"] = node.nodeValue;
    // };

    let idx_start = current_idx; // 记录范围开端
    let idx_end = -1;

    // 如果有属性的话，创建一个属性字段，将所有属性存为一个对象
    if (node.attributes) { if (node.attributes.length) {
        tree["@attributes"] = {};
        for (let i = 0; i < node.attributes.length; i++) {
            tree["@attributes"][node.attributes[i].nodeName] = node.attributes[i].nodeValue;
        };
    }; };
    // 如果（确实）有子节点
    if (node.childNodes) { if (node.childNodes.length) {
        // 如果只有一个子节点，并且类型是文本
        if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {
            // tree["@textContent"] = node.textContent; // 文本内容
            // 把每个字符拆开构造成对象存入「直接子元素的有序列表」
            idx_start = current_idx;
            for (let char of node.textContent) {
                let char_obj = {};
                char_obj["value"] = char;
                char_obj["idx"] = current_idx;
                idx_end = current_idx + 1;
                char_obj["level"] = current_level;
                current_idx += 1;
                char_obj["isChar"] = true;
                tree["%FRAGMENTS"].push(char_obj);
            };
        } else {
            // 不只有一个子节点，或者类型不是文本
            // // todo 只有一个不是文本的子节点？
            // 创建子节点列表
            // tree["@childNodes"] = [];
            // 遍历这些子节点（如果没有子节点那么就没有任何处理了）
            for (let nd of node.childNodes) {
                let child_toy = xml_node_2_tree(nd, current_idx, current_level+1); // 对每个子节点递归执行本函数，返回包装好的对象
                // current_idx += 1;
                current_idx = child_toy["ref_idx"];
                // tree["@childNodes"].push(child_toy); // 存入「子节点列表」
                //
                if (nd.nodeType == 3) {
                    // 如果子节点的类型是文本
                    // 把文本拆成字符，每个字符都构造一个对象放到「直接子元素的有序列表」
                    for (let char of nd.nodeValue) {
                        let char_obj = {};
                        char_obj["value"] = char;
                        char_obj["idx"] = current_idx;
                        idx_end = current_idx + 1;
                        char_obj["level"] = current_level;
                        current_idx += 1;
                        char_obj["isChar"] = true;
                        tree["%FRAGMENTS"].push(char_obj);
                    };
                } else {
                    // 如果子节点的类型不是文本
                    // 把前面递归得到的对象放到「直接子元素的有序列表」
                    tree["%FRAGMENTS"].push(child_toy);
                    idx_end = child_toy["range"][1];
                };
            };
        };
    }; };
    tree["ref_idx"] = current_idx;
    tree["level"] = current_level;
    tree["range"] = [idx_start, idx_end];
    return tree;
}



//// Tree to Crisps_And_Frags

function tree_2_crisps_and_frags(tree) {
    // tree: 当前在处理的节点
    let bang = {
        crisps: [],
        frags: [],
        "@nodeName": tree["@nodeName"],
        "@attributes": tree["@attributes"],
        "range": tree["range"],
        "level": tree["level"],
    };
    for (let item of tree["%FRAGMENTS"]) {
        if (item.isChar) {
            bang.crisps.push(item);
        } else if (item["%FRAGMENTS"].length) {
            bang.crisps = bang.crisps.concat(tree_2_crisps_and_frags(item)["crisps"]);
            bang.frags.push({
                range: item["range"],
                level: item["level"],
                tag_name: item["@nodeName"] ? item["@nodeName"] : "",
                attrs: item["@attributes"] ? item["@attributes"] : [],
            });
            bang.frags = bang.frags.concat(tree_2_crisps_and_frags(item)["frags"]);
        };
    }
    return bang;
}

function xml_node_2_crisps_and_frags(node, current_idx=0, current_level=0) {
    return tree_2_crisps_and_frags(xml_node_2_tree(node, current_idx, current_level));
}

//// Crisps_And_Frags to Tree

function crisps_and_frags_2_tree(bang, idx_left=0, idx_right, current_level=0, meta) {

    var crisps = bang.crisps;
    var frags = bang.frags;

    var max_idx = bang.crisps.slice(-1)[0].idx+1;
    idx_right = (typeof idx_right !== 'undefined') ? idx_right : max_idx;
    meta = (typeof meta !== 'undefined') ? meta : {
        "@nodeName": bang["@nodeName"],
        "@attributes": bang["@attributes"],
        "range": bang["range"],
        "level": bang["level"],
    };

    // 构建 children 数组
    // 遍历 Frags 并递归下列操作
        // 检查是否存在 Frag 的 range[0] 与当前 idx 匹配
            // 如果是，那么对该 Frag 执行递归，并将返回的结果（作为一个整体对象）加入 children 数组
            // 如果否，那么检查是否存在 Crisp 的 idx 与当前 idx 匹配
                // 如果是，那么将此 Crisp 加入 children 数组
    // 返回 children 数组

    var children = [];

    let have_frag = false;
    let skip_idx = -1;
    for (let curr_idx = idx_left; curr_idx < idx_right; curr_idx++) {
        let curr_frags = frags.filter(frag => frag.range[0] == curr_idx && frag.level == current_level+1);
        if (curr_frags.length) {
            curr_frags.sort((frag_a, frag_b) => {return frag_a.level - frag_b.level});
            let first_frag = curr_frags.shift();
            let that_meta = {
                "@nodeName": first_frag["tag_name"] || "",
                "@attributes": first_frag["attrs"] || {},
                "range": first_frag["range"],
                "level": first_frag["level"],
            }
            children.push(crisps_and_frags_2_tree(bang, first_frag.range[0], first_frag.range[1], first_frag.level, that_meta));
            skip_idx = first_frag.range[1];

        } else if (curr_idx >= skip_idx) {
            let curr_crisp = crisps.filter(crisp => crisp.idx == curr_idx)[0];
            children.push(curr_crisp);
        }
    }

    let result = {
        "@nodeName": meta["@nodeName"],
        "level": meta["level"],
        "range": meta["range"],
        "%FRAGMENTS": children,
        "@attributes": meta["@attributes"],
    };

    return result;

}

//// Tree to XML_text

function tree_2_xml(tree) {
    // tree: the tree object.
    let tag_name = tree["@nodeName"] || "node";

    let attrs = "";
    if (tree["@attributes"]) {
        for (let [key, value] of Object.entries(tree["@attributes"])) {
            attrs += `${key}="${value}" `;
        }
    }

    let inter = "";
    if (tree["%FRAGMENTS"].length) {
        for (let child of tree["%FRAGMENTS"]) {
            if (child.isChar) {
                inter += child.value;
            } else {
                inter += tree_2_xml(child);
            }
        }
    }

    let result = `<${(tag_name + ' ' + attrs).trim()}>${inter}</${tag_name}>`;
    return result;
}








// class Crisp {
//     constructor(value="", idx=0, level=0) {
//         this.value = value;
//         this.idx = idx;
//         this.level = level;
//     }
//     level_up(x=1) {
//         this.level += x;
//     }
//     level_down(x=1) {
//         if (this.level-x >= 0) {
//             this.level -= x;
//         } else {
//             this.level = 0;
//         }
//     }
// }

// class Attr {
//     constructor(attr_key="", attr_value="") {
//         this.attr_key = attr_key;
//         this.attr_value = attr_value;
//     }
// }

// class Frag {
//     constructor(range=[0, 0], tag_name="tag", attrs=[], level=0) {
//         this.range = range;
//         this.tag_name = tag_name;
//         this.attrs = attrs;
//         this.level = level;
//     }
//     level_up(x=1) {
//         this.level += x;
//     }
//     level_down(x=1) {
//         if (this.level - x >= 0) {
//             this.level -= x;
//         } else {
//             this.level = 0;
//         }
//     }
//     range_in(a, b) {
//         if (a >= b) {
//             let c = a;
//             a = b;
//             b = c;
//         }
//         return (a <= this.range[0] && b >= this.range[1])
//     }
//     range_cover(a, b) {
//         if (a >= b) {
//             let c = a;
//             a = b;
//             b = c;
//         }
//         return (a >= this.range[0] && b <= this.range[1])
//     }
//     add_attr(attr_key, attr_value) {
//         this.attrs.push(new Attr(attr_key, attr_value));
//     }
// }

// class Bang {
//     constructor(chars, frags) {
//         this.chars = chars;
//         this.frags = frags;
//     }
// }


























