import React from 'react';
import { X, BookOpen, ExternalLink } from 'lucide-react';
import type { QuestionNode } from '../types/ecg';

interface HelpDrawerProps {
  node: QuestionNode | null;
  onClose: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="help-drawer-backdrop" onClick={onClose}>
      <aside className="help-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="help-drawer-header">
          <div className="drawer-title-group">
            <BookOpen size={20} className="text-sky-600" />
            <h3 className="drawer-title">{node.label}</h3>
          </div>
          <button
            type="button"
            className="btn-icon-close"
            onClick={onClose}
            title="Fermer l'aide"
          >
            <X size={20} />
          </button>
        </div>

        <div className="help-drawer-body">
          {/* Illustration didactique du référentiel */}
          {node.imageUrl && (
            <div className="help-clinical-image-wrapper">
              <div className="help-clinical-image-container">
                <img
                  src={node.imageUrl}
                  alt={node.imageCaption || node.label}
                  className="help-clinical-image"
                  loading="lazy"
                />
              </div>
              {node.imageCaption && (
                <span className="diagram-caption">{node.imageCaption}</span>
              )}
            </div>
          )}

          {/* Schéma vectoriel SVG si présent (fallback ou complément) */}
          {!node.imageUrl && node.svgDiagram && (
            <div className="help-diagram-wrapper">
              <div
                className="help-svg-container"
                dangerouslySetInnerHTML={{ __html: node.svgDiagram }}
              />
              <span className="diagram-caption">Repère sémiologique vectoriel</span>
            </div>
          )}

          {/* Description clinique détaillée */}
          {node.description && (
            <div className="help-description-block">
              <h4 className="help-section-title">Critères Sémiologiques & Diagnostic</h4>
              <div className="help-text">
                {node.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Référence médicale */}
          {node.referenceUrl && (
            <div className="help-reference-badge">
              <ExternalLink size={14} />
              <span>Référence : {node.referenceUrl}</span>
            </div>
          )}
        </div>

        <div className="help-drawer-footer">
          <button type="button" className="btn btn-secondary w-full" onClick={onClose}>
            Compris, fermer l'aide
          </button>
        </div>
      </aside>
    </div>
  );
};
