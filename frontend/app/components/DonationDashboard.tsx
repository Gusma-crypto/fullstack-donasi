'use client'

import { useState, useEffect } from 'react'
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { DONASI_ADDRESS, DONASI_ABI } from '../constant'

export function DonationDashboard() {
  // 🔹 Semua hook di atas
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // 🔹 Read total donasi
  const { data: totalDonasi } = useReadContract({
    address: DONASI_ADDRESS,
    abi: DONASI_ABI,
    functionName: 'totalDonasi',
    query: { refetchInterval: 3000 }
  })

  // 🔹 Read kontribusi user (aman kalau address null)
  const { data: userKontribusi } = useReadContract({
    address: DONASI_ADDRESS,
    abi: DONASI_ABI,
    functionName: 'kontribusi',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 3000 }
  })

  // 🔹 Write contract
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // 🔹 Function donate
  const handleDonate = () => {
    if (!amount || isNaN(Number(amount))) {
      return alert("Masukkan jumlah ETH yang valid")
    }

    writeContract({
      address: DONASI_ADDRESS,
      abi: DONASI_ABI,
      functionName: 'kirimDonasi',
      value: parseEther(amount),
    })
  }

  // 🔹 Hindari hydration error
  if (!mounted) return null

  // 🔹 Kalau belum connect
  if (!isConnected) {
    return (
      <div className="p-4 text-center">
        Silakan hubungkan wallet Anda terlebih dahulu.
      </div>
    )
  }

  // 🔹 UI utama
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Zyfatech Donasi
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-xs text-blue-600 uppercase font-semibold">
            Total Donasi
          </p>
          <p className="text-lg font-bold text-blue-900">
            {totalDonasi ? formatEther(totalDonasi) : '0'} ETH
          </p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg text-center">
          <p className="text-xs text-green-600 uppercase font-semibold">
            Kontribusi Anda
          </p>
          <p className="text-lg font-bold text-green-900">
            {userKontribusi ? formatEther(userKontribusi) : '0'} ETH
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="number"
          step="0.01"
          placeholder="Jumlah ETH (Contoh: 0.05)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleDonate}
          disabled={isPending || isConfirming}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:bg-gray-400"
        >
          {isPending
            ? 'Konfirmasi di Wallet...'
            : isConfirming
            ? 'Menunggu Blok...'
            : 'Kirim Donasi Sekarang'}
        </button>

        {isSuccess && (
          <div className="p-3 bg-green-100 text-green-700 text-sm rounded-lg text-center">
            Berhasil!{' '}
            <a
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              className="font-bold underline"
            >
              Lihat Transaksi
            </a>
          </div>
        )}

        {writeError && (
          <p className="text-red-500 text-xs text-center">
            Gagal:{' '}
            {writeError.message.includes('insufficient funds')
              ? 'Saldo tidak cukup'
              : 'Transaksi ditolak'}
          </p>
        )}
      </div>
    </div>
  )
}