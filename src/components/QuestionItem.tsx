import React from 'react';
import { HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';
import type { QuestionNode } from '../types/ecg';

interface QuestionItemProps {
  node: QuestionNode;
  depth?: number;
  selectedIds: Record<string, boolean>;
  radioSelections: Record<string, string>;
  onToggleCheckbox: (node: QuestionNode, checked: boolean) => void;
  onSelectRadio: (node: QuestionNode, groupName: string) => void;
  onOpenHelp: (node: QuestionNode) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  node,
  depth = 0,
  selectedIds,
  radioSelections,
  onToggleCheckbox,
  onSelectRadio,
  onOpenHelp,
}) => {
  const isRadio = node.type === 'radio';
  const groupName = node.groupName || 'default_group';

  // Vérifier si le nœud est actuellement actif/sélectionné
  const isChecked = isRadio
    ? radioSelections[groupName] === node.id
    : !!selectedIds[node.id];

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = isChecked;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleCheckbox(node, e.target.checked);
  };

  const handleRadioChange = () => {
    if (node.groupName) {
      onSelectRadio(node, node.groupName);
    }
  };

  const inputId = `input_${node.id}`;

  return (
    <div className={`question-node-container depth-${depth} ${isChecked ? 'node-active' : ''}`}>
      <div className="question-node-row">
        {/* Indicateur de sous-branche si enfants */}
        <div className="node-indicator">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={16} className="text-sky-600 transition-transform" />
            ) : (
              <ChevronRight size={16} className="text-slate-400" />
            )
          ) : (
            <span className="bullet-dot" />
          )}
        </div>

        {/* Input (Checkbox ou Radio) */}
        <div className="node-control">
          {isRadio ? (
            <input
              id={inputId}
              type="radio"
              name={groupName}
              className="custom-radio"
              checked={isChecked}
              onChange={handleRadioChange}
            />
          ) : (
            <input
              id={inputId}
              type="checkbox"
              className="custom-checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          )}
        </div>

        {/* Libellé de l'anomalie */}
        <label htmlFor={inputId} className="node-label">
          {node.label}
        </label>

        {/* Bouton d'aide sémiologique si description ou schéma présent */}
        {(node.description || node.svgDiagram) && (
          <button
            type="button"
            className="btn-help-icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenHelp(node);
            }}
            title="Consulter la fiche clinique et les critères ECG"
          >
            <HelpCircle size={17} />
          </button>
        )}
      </div>

      {/* Rendu récursif des sous-questions si la branche est active */}
      {hasChildren && isExpanded && (
        <div className="question-children-wrapper animate-fadeIn">
          {node.children!.map((child) => (
            <QuestionItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedIds={selectedIds}
              radioSelections={radioSelections}
              onToggleCheckbox={onToggleCheckbox}
              onSelectRadio={onSelectRadio}
              onOpenHelp={onOpenHelp}
            />
          ))}
        </div>
      )}
    </div>
  );
};
