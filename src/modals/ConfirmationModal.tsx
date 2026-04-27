import { AlertCircle } from 'lucide-react';

interface ConfirmActionModalProps{
    onClose: ()=> void,
    onConfirm: () => void,
    title: string,
    message: string
}


export function ConfirmationModal ({ onClose, onConfirm, title, message }: ConfirmActionModalProps) {


    return (
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mr-2" />
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">{title}</h3>
                </div>
            </div>
            <p className="text-gray-700  font-semibold">{message}</p>
            <div className="mt-8 flex justify-end space-x-5">
                <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className="cursor-pointer px-4 py-2 bg-primary text-white rounded-lg text-md hover:text-xl font-bold transition-all duration-300"
                >
                    Confirm
                </button>
                <button
                    onClick={onClose}
                    className="cursor-pointer px-4 py-2 bg-red-400 text-white  rounded-lg font-bold hover:bg-red-500 transition-all duration-300"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
