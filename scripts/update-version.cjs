#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取manifest.json
const manifestPath = path.join(__dirname, '..', 'manifest.json');

try {
  // 读取当前manifest.json
  const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // 解析当前版本号
  const currentVersion = manifestJson.version;
  const versionParts = currentVersion.split('.').map(Number);
  
  // 增加版本号 (如果是x.y格式，增加y；如果是x.y.z格式，增加z)
  if (versionParts.length === 2) {
    versionParts[1] = versionParts[1] + 1;
  } else {
    versionParts[2] = (versionParts[2] || 0) + 1;
  }
  
  const newVersion = versionParts.join('.');
  
  // 更新manifest.json
  manifestJson.version = newVersion;
  fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 2) + '\n');
  
  console.log(`manifest.json版本号已更新: ${currentVersion} -> ${newVersion}`);
  
} catch (error) {
  console.error('更新版本号时出错:', error.message);
  process.exit(1);
}
