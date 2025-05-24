import React from "react";

function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
				{children}
			</div>
		</div>
	);
}

export default Modal;
