import Link from "next/link"

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block text-xl text-blue-700">ASOMAMECO</span>
      </Link>
    </div>
  )
}

