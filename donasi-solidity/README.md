# Simple donasi
ini adalah project sederhana untuk mengumpulkan dana donasi dengan meminimalkan penggunaan biaya gas fee.


## REVERT VS REQUIRE
-- pada konsep kali ini kita menggunakan revert 
-- tujuan revert : hemat gas bisa dilihat tabel perbandingan berikut

-----------------------------------------------------------------------------
| Aspek              | `revert CustomError()`    | `require(..., "string")` |
| ------------------ | ------------------------- | ------------------------ |
| ⛽ Gas             | **LEBIH HEMAT**           | Lebih mahal              |
| 📦 Ukuran bytecode | Kecil                     | Lebih besar              |
| 🧾 Error message   | Error name (typed)        | String                   |
| 🧠 Auditor mindset | ✅ Best practice modern   | ⚠️ Legacy                |
| 🔎 Decoding error  | Lebih jelas & terstruktur | String biasa             |
| Solidity versi     | ≥ 0.8.4                   | Semua versi              |


## 💸 KENAPA CUSTOM ERROR LEBIH HEMAT GAS?
### require pakai string:
```bash
-- String disimpan di bytecode
-- Semakin panjang string → semakin mahal
-- Gas cost naik
```

### revert NominalNol():
```bash
-- Tidak menyimpan string
-- Hanya selector error
-- Jauh lebih murah
-- Ini penting banget di contract yang sering dipanggil
```

## Contract Wajib di Test 
```bash
-- Tujuan Test itu untuk MEMBUKTIKAN JANJI KODE.
-- ❝Jika kondisi A terjadi, maka hasilnya HARUS B dan JIKA tidak HARUS GAGAL ❞
-- Auditor membaca test untuk menjawab: “Apakah kontrak ini benar, aman, dan tidak bisa disalahgunakan?”
```
## Struktur Test
```bash
Donasi Contract
 ├─ constructor
 │   └─ set owner correctly
 ├─ donasi()
 │   ├─ revert if value is zero
 │   ├─ accept donation if value > 0
 │   ├─ update donor mapping
 │   └─ emit event
 ├─ tarikDonasi()
 │   ├─ revert if not owner
 │   ├─ revert if balance is zero
 │   ├─ transfer funds
 │   └─ emit event
 └─ getBalance()
     └─ return correct balance
```
## CARA BERPIKIR TEST (INI KUNCI)
Untuk setiap fungsi, tanyakan 3 hal:
```bash
✅ A. Kapan fungsi HARUS BERHASIL?
❌ B. Kapan fungsi HARUS GAGAL?
📢 C. Apa EFEK SAMPING yang harus terjadi?

dan setiap test harus punya 3 ini:
-- SETUP   → deploy kontrak
-- AKSI    → (constructor jalan otomatis)
-- ASSERT  → owner == deployer
```


## Error deploy 
-- coba cek ada javascript versi lama g yang pakai require

## Verify
setelah deploy lakukan verifikasi dengan CLI, bisa juga ditambahkan di hardhat config, berikut cara verify melalui CLI
```bash
npx hardhat verify \
  --network sepolia \
  0xcA8c44c9146670565A052F22f4bf63b19890CA39
```

# Success deploy and Verified
```javascript
=== Blockscout ===

📤 Submitted source code for verification on Blockscout:

  contracts/Donasi.sol:Donasi
  Address: 0xcA8c44c9146670565A052F22f4bf63b19890CA39

⏳ Waiting for verification result...


✅ Contract verified successfully on Blockscout!

  contracts/Donasi.sol:Donasi
  Explorer: https://eth.blockscout.com/address/0xcA8c44c9146670565A052F22f4bf63b19890CA39#code

=== Sourcify ===

The contract at 0xcA8c44c9146670565A052F22f4bf63b19890CA39 has already been verified on Sourcify.

If you need to verify a partially verified contract, please use the --force flag.

Explorer: https://sourcify.dev/server/repo-ui/1/0xcA8c44c9146670565A052F22f4bf63b19890CA39

```