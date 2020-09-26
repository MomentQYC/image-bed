const qiniu = require('qiniu')
const fs = require('fs');
// 七牛账号下的一对有效的Access Key和Secret Key
// 对象存储空间名称 bucket
let accessKey = 'xxxxx',
    secretKey = 'xxxx',
    bucket = 'xxxx';

//鉴权对象
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

let options = {
    scope: bucket,
    expires: 60 * 60 * 24 * 7 //过期时间(s)
};
let putPolicy = new qiniu.rs.PutPolicy(options);
let uploadToken = putPolicy.uploadToken(mac);

// 将获取的token生成写入到token.txt中
fs.writeFileSync("./src/config/qiniu.config.js", `
import * as qiniu from "qiniu-js";
let config = {
    useCdnDomain: true,
    region: qiniu.region.z0
}
let token = '${uploadToken}'
let date = ${Date.now() + options.expires * 1000}
let Domain = 'http://img.cdn.sugarat.top'
export {
    config,
    token,
    Domain,
    date
}`);