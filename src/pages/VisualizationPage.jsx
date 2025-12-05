import { useEffect, useState } from 'react'
import { InfectionSimulation } from '../components/InfectionSimulation'
import { supabase } from '../lib/supabase'
import { ArrowLeft } from 'lucide-react'

const typeLabels = {
  virus: '바이러스',
  bacteria: '세균',
  protozoa: '원생동물',
}

const typeDescriptions = {
  virus: '바이러스는 살아있는 세포 내에서만 증식할 수 있는 미생물입니다. 비말이나 공기를 통해 빠르게 전파될 수 있습니다.',
  bacteria: '세균은 단세포 생물로 환경에서 독립적으로 생존하고 증식할 수 있습니다. 주로 접촉이나 오염된 음식을 통해 전파됩니다.',
  protozoa: '원생동물은 단세포 진핵생물로 주로 물이나 곤충 매개체를 통해 전파됩니다. 감염 속도는 상대적으로 느립니다.',
}

export function VisualizationPage({ type, onNavigate }) {
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDiseases()
  }, [type])

  const loadDiseases = async () => {
    try {
      const { data, error } = await supabase
        .from('diseases')
        .select('*')
        .eq('type', type)
        .order('risk_level', { ascending: false })

      if (error) throw error
      setDiseases(data || [])
    } catch (error) {
      console.error('Error loading diseases:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">홈으로 돌아가기</span>
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {typeLabels[type]} 감염 시뮬레이션
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">{typeDescriptions[type]}</p>
        </div>

        <InfectionSimulation type={type} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{typeLabels[type]} 질병 목록</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diseases.map((disease) => (
                <div
                  key={disease.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{disease.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{disease.description}</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">전파 방식:</span>
                      <span className="text-gray-600 ml-2">{disease.transmission_method}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">위험도:</span>
                      <span className="text-gray-600 ml-2">{disease.risk_level}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}