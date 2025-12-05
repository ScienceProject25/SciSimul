import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MyInfectionsPage } from './pages/MyInfectionsPage'
import { VisualizationPage } from './pages/VisualizationPage'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    if (!loading && !user && currentPage !== 'home' && currentPage !== 'login') {
      setCurrentPage('login')
    }
  }, [user, loading, currentPage])

  const handleNavigate = (page) => {
    if (!user && page !== 'home' && page !== 'login') {
      setCurrentPage('login')
      return
    }
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'my-infections' && user && <MyInfectionsPage />}
      {currentPage === 'virus' && user && <VisualizationPage type="virus" onNavigate={handleNavigate} />}
      {currentPage === 'bacteria' && user && <VisualizationPage type="bacteria" onNavigate={handleNavigate} />}
      {currentPage === 'protozoa' && user && <VisualizationPage type="protozoa" onNavigate={handleNavigate} />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App