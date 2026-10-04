import { useState, useEffect, useCallback } from 'react';
import type { ECGState, MeasurementsState, QuestionNode } from '../types/ecg';
import { getAllDescendantIds, hasAnyAnomalySelected } from '../utils/treeUtils';
import { ECG_TREE } from '../data/ecgQuestions';

const STORAGE_KEY = 'ecg_assist_current_session';

function getFormattedCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const DEFAULT_STATE: ECGState = {
  selectedIds: {},
  radioSelections: {},
  measurements: {},
  ecgImage: null,
  patientNote: '',
  examDate: getFormattedCurrentDate(),
};

export function useECGForm() {
  const [state, setState] = useState<ECGState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignorer l'erreur et utiliser le state par défaut
    }
    return DEFAULT_STATE;
  });

  const [activeHelpNode, setActiveHelpNode] = useState<QuestionNode | null>(null);
  const [showNormalConflictModal, setShowNormalConflictModal] = useState(false);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Impossible de sauvegarder la session dans le localStorage', e);
    }
  }, [state]);

  // Coche ou décoche une case
  const toggleCheckbox = useCallback((node: QuestionNode, checked: boolean) => {
    // Si l'utilisateur clique sur "ECG strictement normal" ('14258')
    if (node.id === '14258') {
      if (checked) {
        // Vérifier s'il y a déjà des anomalies cochées
        const hasAnomalies = hasAnyAnomalySelected(state.selectedIds, state.radioSelections);
        if (hasAnomalies) {
          setShowNormalConflictModal(true);
          return;
        }
      }
    }

    setState((prev) => {
      const nextSelected = { ...prev.selectedIds };
      const nextRadios = { ...prev.radioSelections };

      if (checked) {
        nextSelected[node.id] = true;
        // Si on coche une anomalie quelconque et que "ECG normal" était coché, on décoche "ECG normal"
        if (node.id !== '14258' && node.id !== '14149' && nextSelected['14258']) {
          delete nextSelected['14258'];
        }
      } else {
        delete nextSelected[node.id];
        // Décochage en cascade de tous les descendants
        const descendantIds = getAllDescendantIds(node);
        for (const childId of descendantIds) {
          delete nextSelected[childId];
        }

        // Nettoyage des boutons radios liés aux descendants
        for (const [group, selectedId] of Object.entries(nextRadios)) {
          if (descendantIds.includes(selectedId)) {
            delete nextRadios[group];
          }
        }
      }

      return {
        ...prev,
        selectedIds: nextSelected,
        radioSelections: nextRadios,
      };
    });
  }, [state.selectedIds, state.radioSelections]);

  // Sélectionne un bouton radio
  const selectRadio = useCallback((node: QuestionNode, groupName: string) => {
    setState((prev) => {
      const nextRadios = { ...prev.radioSelections, [groupName]: node.id };
      const nextSelected = { ...prev.selectedIds };

      // Si on coche une anomalie radio, décocher "ECG normal"
      if (nextSelected['14258']) {
        delete nextSelected['14258'];
      }

      return {
        ...prev,
        radioSelections: nextRadios,
        selectedIds: nextSelected,
      };
    });
  }, []);

  // Confirmation du conflit "ECG normal" : désactive toutes les anomalies et coche ECG normal
  const confirmClearAndSetNormal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIds: { '14258': true, '14149': true }, // ECG normal + Rythme sinusal
      radioSelections: {},
    }));
    setShowNormalConflictModal(false);
  }, []);

  // Mise à jour des mesures
  const updateMeasurements = useCallback((measurements: MeasurementsState) => {
    setState((prev) => ({ ...prev, measurements }));
  }, []);

  // Mise à jour de la photo de l'ECG
  const updateECGImage = useCallback((ecgImage: string | null) => {
    setState((prev) => ({ ...prev, ecgImage }));
  }, []);

  // Mise à jour de la note clinique
  const updatePatientNote = useCallback((patientNote: string) => {
    setState((prev) => ({ ...prev, patientNote }));
  }, []);

  // Réinitialisation complète
  const resetForm = useCallback(() => {
    if (window.confirm('Voulez-vous vraiment démarrer une nouvelle interprétation ? Toutes les données actuelles seront effacées.')) {
      const newState: ECGState = {
        selectedIds: {},
        radioSelections: {},
        measurements: {},
        ecgImage: null,
        patientNote: '',
        examDate: getFormattedCurrentDate(),
      };
      setState(newState);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    state,
    tree: ECG_TREE,
    activeHelpNode,
    showNormalConflictModal,
    setActiveHelpNode,
    setShowNormalConflictModal,
    toggleCheckbox,
    selectRadio,
    confirmClearAndSetNormal,
    updateMeasurements,
    updateECGImage,
    updatePatientNote,
    resetForm,
  };
}
