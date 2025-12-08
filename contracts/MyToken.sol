// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {

    // 代币参数
    uint8 private constant _DECIMALS = 18;

    /**
     * @dev 构造函数，初始化代币
     * @param name 代币名称
     * @param symbol 代币符号
     */
    constructor (
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** _DECIMALS);
    }

    /**
     * @dev 获取代币小数位数
     */
    function decimals() public pure override returns(uint8) {
        return _DECIMALS;
    }

    /**
     * @dev 获取代币总供应量
     */
    /*function totalSupply() public pure override returns (uint256) {
        return _TOTAL_SUPPLY;
    }

    /**
     * @dev 铸造新代币（仅拥有者）
     * @param to 接收地址
     * @param amount 铸造数量
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint (to, amount);
    }

    /**
     * @dev 销毁代币（仅拥有者）
     * @param from 销毁地址
     * @param amount 销毁数量
     */
    function burn(address from, uint256 amount) public onlyOwner {
        _burn (from, amount);
    }

    /**
     * @dev 批量转账
     * @param recipients 接收者数组
     * @param amounts 数量数组
     */
    function batchTransfer(
        address[] memory recipients,
        uint256[] memory amounts
    )external returns(bool) {
        require(recipients.length == amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
        }

        return true;
    }
}