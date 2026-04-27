import {Bell} from "lucide-react";


export interface NotificationSectionProps {
    notifications: any[];
    unreadCount: number;
    isNotificationOpen: boolean;
    setIsNotificationOpen: (isOpen: boolean) => void;
}

export default function NotificationSection({notifications, unreadCount, isNotificationOpen, setIsNotificationOpen}: NotificationSectionProps)
{
    return (
        <div className="relative">
            <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group relative"
            >
                <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors"/>
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                        {unreadCount}
                                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500">{unreadCount} new notifications</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${notification.unread ? "bg-blue-50" : ""}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                                    </div>
                                    {notification.unread &&
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}