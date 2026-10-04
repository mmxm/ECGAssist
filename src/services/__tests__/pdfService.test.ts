import { describe, it, expect } from 'vitest';
import { generateECGReportPDF } from '../pdfService';
import { ECG_TREE } from '../../data/ecgQuestions';

describe('Générateur de Rapport PDF (pdfService)', () => {
  it('génère un document PDF valide pour un tracé sans mesures et sans note (aucun cadre vide)', () => {
    const doc = generateECGReportPDF({
      measurements: {},
      selectedIds: { '14258': true },
      radioSelections: {},
      tree: ECG_TREE,
      ecgImage: null,
      patientNote: '',
      examDate: '04/10/2026 à 14:30',
    });

    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it('génère un document avec les mesures et la conclusion si renseignées', () => {
    const doc = generateECGReportPDF({
      measurements: { hr: 75, qtc: 395 },
      selectedIds: { '14149': true },
      radioSelections: {},
      tree: ECG_TREE,
      ecgImage: null,
      patientNote: 'Rythme sinusal sans anomalie de repolarisation.',
      examDate: '04/10/2026 à 14:30',
    });

    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it('génère un document PDF à 2 pages lorsqu\'une photo de tracé est jointe', () => {
    const fakeDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

    const doc = generateECGReportPDF({
      measurements: { hr: 120, qrs: 140 },
      selectedIds: { '14173': true, '14175': true, '14183': true },
      radioSelections: { tachy_large: '14185' },
      tree: ECG_TREE,
      ecgImage: fakeDataUrl,
      patientNote: 'Suspicion de TV soutenue.',
      examDate: '04/10/2026 à 14:35',
    });

    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBe(2);
  });
});
