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
  
  // State untuk Modal Cara Donasi
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const { data: ownerAddress } = useReadContract({
    address: DONASI_ADDRESS,
    abi: DONASI_ABI,
    functionName: 'owner',
  })

  const isOwner = address?.toLowerCase() === (ownerAddress as string)?.toLowerCase()

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleConnect = () => {
    // Mencari connector WalletConnect agar muncul popup pilihan wallet (MetaMask, Binance, dll)
    const wcConnector = connectors.find((c) => c.id === 'walletConnect')
    const injectedConnector = connectors.find((c) => c.id === 'injected')

    // Jika di HP/Browser biasa, gunakan WalletConnect
    if (wcConnector) {
      connect({ connector: wcConnector })
    } 
    // Jika di browser internal wallet (MetaMask Browser), gunakan Injected
    else if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
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
      
      {/* 🔹 NAVBAR DENGAN MENU BANTUAN */}
      {isConnected && (
        <nav className="bg-white border-b shadow-sm px-4 md:px-6 py-3 flex justify-between items-center fixed top-0 w-full z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">Z</div>
            <span className="font-bold text-gray-800 text-sm hidden sm:inline">Zyfatech Labs</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Tombol Cara Donasi */}
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Cara Donasi"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <p className="text-[10px] font-mono font-bold text-blue-700">
                {walletBalance ? Number(formatEther(walletBalance.value)).toFixed(3) : '0'} sETH
              </p>
            </div>
            
            <button onClick={() => disconnect()} className="text-[10px] bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold uppercase">Log out</button>
          </div>
        </nav>
      )}

      {/* 🔹 MODAL CARA DONASI */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-black mb-6 text-blue-600">Cara Berdonasi</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">1</span>
                <p>Pastikan Network MetaMask Anda di **Sepolia Testnet**.</p>
              </li>
              <li className="flex gap-3">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">2</span>
                <p>Isi saldo Sepolia ETH melalui Faucet gratis.</p>
              </li>
              <li className="flex gap-3">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">3</span>
                <p>Masukkan jumlah donasi pada kolom input (min 0.0001 ETH).</p>
              </li>
              <li className="flex gap-3">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">4</span>
                <p>Klik tombol **Kirim Donasi** dan konfirmasi di pop-up MetaMask Anda.</p>
              </li>
            </ul>
            
            <button 
              onClick={() => setIsHelpOpen(false)}
              className="w-full mt-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-all"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT (Sama seperti sebelumnya) */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-8 px-4">
        {!isConnected ? (
          /* 🔹 LANDING PAGE SEBELUM LOGIN 🔹 */
          <div className="max-w-4xl w-full space-y-12 mt-10">
            
            {/* 1. Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                Web3 Philanthropy Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                Berbagi Kebaikan via <br/>
                <span className="text-blue-600 italic">Blockchain Sepolia</span>
              </h1>
              <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-lg">
                Zyfatech Donasi adalah platform filantropi berbasis Web3 yang transparan. 
                Setiap donasi Anda tercatat permanen di jaringan Sepolia Testnet.
              </p>
              
              <div className="flex justify-center pt-4">
                <button 
                  onClick={handleConnect} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-3xl shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connect Wallet Sekarang
                </button>
              </div>
            </div>

            {/* 2. Informasi Konten & Berita */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Card 1: Transparansi */}
              <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 space-y-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Transparansi Penuh</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Semua transaksi dapat dilacak melalui Etherscan. Tidak ada dana yang disembunyikan oleh sistem.
                </p>
              </div>

              {/* Card 2: Berita Terbaru */}
              <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 space-y-4 md:col-span-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Berita & Program</h3>
                  <span className="text-[10px] text-blue-500 font-bold">Terbaru 2026</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4 p-3 bg-gray-50 rounded-2xl items-center hover:bg-blue-50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-blue-200 rounded-xl overflow-hidden shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-blue-600 transition-colors">Program Donasi Bencana Alam </h4>
                      <p className="text-[10px] text-gray-400 mt-1">Membantu masyarakat yang terdampak bencana alam  via Web3.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-3 bg-gray-50 rounded-2xl items-center hover:bg-blue-50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-green-200 rounded-xl overflow-hidden shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-blue-600 transition-colors">Audit Smart Contract Berhasil</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Sistem Zyfatech telah lolos audit keamanan untuk jaringan Sepolia.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Footer Landing */}
            <div className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Powered by Zyfatech Labs & Ethereum Sepolia
            </div>

          </div>
        ) : (
          <div className="max-w-md w-full space-y-4">
            {isOwner && (
              <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-3xl flex justify-between items-center shadow-sm">
                <p className="text-[10px] font-black text-amber-600 uppercase">Owner Access</p>
                <button 
                  onClick={handleWithdraw}
                  disabled={isPending || isConfirming || !totalDonasi || totalDonasi === BigInt(0)}
                  className="bg-amber-600 text-white text-[10px] font-black px-4 py-2 rounded-xl disabled:bg-amber-200"
                >
                  Withdraw
                </button>
              </div>
            )}

            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">System Donasi</h1>
                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mt-2">Sepolia Testnet</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <p className="text-[9px] uppercase font-bold text-blue-100">Total</p>
                  <p className="text-xl font-black truncate">{totalDonasi ? formatEther(totalDonasi) : '0'} <span className="text-[10px] font-normal">sETH</span></p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <p className="text-[9px] uppercase font-bold text-gray-400">Kontribusi</p>
                  <p className="text-xl font-black truncate text-green-500">{userKontribusi ? formatEther(userKontribusi) : '0'} <span className="text-[10px] font-normal text-gray-300">sETH</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Jumlah ETH..."
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-lg transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  onClick={handleDonate}
                  disabled={isPending || isConfirming}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-gray-300"
                >
                  {isPending ? 'Buka Wallet...' : isConfirming ? 'Confirming...' : 'Kirim Donasi'}
                </button>

                {isSuccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-100 text-green-700 text-[10px] rounded-xl text-center font-bold">
                    Berhasil! <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" className="underline ml-1">Cek Transaksi</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}