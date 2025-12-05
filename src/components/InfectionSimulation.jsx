import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const typeConfig = {
  virus: { color: '#ef4444', infectionRate: 0.8, infectionRadius: 20 },
  bacteria: { color: '#22c55e', infectionRate: 0.6, infectionRadius: 15 },
  protozoa: { color: '#f97316', infectionRate: 0.4, infectionRadius: 10 },
}

export function InfectionSimulation({ type }) {
  const canvasRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)
  const [populationSize, setPopulationSize] = useState(100)
  const [initialInfected, setInitialInfected] = useState(5)
  const [infectionSpeed, setInfectionSpeed] = useState(50)
  const [people, setPeople] = useState([])
  const [stats, setStats] = useState({ healthy: 0, infected: 0 })

  const config = typeConfig[type]

  const initializeSimulation = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const newPeople = []
    for (let i = 0; i < populationSize; i++) {
      newPeople.push({
        x: Math.random() * (canvas.width - 20) + 10,
        y: Math.random() * (canvas.height - 20) + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        infected: i < initialInfected,
      })
    }
    setPeople(newPeople)
    setIsRunning(false)
  }

  useEffect(() => {
    initializeSimulation()
  }, [populationSize, initialInfected])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId

    const animate = () => {
      if (!isRunning) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const updatedPeople = people.map((person) => {
        let newX = person.x + person.vx
        let newY = person.y + person.vy
        let newVx = person.vx
        let newVy = person.vy

        if (newX <= 5 || newX >= canvas.width - 5) {
          newVx = -newVx
          newX = Math.max(5, Math.min(canvas.width - 5, newX))
        }
        if (newY <= 5 || newY >= canvas.height - 5) {
          newVy = -newVy
          newY = Math.max(5, Math.min(canvas.height - 5, newY))
        }

        return { ...person, x: newX, y: newY, vx: newVx, vy: newVy }
      })

      const newInfections = []
      for (let i = 0; i < updatedPeople.length; i++) {
        if (!updatedPeople[i].infected) {
          for (let j = 0; j < updatedPeople.length; j++) {
            if (updatedPeople[j].infected) {
              const dx = updatedPeople[i].x - updatedPeople[j].x
              const dy = updatedPeople[i].y - updatedPeople[j].y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance < config.infectionRadius) {
                if (Math.random() < (config.infectionRate * infectionSpeed) / 100) {
                  newInfections.push(i)
                  break
                }
              }
            }
          }
        }
      }

      newInfections.forEach((index) => {
        updatedPeople[index].infected = true
      })

      updatedPeople.forEach((person) => {
        ctx.beginPath()
        ctx.arc(person.x, person.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = person.infected ? config.color : '#3b82f6'
        ctx.fill()
      })

      const infectedCount = updatedPeople.filter((p) => p.infected).length
      setStats({
        healthy: updatedPeople.length - infectedCount,
        infected: infectedCount,
      })

      setPeople(updatedPeople)
      animationId = requestAnimationFrame(animate)
    }

    if (isRunning) {
      animationId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isRunning, people, infectionSpeed, config])

  useEffect(() => {
    const infectedCount = people.filter((p) => p.infected).length
    setStats({
      healthy: people.length - infectedCount,
      infected: infectedCount,
    })
  }, [people])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full border-2 border-gray-200 rounded-lg bg-gray-50"
        />

        <div className="mt-4 flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span className="font-medium">{isRunning ? '일시정지' : '시작'}</span>
          </button>
          <button
            onClick={initializeSimulation}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-medium">초기화</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">통계</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">건강한 사람</span>
              <span className="text-2xl font-bold text-blue-600">{stats.healthy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">감염된 사람</span>
              <span className="text-2xl font-bold" style={{ color: config.color }}>
                {stats.infected}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">전체 인구</span>
              <span className="text-2xl font-bold text-gray-900">{people.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">시뮬레이션 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인구 수: {populationSize}
              </label>
              <input
                type="range"
                min="20"
                max="200"
                value={populationSize}
                onChange={(e) => setPopulationSize(Number(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                초기 감염자 수: {initialInfected}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={initialInfected}
                onChange={(e) => setInitialInfected(Number(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                감염 속도: {infectionSpeed}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={infectionSpeed}
                onChange={(e) => setInfectionSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}