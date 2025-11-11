import Link from 'next/link'

interface HeaderProps {
  activePage?: string;
}

export default function Header({ activePage }: HeaderProps) {
  return (
    <header className="w-full bg-white shadow-md py-4 px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-primary-600">MediQueue</h1>
        </Link>
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link 
                href="/about" 
                className={`${activePage === 'about' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/hospitals" 
                className={`${activePage === 'hospitals' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
              >
                Hospitals
              </Link>
            </li>
            <li>
              <Link 
                href="/queue-status" 
                className={`${activePage === 'queue-status' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
              >
                Queue Status
              </Link>
            </li>
            <li>
              <Link 
                href="/login" 
                className={`${activePage === 'login' ? 'text-primary-600' : 'text-primary-600 hover:text-primary-700'}`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link 
                href="/register" 
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
} 