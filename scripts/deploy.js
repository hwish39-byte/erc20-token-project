const hre = require("hardhat");

async function main() {
    // 获取合约工厂
    const MyToken = await hre.ethers.getContractFactory("MyToken");

    // 部署参数
    const tokenName = "MyToken";
    const tokenSymbol = "MTK";

    // 部署合约
    const myToken = await MyToken.deploy(tokenName, tokenSymbol);

    // 等待部署完成
    await myToken.waitForDeployment();

    // 获取合约地址
    const address = await myToken.getAddress();

    console.log("MyToken deployer to:", address);
    console.log("Token Name:", tokenName);
    console.log("Token Symbol:", tokenSymbol);
    console.log("Total Supply:", await myToken.totalSupply());
    console.log("Decimals:", await myToken.decimals());

    // 验证合约（可选，需要Etherscan API Key）
  // await hre.run("verify:verify", {
  //   address: address,
  //   constructorArguments: [tokenName, tokenSymbol],
  // });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });