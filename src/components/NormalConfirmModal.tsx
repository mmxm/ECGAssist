import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface NormalConfirmModalProps {
  isOpen: boolean;
  onConfirmClearAndSetNormal: () => void;
  onCancel: () => void;
}

export const NormalConfirmModal: React.FC<NormalConfirmModalProps> = ({
  isOpen,
  onConfirmClearAndSetNormal,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <AlertCircle className="text-amber-500" size={24} />
            <h3 className="modal-title">Attention : Conflit d'interprétation</h3>
          </div>
          <button type="button" className="btn-icon-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-text">
            Vous avez coché <strong>« ECG strictement normal »</strong>, mais une ou plusieurs anomalies sont déjà sélectionnées dans le formulaire.
          </p>
          <p className="modal-subtext">
            Un électrocardiogramme ne peut être qualifié de strictement normal s'il comporte des anomalies de rythme, de conduction ou de repolarisation.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirmClearAndSetNormal}
          >
            <CheckCircle size={16} />
            <span>Décocher les anomalies et valider ECG normal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
