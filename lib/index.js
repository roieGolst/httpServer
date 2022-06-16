const methodList = require("./methodList");
const versionList = require("./versionList");
const statusList = require("./statusCodeList");

module.exports = {
    statusCodeList: statusList.list,
    methodList: methodList.list,
    versionList: versionList.list
}