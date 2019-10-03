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
        // this[index]["error_"+element.substring(0,2)] = element;
        this[index][element] = 1;
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

// console.log(json_merge);
// fs.writeFileSync("JSON_MERGE.json", JSON.stringify(json_merge));

// let obj = {};
// let array_result = [];

// for (let index = 0; index < json_merge.length; index++) {
//     const element = json_merge[index];
//     obj["Prop"]=element["Prop"];
//     obj["Kab"]=element["Kab"];
//     obj["Kec"]=element["Kec"];
//     obj["Desa"]=element["Desa"];
//     obj["NBS"]=element["NBS"];
//     obj["NKS"]=element["NKS"];
//     obj["Nurt"]=element["Nurt"];
//     obj["NamaKRT"]=element["NamaKRT"];
//     obj["Catatan"]=element["Catatan"];
//     obj["R402"]=element["R402"];
//     obj["id"]=element["id"];

//     for (let i = 0; i < array_file_names.length; i++) {
//         const file_name = array_file_names[i];
//         if(typeof element[file_name] === 'undefined'){
//             obj[file_name] = 0;
//         }else{
//             obj[file_name] = element[file_name];
//         }
//     }

//     // console.log(obj);
//     array_result.push(obj);
// }

// console.log(array_result);
// fs.writeFileSync("JSON_MERGE.json", JSON.stringify(array_result));

for (let index = 0; index < json_merge.length; index++) {
    for (const key in json_merge[index]) {
        if (json_merge[index].hasOwnProperty(key)) {
            const element = json_merge[index][key];
            // console.log(key);
            if(key.substring(0,1)=="R"&&key!="R402"){
                delete json_merge[index][key];
            }
        }
    }

}

console.log(json_merge);
fs.writeFileSync("JSON_MERGE.json", JSON.stringify(json_merge));