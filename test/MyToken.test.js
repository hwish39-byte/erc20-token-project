const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let MyToken;
  let myToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // 测试前的准备工作
  beforeEach(async function () {
    MyToken = await ethers.getContractFactory("MyToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    myToken = await MyToken.deploy("MyToken", "MTK");
    await myToken.waitForDeployment();
  });

  describe("部署", function () {
    it("应该设置正确的代币名称和符号", async function () {
      expect(await myToken.name()).to.equal("MyToken");
      expect(await myToken.symbol()).to.equal("MTK");
    });

    it("应该设置正确的小数位数", async function () {
      expect(await myToken.decimals()).to.equal(18);
    });

    it("应该将总供应量分配给部署者", async function () {
      const ownerBalance = await myToken.balanceOf(owner.address);
      const totalSupply = await myToken.totalSupply();
      expect(ownerBalance).to.equal(totalSupply);
    });

    it("应该返回正确的总供应量", async function () {
      const totalSupply = await myToken.totalSupply();
      expect(totalSupply).to.equal(ethers.parseUnits("1000000", 18));
    });
  });

  describe("转账", function () {
    it("应该允许账户之间转账", async function () {
      // 从owner转账100个代币给addr1
      const transferAmount = ethers.parseUnits("100", 18);
      await myToken.transfer(addr1.address, transferAmount);
      
      const addr1Balance = await myToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
    });

    it("应该更新余额", async function () {
      const initialOwnerBalance = await myToken.balanceOf(owner.address);
      const transferAmount = ethers.parseUnits("100", 18);
      
      await myToken.transfer(addr1.address, transferAmount);
      
      const finalOwnerBalance = await myToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - transferAmount);
    });

    it("应该拒绝余额不足的转账", async function () {
      const initialOwnerBalance = await myToken.balanceOf(owner.address);
      
      // 尝试转账超过余额的金额
      await expect(
        myToken.connect(addr1).transfer(owner.address, ethers.parseUnits("1", 18))
      ).to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance");
    });
  });

  describe("批准和授权转账", function () {
    it("应该允许批准和授权转账", async function () {
      const approveAmount = ethers.parseUnits("100", 18);
      
      // 批准addr1使用owner的代币
      await myToken.approve(addr1.address, approveAmount);
      
      // 检查批准额度
      const allowance = await myToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(approveAmount);
      
      // 使用授权转账
      const transferAmount = ethers.parseUnits("50", 18);
      await myToken.connect(addr1).transferFrom(
        owner.address,
        addr2.address,
        transferAmount
      );
      
      // 检查余额
      const addr2Balance = await myToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
      
      // 检查剩余的授权额度
      const remainingAllowance = await myToken.allowance(owner.address, addr1.address);
      expect(remainingAllowance).to.equal(approveAmount - transferAmount);
    });
  });

  describe("批量转账", function () {
    it("应该允许批量转账", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [
        ethers.parseUnits("100", 18),
        ethers.parseUnits("200", 18)
      ];
      
      const initialOwnerBalance = await myToken.balanceOf(owner.address);
      
      // 执行批量转账
      await myToken.batchTransfer(recipients, amounts);
      
      // 检查接收者余额
      const addr1Balance = await myToken.balanceOf(addr1.address);
      const addr2Balance = await myToken.balanceOf(addr2.address);
      
      expect(addr1Balance).to.equal(amounts[0]);
      expect(addr2Balance).to.equal(amounts[1]);
      
      // 检查发送者余额
      const finalOwnerBalance = await myToken.balanceOf(owner.address);
      const totalTransferred = amounts[0] + amounts[1];
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - totalTransferred);
    });
    
    it("应该拒绝长度不匹配的批量转账", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [ethers.parseUnits("100", 18)]; // 长度不匹配
      
      await expect(
        myToken.batchTransfer(recipients, amounts)
      ).to.be.revertedWith("Arrays length mismatch");
    });
  });

  describe("铸造和销毁", function () {
    it("应该允许拥有者铸造新代币", async function () {
      const initialSupply = await myToken.totalSupply();
      const mintAmount = ethers.parseUnits("1000", 18);
      
      // 铸造新代币给addr1
      await myToken.mint(addr1.address, mintAmount);
      
      const addr1Balance = await myToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(mintAmount);
      
      // 总供应量应该增加
      const totalSupply = await myToken.totalSupply();
      expect(totalSupply).to.equal(initialSupply + mintAmount);
    });

    it("应该允许拥有者销毁代币", async function () {
      const initialSupply = await myToken.totalSupply();
      const burnAmount = ethers.parseUnits("1000", 18);
      
      // 先转账给addr1
      await myToken.transfer(addr1.address, burnAmount);
      
      // 作为拥有者销毁addr1的代币
      await myToken.burn(addr1.address, burnAmount);
      
      // 检查addr1余额
      const addr1Balance = await myToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(0);
      
      // 总供应量应该减少
      const totalSupply = await myToken.totalSupply();
      expect(totalSupply).to.equal(initialSupply - burnAmount);
    });

    it("应该拒绝非拥有者铸造代币", async function () {
      const mintAmount = ethers.parseUnits("1000", 18);
      
      await expect(
        myToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(myToken, "OwnableUnauthorizedAccount");
    });
  });
});