import React from 'react';
import type { QuestionNode } from '../types/ecg';
import { QuestionItem } from './QuestionItem';
import { FileText, Stethoscope } from 'lucide-react';

interface QuestionTreeProps {
  tree: QuestionNode[];
  selectedIds: Record<string, boolean>;
  radioSelections: Record<string, string>;
  patientNote: string;
  onToggleCheckbox: (node: QuestionNode, checked: boolean) => void;
  onSelectRadio: (node: QuestionNode, groupName: string) => void;
  onOpenHelp: (node: QuestionNode) => void;
  onPatientNoteChange: (note: string) => void;
}

export const QuestionTree: React.FC<QuestionTreeProps> = ({
  tree,
  selectedIds,
  radioSelections,
  patientNote,
  onToggleCheckbox,
  onSelectRadio,
  onOpenHelp,
  onPatientNoteChange,
}) => {
  return (
    <section className="card tree-card">
      <div className="card-header-clean">
        <div className="card-title-group">
          <Stethoscope className="text-sky-600" size={18} />
          <h2 className="card-title">Interprétation Sémiologique Méthodique</h2>
        </div>
        <span className="info-tag">Cochez les anomalies constatées</span>
      </div>

      <div className="tree-content-container">
        {tree.map((node) => {
          if (node.type === 'section') {
            return (
              <div key={node.id} className="tree-section-block">
                <h3 className="tree-section-title">{node.label}</h3>
                <div className="tree-section-children">
                  {node.children?.map((child) => (
                    <QuestionItem
                      key={child.id}
                      node={child}
                      depth={0}
                      selectedIds={selectedIds}
                      radioSelections={radioSelections}
                      onToggleCheckbox={onToggleCheckbox}
                      onSelectRadio={onSelectRadio}
                      onOpenHelp={onOpenHelp}
                    />
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={node.id} className="tree-root-item">
              <QuestionItem
                node={node}
                depth={0}
                selectedIds={selectedIds}
                radioSelections={radioSelections}
                onToggleCheckbox={onToggleCheckbox}
                onSelectRadio={onSelectRadio}
                onOpenHelp={onOpenHelp}
              />
            </div>
          );
        })}
      </div>

      {/* Zone de synthèse et commentaire libre pour le rapport */}
      <div className="patient-note-section">
        <div className="note-title-row">
          <FileText size={16} className="text-sky-600" />
          <label htmlFor="patient_note" className="note-label">
            Commentaire clinique & Synthèse (Sera imprimé dans la conclusion du PDF)
          </label>
        </div>
        <textarea
          id="patient_note"
          rows={3}
          className="note-textarea"
          placeholder="Ex: Douleur thoracique d'allure coronarienne à H+2, tracé compatible avec un syndrome coronarien aigu antérieur. Indication coronarographie urgente..."
          value={patientNote}
          onChange={(e) => onPatientNoteChange(e.target.value)}
        />
      </div>
    </section>
  );
};
