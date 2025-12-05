import { useEffect, useState } from 'react'
import { DiseaseCard } from '../components/DiseaseCard'
import { supabase } from '../lib/supabase'

export function HomePage() {
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadDiseases()
  }, [])

  const loadDiseases = async () => {
    try {
       const { data, error } = await supabase
        .from('diseases')
        .select('*')
      
      console.log('Raw data:', data)
      console.log('Error:', error)

      if (error) throw error
      setDiseases(data || [])
    } catch (error) {
      console.error('Error loading diseases:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDiseases = filter === 'all' ? diseases : diseases.filter((d) => d.type === filter)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">감염병 정보 센터</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            주요 감염병에 대한 정보를 확인하고, 전파 방식을 시각화하여 이해할 수 있습니다.
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('virus')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'virus'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            바이러스
          </button>
          <button
            onClick={() => setFilter('bacteria')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'bacteria'
                ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            세균
          </button>
          <button
            onClick={() => setFilter('protozoa')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'protozoa'
                ? 'bg-orange-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            원생동물
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">로딩 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiseases.map((disease) => (
              <DiseaseCard
                key={disease.id}
                name={disease.name}
                type={disease.type}
                description={disease.description}
                riskLevel={disease.risk_level}
              />
            ))}
          </div>
        )}

        {!loading && filteredDiseases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">표시할 감염병이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}