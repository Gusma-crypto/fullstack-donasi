import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
module.exports = buildModule("DonasiModule", (m) => {
  // 1. Definisikan kontrak yang mau dideploy
  // "Donasi" harus sama persis dengan nama Contract di file .sol
  const donasi = m.contract("Donasi");
// Tidak perlu m.call kecuali Anda ingin melakukan sesuatu yang spesifik
  // 2. Return kontrak tersebut agar bisa diakses
  return { donasi };
});