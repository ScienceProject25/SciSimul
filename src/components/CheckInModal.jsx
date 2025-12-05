import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function CheckInModal({ isOpen, onClose, infectionId, diseaseName, onCheckInComplete }) {
  const [recovered, setRecovered] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (recovered === null) {
      alert('회복 여부를 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_infections')
        .update({
          is_recovered: recovered,
          last_check_in: new Date().toISOString(),
        })
        .eq('id', infectionId)

      if (error) throw error

      onCheckInComplete()
      onClose()
      setRecovered(null)
    } catch (error) {
      console.error('Error updating check-in:', error)
      alert('체크인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setRecovered(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">건강 체크인</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700">
              <span className="font-semibold">{diseaseName}</span> 증상이 나아지셨나요?
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setRecovered(true)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                recovered === true
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">네, 완전히 나았습니다</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRecovered(false)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                recovered === false
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium text-gray-900">아니요, 아직 치료 중입니다</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || recovered === null}
            className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? '저장 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  )
}