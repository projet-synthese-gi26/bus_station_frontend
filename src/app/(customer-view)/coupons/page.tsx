"use client"

import {JSX, useState} from "react"
import { Calendar, Timer, MapPin, MapPinIcon as MapPinHouse, Filter, Ticket, Download, Grid3X3, List } from "lucide-react"

export default function Coupons (): JSX.Element
{
    const [activeTab, setActiveTab] = useState<string>("all")
    const [downloadingCoupon, setDownloadingCoupon] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')


    const coupons = [
        {
            idCoupon: "C-1",
            dateDebut: "2025-01-08T14:23:39.491Z",
            dateFin: "2025-01-15T14:23:39.491Z",
            statusCoupon: "VALIDE",
            valeur: 1000,
            idHistorique: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            nomAgence: "EXPRESS-VOYAGE",
            lieuArrive: "Douala",
        },
        {
            idCoupon: "C-2",
            dateDebut: "2025-02-13T14:23:39.491Z",
            dateFin: "2025-02-20T14:23:39.491Z",
            statusCoupon: "EXPIRE",
            valeur: 500,
            idHistorique: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
            nomAgence: "BUCCA-VOYAGE",
            lieuArrive: "Edea",
        },
        {
            idCoupon: "C-3",
            dateDebut: "2025-01-20T14:23:39.491Z",
            dateFin: "2025-01-27T14:23:39.491Z",
            statusCoupon: "VALIDE",
            valeur: 750,
            idHistorique: "5fa85f64-5717-4562-b3fc-2c963f66afa8",
            nomAgence: "ROYAL-TRANSPORT",
            lieuArrive: "Bafoussam",
        },
    ]

    // Charger html2pdf dynamiquement
    const loadHtml2Pdf = async () => {
        if (typeof window !== 'undefined' && !(window as any).html2pdf) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script')
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
                script.onload = () => resolve((window as any).html2pdf)
                script.onerror = reject
                document.head.appendChild(script)
            })
        }
        return (window as any).html2pdf
    }

    // Générer un QR code fake mais réaliste
    const generateQRCodeUrl = (couponId: string) => {
        const qrData = `COUPON:${couponId}:${new Date().getTime()}`
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=1d4ed8`
    }

    // Télécharger le coupon en PDF
    const downloadCoupon = async (coupon: any) => {
        setDownloadingCoupon(coupon.idCoupon)

        try {
            const html2pdf = await loadHtml2Pdf()

            // Créer un élément temporaire avec le contenu du coupon
            const element = document.createElement('div')
            element.innerHTML = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border: 3px solid #2563eb; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 25px; text-align: center; position: relative;">
                        <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">🎫 COUPON DE REMBOURSEMENT</div>
                        <div style="font-size: 16px; opacity: 0.9;">Annulation de Voyage • Valide pour utilisation</div>
                    </div>
                    
                    <div style="padding: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px dashed #e5e7eb;">
                            <div>
                                <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">COUPON ID</div>
                                <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${coupon.idCoupon}</div>
                            </div>
                            <div style="padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; background: #dcfce7; color: #166534;">${coupon.statusCoupon}</div>
                        </div>
                        
                        <div style="text-align: center; margin: 25px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 2px solid #22c55e;">
                            <div style="font-size: 18px; color: #166534; margin-bottom: 5px;">Montant du Remboursement</div>
                            <div style="font-size: 36px; font-weight: bold; color: #22c55e;">${coupon.valeur.toLocaleString()} FCFA</div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Agence</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${coupon.nomAgence}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Destination</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${coupon.lieuArrive}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Date Début</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${new Date(coupon.dateDebut).toLocaleDateString("fr-FR")}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Date Fin</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${new Date(coupon.dateFin).toLocaleDateString("fr-FR")}</div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 2px dashed #e5e7eb;">
                            <div style="border: 3px solid #2563eb; border-radius: 8px; display: inline-block; padding: 10px; background: white;">
                                <img src="${generateQRCodeUrl(coupon.idCoupon)}" alt="QR Code" width="120" height="120">
                            </div>
                            <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">Scannez ce code pour vérification</div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; font-style: italic;">
                            Ce coupon est valide uniquement pour les remboursements.<br>
                            Présentez ce document lors de votre demande de remboursement.<br>
                            ID Historique: ${coupon.idHistorique}
                        </div>
                        
                        <div style="background: #fef3c7; color: #92400e; padding: 10px; text-align: center; font-weight: bold; margin: 20px -30px -30px -30px;">
                            ⚠️ Valide jusqu'au ${new Date(coupon.dateFin).toLocaleDateString("fr-FR", { dateStyle: "full" })}
                        </div>
                    </div>
                </div>
            `

            // Options pour la génération PDF
            const options = {
                margin: 0.5,
                filename: `coupon-${coupon.idCoupon}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            }

            // Générer et télécharger le PDF
            await html2pdf().set(options).from(element).save()

        } catch (error) {
            console.error('Erreur lors du téléchargement:', error)
            alert('Erreur lors du téléchargement du PDF. Veuillez réessayer.')
        } finally {
            setDownloadingCoupon(null)
        }
    }




    const getStatusColor = (status: string) => {
        return status === "VALIDE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }

    const filteredCoupons = coupons.filter((coupon) => activeTab === "all" || coupon.statusCoupon === activeTab)

    const applyFilterStyle = () => {
        return "cursor-pointer px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-gray-100 rounded-xl shadow-sm mb-8 p-6 border border-gray-200">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Coupons</h1>
                            <p className="text-gray-600">Gérez vos coupons de remboursement et suivez leur validité</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                            <Ticket className="h-6 w-6" />
                            <span className="text-lg font-semibold">{filteredCoupons.length} Coupons</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`${applyFilterStyle()} ${
                                activeTab === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200"
                            }`}
                        >
                            Tous les Coupons
                        </button>
                        <button
                            onClick={() => setActiveTab("VALIDE")}
                            className={`${applyFilterStyle()} ${
                                activeTab === "VALIDE"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200"
                            }`}
                        >
                            Valides
                        </button>
                        <button
                            onClick={() => setActiveTab("EXPIRE")}
                            className={`${applyFilterStyle()} ${
                                activeTab === "EXPIRE"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200"
                            }`}
                        >
                            Expirés
                        </button>
                        <button className="cursor-pointer px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 shadow-sm flex items-center gap-2 border-2 border-gray-200">
                            <Filter className="h-4 w-4" />
                            Plus de Filtres
                        </button>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white rounded-lg p-1 border-2 border-gray-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                viewMode === 'grid'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Vue en grille"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                viewMode === 'list'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Vue en liste"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Coupons Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCoupons.map((coupon) => (
                            <div
                                key={coupon.idCoupon}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group border border-gray-200"
                            >
                                {/* Coupon Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-4 right-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(coupon.statusCoupon)} text-gray-800`}
                                        >
                                            {coupon.statusCoupon}
                                        </span>
                                    </div>
                                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                                    <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-white opacity-10 rounded-full"></div>
                                    <div className="text-center relative z-10">
                                        <Ticket className="h-8 w-8 mx-auto mb-2" />
                                        <h2 className="text-xl font-bold mb-1">Coupon de Remboursement</h2>
                                        <p className="text-blue-100 text-sm">Annulation de Voyage</p>
                                    </div>
                                </div>

                                {/* Coupon Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500">Coupon ID</p>
                                            <p className="font-bold text-blue-800 text-lg">{coupon.idCoupon}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">{coupon.valeur.toLocaleString()}</p>
                                            <p className="text-sm text-green-600 font-medium">FCFA</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Agence</p>
                                                <p className="font-semibold text-gray-900">{coupon.nomAgence}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                                                <MapPinHouse className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Destination</p>
                                                <p className="font-semibold text-gray-900">{coupon.lieuArrive}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Valide du</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(coupon.dateDebut).toLocaleDateString("fr-FR", {
                                                        dateStyle: "medium",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                                                <Timer className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Valide jusqu&#39;au</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(coupon.dateFin).toLocaleDateString("fr-FR", {
                                                        dateStyle: "medium",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code Preview */}
                                    <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
                                        <img
                                            src={generateQRCodeUrl(coupon.idCoupon)}
                                            alt="QR Code"
                                            className="w-16 h-16 mx-auto mb-2 border border-gray-300 rounded"
                                        />
                                        <p className="text-xs text-gray-500">Code de vérification</p>
                                    </div>

                                    {/* Action Buttons */}
                                    {coupon.statusCoupon === "VALIDE" && (
                                        <div className="flex gap-2 justify-center items-center">
                                            <button
                                                onClick={() => downloadCoupon(coupon)}
                                                disabled={downloadingCoupon === coupon.idCoupon}
                                                className="cursor-pointer px-6 bg-primary text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {downloadingCoupon === coupon.idCoupon ? (
                                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-white rounded-full"></div>
                                                ) : (
                                                    <Download className="h-6 w-6" />
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {coupon.statusCoupon === "EXPIRE" && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                                            <p className="text-red-600 font-medium text-sm">Coupon expiré</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Vue en Liste */
                    <div className="space-y-4">
                        {filteredCoupons.map((coupon) => (
                            <div
                                key={coupon.idCoupon}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        {/* Informations principales */}
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                                    <Ticket className="h-8 w-8 text-white" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{coupon.idCoupon}</h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(coupon.statusCoupon)} text-gray-800`}
                                                    >
                                                        {coupon.statusCoupon}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Agence</p>
                                                        <p className="font-medium text-gray-900">{coupon.nomAgence}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Destination</p>
                                                        <p className="font-medium text-gray-900">{coupon.lieuArrive}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Début</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(coupon.dateDebut).toLocaleDateString("fr-FR")}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Fin</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(coupon.dateFin).toLocaleDateString("fr-FR")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Montant et actions */}
                                        <div className="flex items-center gap-6 flex-shrink-0">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">{coupon.valeur.toLocaleString()}</p>
                                                <p className="text-sm text-green-600 font-medium">FCFA</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={generateQRCodeUrl(coupon.idCoupon)}
                                                    alt="QR Code"
                                                    className="w-12 h-12 border border-gray-300 rounded"
                                                />

                                                {coupon.statusCoupon === "VALIDE" && (
                                                    <div className="ml-3 flex gap-4 justify-center items-center">
                                                        {/* <button
                                                            onClick={() => printCoupon(coupon)}
                                                            disabled={printingCoupon === coupon.idCoupon}
                                                            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {printingCoupon === coupon.idCoupon ? (
                                                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                                            ) : (
                                                                <Printer className="h-4 w-4" />
                                                            )}
                                                        </button>  */}
                                                        <button
                                                            onClick={() => downloadCoupon(coupon)}
                                                            disabled={downloadingCoupon === coupon.idCoupon}
                                                            className="cursor-pointer bg-primary  text-gray-700 rounded-lg px-4 py-1.5 font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {downloadingCoupon === coupon.idCoupon ? (
                                                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-white rounded-full"></div>
                                                            ) : (
                                                                <Download className="h-5 w-5 text-white" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredCoupons.length === 0 && (
                    <div className="text-center py-12">
                        <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucun coupon trouvé</h3>
                        <p className="text-gray-400">Essayez d&#39;ajuster vos filtres pour voir plus de résultats.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

