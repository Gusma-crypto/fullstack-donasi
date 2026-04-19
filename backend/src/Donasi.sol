// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Donasi {
    address public owner;
    uint256 public totalDonasi;
    mapping(address => uint256) public kontribusi;

    event DonasiDiterima(address indexed donatur, uint256 jumlah);
    event DanaDitarik(uint256 jumlah);

    constructor() {
        owner = msg.sender;
    }

    // Fungsi untuk mengirim donasi
    function kirimDonasi() public payable {
        require(msg.value > 0, "Minimal donasi 0 ETH");
        
        kontribusi[msg.sender] += msg.value;
        totalDonasi += msg.value;
        
        emit DonasiDiterima(msg.sender, msg.value);
    }

    // Fungsi untuk menarik dana (hanya owner)
    function tarikDana() public {
        require(msg.sender == owner, "Bukan owner");
        uint256 balance = address(this).balance;

        // Cara baru yang lebih aman dibanding .transfer()
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer gagal");

        emit DanaDitarik(balance);
    }

    // Mendapatkan saldo kontrak saat ini
    function getSaldo() public view returns (uint256) {
        return address(this).balance;
    }
}