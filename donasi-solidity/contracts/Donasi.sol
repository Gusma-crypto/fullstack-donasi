// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Donasi {
    address public owner;
    uint256 public tototalDonasi;

    //mencatat siapa yang menyumbang
    mapping(address=>uint256) public donatur;

    event Donasiditerima(address indexed pengirim, uint256 jumlah);
    event Donasiditarik(uint256 jumlah);

    //cutom erorr hemat gas
     error HanyaOwner();
     error NominalNol();
     error SaldoKosong();
     error GagalTransfer();

     constructor(){
        //pengdeploy adalah owner
        owner = msg.sender;

     }

     //modifier manual pengganti ownable
     modifier OnlyOwner(){
        require(msg.sender ==owner, "Hanya owner yang bisa menarik donasi");
        _;
     }

     //fungsi donasi
     function donasi()external payable{
        if(msg.value ==0) revert NominalNol();

        donatur[msg.sender] += msg.value;
        tototalDonasi += msg.value;

        emit Donasiditerima(msg.sender, msg.value);

     }

     // Fungsi Tarik Dana (Hanya Owner) address(this).balance ini merujuk pada saldo kontrak
    function tarikDonasi() external OnlyOwner(){
        uint256 saldo = address(this).balance;
        if(saldo==0) revert SaldoKosong();

        //lakukan tarik saldo namun untuk mengembalikain 
        (bool sukses, ) = payable(owner).call{value: saldo}("");
        if(!sukses) revert GagalTransfer();
        emit Donasiditarik(saldo);

    }

    // Cek saldo kontrak
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    
}