import { DonationDashboard } from './components/DonationDashboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Anda bisa menambahkan tombol Connect Wallet di sini nanti */}
        <DonationDashboard />
      </div>
    </main>
  )
}