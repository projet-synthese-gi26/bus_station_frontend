export default function Loader()
{
    return (
        <div className="min-h-screen flex-1 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}