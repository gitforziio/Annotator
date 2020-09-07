function xml2js() {
    let domParser = new DOMParser();
    let xmlObject = domParser.parseFromString(this.result, "text/xml");
}

function node2obj(node) {
    let dct = {};
    dct["@nodeName"] = node.nodeName;
    dct["@nodeType"] = node.nodeType;
    if (dct["@nodeType"] == 9) {
        dct["@nodeValue"] = node.nodeValue;
    };
    if (dct["@nodeType"] == 3 || dct["@nodeType"] == 8) {
        dct["@nodeValue"] = node.nodeValue;
    };
    if (node.attributes) { if (node.attributes.length) {
        dct["@attributes"] = {};
        for (let i = 0; i < node.attributes.length; i++) {
            dct["@attributes"][node.attributes[i].nodeName] = node.attributes[i].nodeValue;
        };
    }; };
    if (node.childNodes) { if (node.childNodes.length) {
        if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {
            dct["@textContent"] = node.textContent;
        } else {
            dct["@childNodes"] = [];
            for (let nd of node.childNodes) {
                dct["@childNodes"].push(node2obj(nd));
            };
        };
    }; };
    return dct;
}

function obj2node(obj) {
    let domParser = new DOMParser();
    let temp_xml_doc = domParser.parseFromString(`<?xml version="1.0" encoding="utf-8"?><SaveGame />`, "text/xml")
    let node = temp_xml_doc.createElement(`${name}`);
}

function obj2node_old(name, obj) {
    var parser = new DOMParser();
    var temp_xml_doc = parser.parseFromString(`<?xml version="1.0" encoding="utf-8"?><SaveGame />`, "text/xml")
    let node = temp_xml_doc.createElement(`${name}`);
    if (typeof(obj)=="string") {
        if (obj.length) {
            let txt = temp_xml_doc.createTextNode(`${obj}`);
            node.appendChild(txt);
        }
        return node;
    } else {
        for (let key in obj) {
            if (key=="@attributes") {
                for (let attrName in obj[key]) {
                    let attr = temp_xml_doc.createAttribute(attrName);
                    attr.value = obj[key][attrName];
                    node.setAttributeNode(attr);
                }
            } else if (key=="@text") {
                if (obj[key].length) {
                    let txt = temp_xml_doc.createTextNode(`${obj[key]}`);
                    node.appendChild(txt);
                }
            } else {
                if (typeof(obj[key])=="string") {
                    let nd_child = obj2node(key, obj[key]);
                    node.appendChild(nd_child);
                } else if (obj[key].length) {
                    for (let obb of obj[key]) {
                        let nd_child = obj2node(key, obb);
                        node.appendChild(nd_child);
                    }
                } else {
                    // console.log(`key: ${key}`);
                    // console.log(obj[key]);
                    let nd_child = obj2node(key, obj[key]);
                    // console.log(`nd_child: ${nd_child}`);
                    node.appendChild(nd_child);
                }
            }
        }
        return node;
    }
}
