import { AlertCircle } from 'lucide-react'

// 한글 타입을 UI 내부 타입으로 매핑
const typeNormalize = {
  '바이러스': 'virus',
  '세균': 'bacteria',
  '원생동물': 'protozoa',
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

const riskColors = [
  'text-gray-400',    // index 0 (사용 X)
  'text-blue-500',    // 1
  'text-yellow-500',  // 2
  'text-orange-500',  // 3
  'text-red-500',     // 4
  'text-red-700',     // 5
]

export function DiseaseCard({ name, type, description, riskLevel }) {
  const normalizedType = typeNormalize[type] || type // 혹시 이미 영문 타입이면 그대로 사용
  const colorClass = typeColors[normalizedType] || typeColors.virus
  const label = typeLabels[normalizedType] || '정보 없음'
  
  // riskLevel 안전 처리
  const safeRisk = Math.min(Math.max(riskLevel, 1), 5)
  const riskColor = riskColors[safeRisk]

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>

            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
              {label}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <AlertCircle className={`w-5 h-5 ${riskColor}`} />
            <span className={`text-sm font-bold ${riskColor}`}>{safeRisk}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">위험도</span>

          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-2 w-8 rounded-full transition-all ${
                  level <= safeRisk
                    ? riskColor.replace('text-', 'bg-')
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
