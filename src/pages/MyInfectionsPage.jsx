import { useEffect, useState, useCallback } from 'react'
import { Plus, Calendar, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'
import { AddInfectionModal } from '../components/AddInfectionModal'
import { CheckInModal } from '../components/CheckInModal'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function MyInfectionsPage() {
  const { user } = useAuth()
  const [infections, setInfections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [checkInModal, setCheckInModal] = useState({
    isOpen: false,
    infectionId: '',
    diseaseName: '',
  })

  const loadInfections = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_infections')
        .select(`
            id,
            registered_at,
            is_recovered,
            last_check_in,
            diseases (
              name,
              type,
              description,
              transmission_method,
              treatment,
              home_remedy,
              risk_level
            )
          `)          
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false })

      if (error) throw error
      setInfections(data || [])
    } catch (error) {
      console.error('Error loading infections:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadInfections()
    }
  }, [user, loadInfections])

  const handleDelete = async (infectionId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase.from('user_infections').delete().eq('id', infectionId)
      if (error) throw error
      loadInfections()
    } catch (error) {
      console.error('Error deleting infection:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const getDailyTreatment = (infection, dayNumber) => {
    const treatments = [
      `${infection.diseases.home_remedy}를 실천하세요.`,
      `충분한 휴식을 취하고 수분을 섭취하세요.`,
      `처방된 약을 정확한 시간에 복용하세요.`,
      `${infection.diseases.treatment} 관련 의사의 지시를 따르세요.`,
      `증상이 악화되면 즉시 병원을 방문하세요.`,
    ]
    return treatments[dayNumber % treatments.length]
  }

  const getDaysSince = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - date.getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  const typeColors = {
    virus: 'bg-red-50 border-red-200 text-red-700',
    bacteria: 'bg-green-50 border-green-200 text-green-700',
    protozoa: 'bg-orange-50 border-orange-200 text-orange-700',
  }

  const typeLabels = {
    virus: '바이러스',
    bacteria: '세균',
    protozoa: '원생동물',
  }

  const activeInfections = infections.filter((i) => !i.is_recovered)
  const recoveredInfections = infections.filter((i) => i.is_recovered)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">나의 감염</h1>
            <p className="text-gray-600">현재 감염 상태를 관리하고 치료 방법을 확인하세요</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">감염 등록</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeInfections.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2 text-orange-500" />
                  치료 중인 감염
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeInfections.map((infection) => {
                    const daysSinceCheckIn = getDaysSince(infection.last_check_in)
                    const daysSinceRegistration = getDaysSince(infection.registered_at)

                    return (
                      <div
                        key={infection.id}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {infection.diseases.name}
                            </h3>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                                typeColors[infection.diseases.type]
                              }`}
                            >
                              {typeLabels[infection.diseases.type]}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDelete(infection.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">오늘의 치료법</h4>
                            <p className="text-gray-700 text-sm">
                              {getDailyTreatment(infection, daysSinceRegistration)}
                            </p>
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">민간요법</h4>
                            <p className="text-gray-700 text-sm">{infection.diseases.home_remedy}</p>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">의학적 치료</h4>
                            <p className="text-gray-700 text-sm">{infection.diseases.treatment}</p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>마지막 체크인: {daysSinceCheckIn}일 전</span>
                            </div>
                            <button
                              onClick={() =>
                                setCheckInModal({
                                  isOpen: true,
                                  infectionId: infection.id,
                                  diseaseName: infection.diseases.name,
                                })
                              }
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow"
                            >
                              체크인
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {recoveredInfections.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  완치된 감염
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recoveredInfections.map((infection) => (
                    <div key={infection.id} className="bg-white rounded-xl shadow-md p-6 opacity-75">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {infection.diseases.name}
                          </h3>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 border border-green-300 text-green-700">
                            완치
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(infection.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">
                        등록일: {new Date(infection.registered_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {infections.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">등록된 감염이 없습니다</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>첫 감염 등록하기</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AddInfectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadInfections}
      />

      <CheckInModal
        isOpen={checkInModal.isOpen}
        onClose={() => setCheckInModal({ ...checkInModal, isOpen: false })}
        infectionId={checkInModal.infectionId}
        diseaseName={checkInModal.diseaseName}
        onCheckInComplete={loadInfections}
      />
    </div>
  )
}