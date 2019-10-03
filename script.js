// var parser = require('simple-excel-to-json')
// var doc = parser.parseXls2Json('./Export/01_Isian R403 berkode 1 2 5 7 namun R408 berkode 0.xlsx'); 

// console.log(doc[0]);

const exportFolder = './Export/';
const fs = require('fs');
// import mergeByKey from "array-merge-by-key";
const mergeByKey = require("array-merge-by-key");

let array_file_names = [];
let array_json_content = [];

fs.readdirSync(exportFolder).forEach(file => {
    array_file_names.push(file);
});

// console.log(array_file_names);

// convert all excel in dir to json
for (let index = 0; index < array_file_names.length; index++) {
    const element = array_file_names[index];
    var parser = require('simple-excel-to-json');
    var doc = parser.parseXls2Json(exportFolder+element);
    let json_excel = doc[0];

    // add id & error flag to json
    json_excel.forEach(function(part, index) {
        this[index]["id"] = this[index]["Prop"]+"-"+this[index]["Kab"]+"-"+this[index]["Kec"]+"-"+this[index]["Desa"]+"-"
            +this[index]["NBS"]+"-"+this[index]["NKS"]+"-"+this[index]["Nurt"];
        this[index]["error_"+element.substring(0,2)] = element;
    }, json_excel); // use arr as this

    // console.log(json_excel);
    array_json_content.push(json_excel);
}

// console.log(array_json_content);

// Merge JSON
let json_merge = [];
for (let index = 0; index < array_json_content.length; index++) {
    const element = array_json_content[index];
    json_merge = mergeByKey("id", json_merge, element)
}

console.log(json_merge);
fs.writeFileSync("JSON_MERGE.json", JSON.stringify(json_merge));