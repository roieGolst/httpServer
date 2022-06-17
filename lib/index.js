const methodList = require("./methodList");
const versionList = require("./versionList");
const statusList = require("./statusCodeList");

module.exports = {
    statusCodeList: statusList,
    methodList: methodList.list,
    versionList: versionList.list
}