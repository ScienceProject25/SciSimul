import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function AddInfectionModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth()
  const [diseases, setDiseases] = useState([])
  const [selectedType, setSelectedType] = useState('virus')
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadDiseases()
      setSelectedType('virus')
      setSelectedDiseaseId('')
    }
  }, [isOpen])

  const loadDiseases = async () => {
    try {
      const { data, error } = await supabase.from('diseases').select('*').order('name')
      if (error) throw error
      setDiseases(data || [])
    } catch (error) {
      console.error('Error loading diseases:', error)
    }
  }

  const filteredDiseases = diseases.filter((d) => d.type === selectedType)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user || !selectedDiseaseId) {
      alert('병명을 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      const { data: existing } = await supabase
        .from('user_infections')
        .select('*')
        .eq('user_id', user.id)
        .eq('disease_id', selectedDiseaseId)
        .eq('is_recovered', false)
        .maybeSingle()

      if (existing) {
        alert('이미 등록된 감염입니다.')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('user_infections').insert({
        user_id: user.id,
        disease_id: selectedDiseaseId,
      })

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding infection:', error)
      alert('감염 등록 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSelectedDiseaseId('')
  }, [selectedType])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">감염병 등록</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">감염 종류 선택</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType('virus')}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedType === 'virus'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                바이러스
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('bacteria')}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedType === 'bacteria'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                세균
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('protozoa')}
                className={`py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedType === 'protozoa'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                원생동물
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="disease" className="block text-sm font-medium text-gray-700 mb-2">
              병명 선택
            </label>
            <select
              id="disease"
              value={selectedDiseaseId}
              onChange={(e) => setSelectedDiseaseId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">병명을 선택하세요</option>
              {filteredDiseases.map((disease) => (
                <option key={disease.id} value={disease.id}>
                  {disease.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDiseaseId}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}