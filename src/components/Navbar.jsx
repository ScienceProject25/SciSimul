import { useAuth } from '../contexts/AuthContext'
import { Activity, LogOut } from 'lucide-react'

export function Navbar({ currentPage, onNavigate }) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      onNavigate('home')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Activity className="w-7 h-7" />
              <span className="font-bold text-xl">감염병 추적기</span>
            </button>

            {user && (
              <div className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => onNavigate('virus')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 'virus'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  바이러스
                </button>
                <button
                  onClick={() => onNavigate('bacteria')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 'bacteria'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  세균
                </button>
                <button
                  onClick={() => onNavigate('protozoa')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 'protozoa'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  원생동물
                </button>
                <button
                  onClick={() => onNavigate('my-infections')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 'my-infections'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  나의 감염
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">로그아웃</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}