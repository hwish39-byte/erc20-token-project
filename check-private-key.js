// test-private-key.js
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY || "";

console.log("私钥检查:");
console.log("原始值:", privateKey);
console.log("长度:", privateKey.length);
console.log("是否以 0x 开头:", privateKey.startsWith("0x"));

// 去掉 0x 前缀后的长度
const keyWithoutPrefix = privateKey.startsWith("0x") 
  ? privateKey.slice(2) 
  : privateKey;
console.log("去掉 0x 后的长度:", keyWithoutPrefix.length);
console.log("十六进制验证:", /^[0-9a-fA-F]+$/.test(keyWithoutPrefix));