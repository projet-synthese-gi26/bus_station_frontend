 import { CheckCircle } from 'lucide-react';


 interface SuccessModalProps {
     canOpenSuccessModal: (param: boolean) => void,
     message: string,
     makeAction?: () => void
 }

 export function SuccessModal ({canOpenSuccessModal, message, makeAction }: SuccessModalProps) {




     function onCloseModal()
     {
         canOpenSuccessModal(false);
         if (makeAction) {
             makeAction();
         }
     }

     return (
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
             <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center">
                     <CheckCircle className="w-12 h-12 text-primary mr-2 animate-success-check" />
                     <h3 className="text-2xl font-bold text-gray-900">Success</h3>
                 </div>
             </div>
             <p className="mb-6 mt-3 text-md">{message}</p>
             <div className="flex justify-center">
                 <button
                     onClick={() => onCloseModal()}
                     className="cursor-pointer px-4 py-1 bg-primary font-bold text-md text-white  rounded-md  transition-colors duration-300"
                 >
                     Continue
                 </button>
             </div>
         </div>
     );
 }






