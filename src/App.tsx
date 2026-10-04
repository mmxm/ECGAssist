import React, { useState } from 'react';
import { useECGForm } from './hooks/useECGForm';
import { Header } from './components/Header';
import { ECGPhotoUploader } from './components/ECGPhotoUploader';
import { MeasurementsBar } from './components/MeasurementsBar';
import { QuestionTree } from './components/QuestionTree';
import { HelpDrawer } from './components/HelpDrawer';
import { NormalConfirmModal } from './components/NormalConfirmModal';
import { generateECGReportPDF } from './services/pdfService';
import { hasAnyAnomalySelected } from './utils/treeUtils';

export const App: React.FC = () => {
  const {
    state,
    tree,
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
  } = useECGForm();

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const doc = generateECGReportPDF({
        measurements: state.measurements,
        selectedIds: state.selectedIds,
        radioSelections: state.radioSelections,
        tree,
        ecgImage: state.ecgImage,
        patientNote: state.patientNote,
        examDate: state.examDate,
      });

      // Téléchargement du fichier avec nom horodaté
      const filenameDate = state.examDate.replace(/[/ :]/g, '-');
      doc.save(`ECGAssist_Rapport_${filenameDate}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la génération du document PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const hasSelections = hasAnyAnomalySelected(state.selectedIds, state.radioSelections) || !!state.selectedIds['14258'];

  return (
    <div className="app-layout">
      <Header
        examDate={state.examDate}
        onReset={resetForm}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
        hasSelectedItems={hasSelections}
      />

      <main className="main-content-container">
        {/* 1. Module Photo ECG */}
        <ECGPhotoUploader
          ecgImage={state.ecgImage}
          onImageChange={updateECGImage}
        />

        {/* 2. Barre de mesures & calculateurs automatiques */}
        <MeasurementsBar
          measurements={state.measurements}
          onChange={updateMeasurements}
        />

        {/* 3. Arbre sémiologique et conclusion */}
        <QuestionTree
          tree={tree}
          selectedIds={state.selectedIds}
          radioSelections={state.radioSelections}
          patientNote={state.patientNote}
          onToggleCheckbox={toggleCheckbox}
          onSelectRadio={selectRadio}
          onOpenHelp={setActiveHelpNode}
          onPatientNoteChange={updatePatientNote}
        />
      </main>

      {/* Tiroir d'aide sémiologique contextuelle avec schémas SVG */}
      <HelpDrawer
        node={activeHelpNode}
        onClose={() => setActiveHelpNode(null)}
      />

      {/* Modale d'avertissement de conflit si on coche "ECG normal" */}
      <NormalConfirmModal
        isOpen={showNormalConflictModal}
        onConfirmClearAndSetNormal={confirmClearAndSetNormal}
        onCancel={() => setShowNormalConflictModal(false)}
      />

      <footer className="app-footer">
        <p>ECGAssist • Outil clinique d'aide à l'interprétation d'électrocardiogramme • 100% Hors-ligne</p>
      </footer>
    </div>
  );
};

export default App;
