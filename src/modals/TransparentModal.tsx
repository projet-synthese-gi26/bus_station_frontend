import { createPortal } from "react-dom";
import React from "react";

interface TransparentModalProps {
    isOpen: boolean;
    children: React.ReactNode;
}

export default function TransparentModal({ isOpen, children }: TransparentModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="dialog fixed inset-0 z-50 flex items-center justify-center">
            {children}
        </div>,
        document.body
    );
}
