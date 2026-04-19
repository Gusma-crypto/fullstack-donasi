export const DONASI_ADDRESS = '0xE3b35edf860540D316Ed397ec987748fE29E079c'

export const DONASI_ABI = [
  { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "getSaldo", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "kirimDonasi", "inputs": [], "outputs": [], "stateMutability": "payable" },
  { "type": "function", "name": "kontribusi", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "tarikDana", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "totalDonasi", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }
] as const