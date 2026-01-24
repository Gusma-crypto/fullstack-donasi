import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("Donasi contracat", async function() {
    //jalankan fungsi contract donasi disini
    //“Sambungkan test ke jaringan Hardhat, lalu ambil public blockchain client (read-only) berbasis Viem.”
    const {viem} = await network.connect();
    const publicClient = await viem.getPublicClient();

    //Seharusnya meng-emit event Donasi saat fungsi donasi() dipanggil tidak mempengaruhi logic
    it("Should emit the Donasi event when calling the donasi() function", async function() {
        // 1️⃣ deploy contract donasi
        const donasi = await viem.deployContract("Donasi");
        // 2️⃣ ambil wallet deployer
        const [deployer] = await viem.getWalletClients();
        // 3️⃣ baca owner dari contract
        const owner = await donasi.read.owner();

        // 5️⃣ assert bahwa owner sesuai dengan deployer
        assert.equal(owner, deployer.account.address);
    });
});