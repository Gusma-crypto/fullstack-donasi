'use client'

import { useState, useEffect } from 'react'
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useDisconnect,
  useBalance,
  useConnect
} from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { DONASI_ADDRESS, DONASI_ABI } from '../constant'

export function DonationDashboard() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()
  const [mounted, setMounted] = useState(false)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Data Saldo & Kontrak
  const { data: walletBalance } = useBalance({ address })
  
  const { data: totalDonasi } = useReadContract({
    address: DONASI_ADDRESS,
    abi: DONASI_ABI,
    functionName: 'totalDonasi',
    query: { enabled: isConnected, refetchInterval: 3000 }
  })

  const { data: userKontribusi } = useReadContract({
    address: DONASI_ADDRESS,
    abi: DONASI_ABI,
    functionName: 'kontribusi',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 3000 }
  })

  // 2. Ambil alamat Owner dari Contract
  const { data: ownerAddress } = useReadContract({
    address: DONASI_ADDRESS,
    abi: DONASI_ABI,
    functionName: 'owner',
  })

  // Cek apakah user yang login adalah owner
  const isOwner = address?.toLowerCase() === (ownerAddress as string)?.toLowerCase()

  // 3. Logic Write Contract (Donasi & Withdraw)
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleConnect = () => {
    const connector = connectors[0]
    if (connector) connect({ connector })
  }

  const handleDonate = () => {
    if (!amount || isNaN(Number(amount))) return alert("Masukkan jumlah ETH yang valid")
    writeContract({
      address: DONASI_ADDRESS,
      abi: DONASI_ABI,
      functionName: 'kirimDonasi',
      value: parseEther(amount),
    })
  }

  // 🔹 Fungsi Baru: Withdraw
  const handleWithdraw = () => {
    if (!isOwner) return alert("Hanya owner yang bisa menarik dana")
    writeContract({
      address: DONASI_ADDRESS,
      abi: DONASI_ABI,
      functionName: 'tarikDana',
    })
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      {/* NAVBAR */}
      {isConnected && (
        <nav className="bg-white border-b sh
        adow-sm px-4 md:px-6 py-3 flex justify-between items-center fixed top-0 w-full z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">Z</div>
            <span className="font-bold text-gray-800 text-sm md:text-base leading-tight">Zyfatech Labs</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-blue-50 px-2 md:px-3 py-1 rounded-full text-right border border-blue-100">
              <p className="text-[8px] md:text-[10px] text-blue-500 font-bold uppercase leading-none">Sepolia Balance</p>
              <p className="text-xs md:text-sm font-mono font-bold text-blue-700">
                {walletBalance ? `${Number(formatEther(walletBalance.value)).toFixed(4)}` : '0.00'} <span className="text-[10px]">sETH</span>
              </p>
            </div>
            <button onClick={() => disconnect()} className="text-[10px] md:text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold">Logout</button>
          </div>
        </nav>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-8 px-4">
        {!isConnected ? (
          /* Tampilan Connect (Sama seperti sebelumnya) */
          <div className="max-w-sm w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center">
             <h2 className="text-xl font-black mb-6">Hubungkan Wallet</h2>
             <button onClick={handleConnect} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl">Connect MetaMask</button>
          </div>
        ) : (
          <div className="max-w-md w-full space-y-4">
            {/* 🔹 ADMIN PANEL: Hanya muncul jika isOwner = true */}
            {isOwner && (
              <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Admin Panel</p>
                    <p className="text-sm font-bold text-amber-900 leading-tight">Saldo Kontrak: {totalDonasi ? formatEther(totalDonasi) : '0'} sETH</p>
                  </div>
                  <button 
                    onClick={handleWithdraw}
                    disabled={isPending || isConfirming || !totalDonasi || totalDonasi === BigInt(0)}                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md disabled:bg-amber-200 transition-all"
                  >
                    Tarik Dana
                  </button>
                </div>
              </div>
            )}

            {/* MAIN DASHBOARD CARD */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-gray-800">System Donasi</h1>
                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">Sepolia Testnet</p>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-blue-600 rounded-2xl text-white">
                  <p className="text-[9px] font-bold opacity-80 uppercase">Total Donasi</p>
                  <p className="text-lg font-black truncate">{totalDonasi ? formatEther(totalDonasi) : '0'} sETH</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Kontribusi Anda</p>
                  <p className="text-lg font-black text-green-600 truncate">{userKontribusi ? formatEther(userKontribusi) : '0'} sETH</p>
                </div>
              </div>

              {/* INPUT SECTION */}
              <div className="space-y-4">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.05"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-lg transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  onClick={handleDonate}
                  disabled={isPending || isConfirming}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  {isPending ? 'Membuka Wallet...' : isConfirming ? 'Konfirmasi...' : 'Kirim Donasi'}
                </button>
              </div>

              {/* SUCCESS FEEDBACK */}
              {isSuccess && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 text-[10px] rounded-xl text-center font-bold animate-bounce">
                  Berhasil! <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" className="underline">Lihat di Etherscan</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}