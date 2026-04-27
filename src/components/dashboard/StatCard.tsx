import type React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  currency?: string
  change: string
  changeType: "increase" | "decrease"
  icon: React.ElementType
  gradient: string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, currency, change, changeType, icon: Icon, gradient }) => {
  return (
      <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Background Gradient */}
        <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
        ></div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    changeType === "increase" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
            >
              {changeType === "increase" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {currency && <span className="text-sm font-medium text-gray-500">{currency}</span>}
            </div>
          </div>
        </div>
      </div>
  )
}

export default StatCard
