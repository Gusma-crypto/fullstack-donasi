// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Donasi} from "../src/Donasi.sol";

contract DonasiScript is Script {
    Donasi public donasi;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        donasi = new Donasi();

        vm.stopBroadcast();
    }
}
