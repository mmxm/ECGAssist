import React from 'react';
import { Activity, RotateCcw, FileDown } from 'lucide-react';

interface HeaderProps {
  examDate: string;
  onReset: () => void;
  onExportPDF: () => void;
  isExporting: boolean;
  hasSelectedItems: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  examDate,
  onReset,
  onExportPDF,
  isExporting,
  hasSelectedItems,
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-icon">
            <Activity className="icon-pulse" size={24} />
          </div>
          <div>
            <h1 className="brand-title">ECGAssist</h1>
            <p className="brand-subtitle">Aide méthodique à l'interprétation & Rapport clinique</p>
          </div>
        </div>

        <div className="header-meta">
          <span className="exam-badge" title="Horodatage de l'examen">{examDate}</span>
          {hasSelectedItems && (
            <span className="info-tag" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
              Saisie active
            </span>
          )}

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onReset}
              title="Réinitialiser l'interprétation courante"
            >
              <RotateCcw size={16} />
              <span>Nouveau</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onExportPDF}
              disabled={isExporting}
              title="Télécharger le rapport d'interprétation PDF"
            >
              <FileDown size={16} />
              <span>{isExporting ? 'Génération...' : 'Exporter PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
