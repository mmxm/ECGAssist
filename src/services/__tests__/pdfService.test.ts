import { describe, it, expect } from 'vitest';
import { generateECGReportPDF } from '../pdfService';
import { ECG_TREE } from '../../data/ecgQuestions';

describe('Générateur de Rapport PDF (pdfService)', () => {
  it('génère un document PDF valide pour un tracé normal sans image', () => {
    const doc = generateECGReportPDF({
      measurements: { rr: 1000, hr: 60, pr: 160, qrs: 80, qt: 400, qtc: 400 },
      selectedIds: { '14258': true },
      radioSelections: {},
      tree: ECG_TREE,
      ecgImage: null,
      patientNote: 'Examen de contrôle normal.',
      examDate: '04/10/2026 à 11:30',
    });

    expect(doc).toBeDefined();
    // Le document doit comporter 1 page
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it('génère un document PDF à 2 pages lorsqu\'une photo de tracé est jointe', () => {
    // Faux dataURL JPEG 1x1 pixel blanc
    const fakeDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

    const doc = generateECGReportPDF({
      measurements: { hr: 120, qrs: 140 },
      selectedIds: { '14173': true, '14175': true, '14183': true },
      radioSelections: { tachy_large: '14185' }, // Tachycardie ventriculaire
      tree: ECG_TREE,
      ecgImage: fakeDataUrl,
      patientNote: 'Suspicion de TV soutenue.',
      examDate: '04/10/2026 à 11:35',
    });

    expect(doc).toBeDefined();
    // Le document doit comporter 2 pages (Rapport médical + Tracé en annexe)
    expect(doc.getNumberOfPages()).toBe(2);
  });
});
