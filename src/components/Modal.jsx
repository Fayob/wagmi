import React from "react";

const Modal = ({ isOpen, onClose, connectors, connect }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="app-title">Select Wallet</h2>
        <div>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              className="connect-button"
              onClick={() => {
                connect({ connector });
                onClose();
              }}
            >
              {connector.name}
            </button>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
