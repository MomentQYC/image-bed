// 生成 token 并复制到剪贴板
import process from 'process'
import qiniu from 'qiniu'
import dotenv from 'dotenv'
import ncp from 'copy-paste'

dotenv.config()

// 七牛账号下的一对有效的Access Key和Secret Key
// 对象存储空间名称 bucket
const accessKey = process.env.QINIU_ACCESS_KEY
const secretKey = process.env.QINIU_SECRET_KEY
const bucket = process.env.QINIU_BUCKET
const domain = process.env.QINIU_DOMAIN
const prefix = process.env.QINIU_PREFIX
const scope = process.env.QINIU_SCOPE

// 鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const options = {
  scope: bucket,
  expires: 60 * 60 * 24 * 30, // 过期时间(s)
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

const envToken = btoa(JSON.stringify({
  token: uploadToken,
  date: Date.now() + options.expires * 1000,
  domain,
  prefix,
  scope,
  //  自定义qiniu 上传补充配置
  //  config: {

  // },
}))

// 复制到剪贴板
ncp.copy(envToken, () => {
  console.log('【token】已写入剪贴板')
  console.log(envToken)
})
