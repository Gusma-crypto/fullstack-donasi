## Sistem Donasi

this code is learn basic foundry Donasi

## Documentation
https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

```shell
source .env && forge script script/Deploydonasi.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

- deploy jika gas tidak cukup di sepolia testnet solusi turunin biaya gass
```shell
forge script script/Deploydonasi.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --gas-price 2000000000
```

### Cast

```shell
$ cast <subcommand>
```
#### Test RPC (Jika URL langsung)

```shell
cast block-number --rpc-url https://eth-sepolia.g.alchemy.com/v2/your-api-key
```

#### Test RPC Jika menggunakan variabel dari .env
```shell
source .env
cast block-number --rpc-url $RPC_URL
```

#### cek wallet mana yang digunakan dengan privatekey di .env

```shell
cast wallet address --private-key $PRIVATE_KEY
```
### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

### Contract deploy
##### sepolia testnet

```json
Contract Address: 0xE3b35edf860540D316Ed397ec987748fE29E079c
```
#### verify contract
```json
GUID: `ylcytk3gvq8kncvw8gfm6r4wtc6jwhdpujtydf8dt9bnbcqwhj`
URL: https://sepolia.etherscan.io/address/0xe3b35edf860540d316ed397ec987748fe29e079c
```

### CARA BACA FILE DI .ENV

```shell
source .env
```
- cara kedua

```shell
export $CONTRACT_ADDRESS 
```
---
### Test Apakah file .env sudah terbaca?

```shell
echo 
```

### Verifikasi Contract
```shell
 forge verify-contract   --chain sepolia   $CONTRACT_ADDRESS  src/Donasi.sol:Donasi   --watch

```
---
