# MyToken - ERC-20 代币项目

## 项目概述
这是一个基于以太坊的 ERC-20 标准代币智能合约项目，使用 Solidity、Hardhat 和 OpenZeppelin 库开发。

## 功能特性
- ✅ 符合 ERC-20 标准
- ✅ 安全权限控制（Ownable）
- ✅ 批量转账功能
- ✅ 铸造和销毁机制
- ✅ 完整的测试覆盖
- ✅ 多网络部署支持

## 技术栈
- **Solidity 0.8.20** - 智能合约开发语言
- **Hardhat** - 开发框架
- **OpenZeppelin** - 安全合约库
- **Ethers.js** - 以太坊交互库
- **Mocha/Chai** - 测试框架

## 安装步骤

### 1. 克隆项目
```bash
git clone <repository-url>
cd erc20-token-project
### 2. 安装依赖
```bash
npm install
### 3. 配置环境变量
复制 .env.example 为 .env 并填入你的配置：
```bash
cp .env.example .env
编辑 .env 文件：
```env
PRIVATE_KEY=你的私钥
INFURA_API_KEY=你的Infura API Key
ETHERSCAN_API_KEY=你的Etherscan API Key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/你的API_KEY

## 使用方法

### 编译合约
```bash
npx hardhat compile
### 运行测试
```bash
npx hardhat test
### 部署合约
1、本地网络
```bash
# 启动本地节点
npx hardhat node
# 在新终端部署
npx hardhat run scripts/deploy.js --network localhost
2、Sepolia测试网
```bash
npx hardhat run scripts/deploy.js --network sepolia

## 合约功能

### 基本ERC-20功能
-transfer(to, amount) - 转账
-balanceOf(account) - 查询余额
-approve(spender, amount) - 授权
-transferFrom(from, to, amount) - 授权转账
-allowance(owner, spender) - 查询授权额度
### 扩展功能
-mint(to, amount) - 铸造新代币（仅拥有者）
-burn(from, amount) - 销毁代币（仅拥有者）
-batchTransfer(recipients, amounts) - 批量转账

## 许可证
MIT License