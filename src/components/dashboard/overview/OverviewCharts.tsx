import type React from "react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts"
import { useTranslation } from "react-i18next"
import type { AgenceEvolutionDTO } from "@/lib/types/generated-api"
import { format, parseISO } from "date-fns"
import { TrendingUp } from "lucide-react"

interface OverviewChartsProps {
    data: AgenceEvolutionDTO | null
}

const OverviewCharts: React.FC<OverviewChartsProps> = ({ data }) => {
    const { t } = useTranslation()

    const chartData =
        data?.evolutionRevenus?.map((item) => ({
            name: format(parseISO(item.date!), "MMM"),
            Revenus: item.montant,
        })) || []

    const totalRevenue = chartData.reduce((sum, item) => sum + (item.Revenus || 0), 0)

    return (
        <div className="col-span-12 xl:col-span-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Évolution des Revenus</h3>
                        <p className="text-gray-600">Suivi mensuel de vos performances</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold">+12%</span>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString()} FCFA</p>
                    <p className="text-gray-500">Revenus totaux</p>
                </div>

                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${Number(value).toLocaleString()}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                }}
                                labelStyle={{ color: "#1e293b", fontWeight: "600" }}
                                formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, "Revenus"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="Revenus"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default OverviewCharts
