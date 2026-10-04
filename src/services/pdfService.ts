import jsPDF from 'jspdf';
import type { MeasurementsState, QuestionNode } from '../types/ecg';
import { getSelectedReportItems } from '../utils/treeUtils';
import { evaluateQTc } from '../utils/calculations';

export interface PDFReportOptions {
  measurements: MeasurementsState;
  selectedIds: Record<string, boolean>;
  radioSelections: Record<string, string>;
  tree: QuestionNode[];
  ecgImage: string | null;
  patientNote: string;
  examDate: string;
}

export function generateECGReportPDF(options: PDFReportOptions): jsPDF {
  const { measurements, selectedIds, radioSelections, tree, ecgImage, patientNote, examDate } = options;

  // Création du document A4 Portrait (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // -------------------------------------------------------------
  // PAGE 1 : COMPTE-RENDU D'INTERPRÉTATION
  // -------------------------------------------------------------

  // En-tête Médical
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(margin, margin, contentWidth, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('COMPTE-RENDU D\'INTERPRÉTATION ECG', margin + 6, margin + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(`Examen réalisé le : ${examDate}`, margin + 6, margin + 15);

  let currentY = margin + 27;

  // -------------------------------------------------------------
  // Bloc 1 : Mesures et Constantes biomédicales (Si renseignées)
  // -------------------------------------------------------------
  const activeMeasurements: { label: string; value: string; isAlert?: boolean }[] = [];

  if (measurements.rr) {
    activeMeasurements.push({ label: 'Intervalle RR', value: `${measurements.rr} ms` });
  }
  if (measurements.hr) {
    activeMeasurements.push({ label: 'Fréquence Cardiaque', value: `${measurements.hr} bpm` });
  }
  if (measurements.pr) {
    activeMeasurements.push({
      label: 'Durée PR',
      value: `${measurements.pr} ms`,
      isAlert: measurements.pr > 200,
    });
  }
  if (measurements.qrs) {
    activeMeasurements.push({
      label: 'Durée QRS',
      value: `${measurements.qrs} ms`,
      isAlert: measurements.qrs >= 120,
    });
  }
  if (measurements.qt) {
    activeMeasurements.push({ label: 'Durée QT', value: `${measurements.qt} ms` });
  }
  if (measurements.qtc) {
    const qtcEval = evaluateQTc(measurements.qtc);
    activeMeasurements.push({
      label: 'QTc (Framingham)',
      value: `${measurements.qtc} ms (${qtcEval.isLong ? 'Allongé' : 'Normal'})`,
      isAlert: qtcEval.isLong,
    });
  }
  if (measurements.sokolow) {
    activeMeasurements.push({
      label: 'Indice de Sokolow',
      value: `${measurements.sokolow} mm`,
      isAlert: measurements.sokolow > 35,
    });
  }
  if (measurements.cornell) {
    activeMeasurements.push({
      label: 'Indice de Cornell',
      value: `${measurements.cornell} mm`,
    });
  }

  let sectionCounter = 1;

  // Affichage du bloc des mesures UNIQUEMENT si au moins une mesure est renseignée
  if (activeMeasurements.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`${sectionCounter}. MESURES SUR LE TRACÉ`, margin, currentY);
    currentY += 4.5;

    // Calcul de la hauteur de la boîte selon le nombre d'éléments (disposition en 3 colonnes)
    const itemsPerRow = 3;
    const rowCount = Math.ceil(activeMeasurements.length / itemsPerRow);
    const boxHeight = 8 + rowCount * 7.5;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFontSize(9);

    const colWidth = contentWidth / itemsPerRow;

    activeMeasurements.forEach((item, idx) => {
      const col = idx % itemsPerRow;
      const row = Math.floor(idx / itemsPerRow);
      const itemX = margin + 5 + col * colWidth;
      const itemY = currentY + 6.5 + row * 7.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`${item.label} : `, itemX, itemY);

      const labelWidth = doc.getTextWidth(`${item.label} : `);
      doc.setFont('helvetica', 'bold');
      if (item.isAlert) {
        doc.setTextColor(220, 38, 38);
      } else {
        doc.setTextColor(15, 23, 42);
      }
      doc.text(item.value, itemX + labelWidth, itemY);
    });

    currentY += boxHeight + 8;
    sectionCounter++;
  }

  // -------------------------------------------------------------
  // Bloc 2 : Constatations & Anomalies Électrocardiographiques
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`${sectionCounter}. CONSTATATIONS & ANOMALIES ÉLECTROCARDIOGRAPHIQUES`, margin, currentY);
  currentY += 5;

  const reportItems = getSelectedReportItems(tree, selectedIds, radioSelections);
  const isEcgNormal = !!selectedIds['14258'];

  if (isEcgNormal && reportItems.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, 'FD');

    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('✓ TRACÉ ÉLECTROCARDIOGRAPHIQUE NORMAL', margin + 6, currentY + 6.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Rythme sinusal régulier, absence d\'anomalie de conduction, d\'excitabilité ou de repolarisation.', margin + 6, currentY + 11.5);
    currentY += 22;
    sectionCounter++;
  } else if (reportItems.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Aucune anomalie cochée lors de l\'interprétation.', margin + 4, currentY + 5);
    currentY += 12;
    sectionCounter++;
  } else {
    for (const group of reportItems) {
      if (currentY > pageHeight - 45) {
        doc.addPage();
        currentY = margin + 10;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(2, 132, 199); // Sky 600
      doc.text(group.sectionTitle.toUpperCase(), margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);

      for (const item of group.items) {
        if (currentY > pageHeight - 40) {
          doc.addPage();
          currentY = margin + 10;
        }

        const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 8);
        doc.text(lines, margin + 4, currentY);
        currentY += lines.length * 4.2;
      }
      currentY += 2.5;
    }
    sectionCounter++;
  }

  // -------------------------------------------------------------
  // Bloc 3 : Conclusion & Note clinique libre (UNIQUEMENT si renseignée)
  // -------------------------------------------------------------
  const trimmedNote = patientNote ? patientNote.trim() : '';

  if (trimmedNote.length > 0) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = margin + 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`${sectionCounter}. CONCLUSION & SYNTHÈSE MÉDICALE`, margin, currentY + 4);
    currentY += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const noteLines = doc.splitTextToSize(trimmedNote, contentWidth - 10);
    const noteHeight = Math.max(20, 8 + noteLines.length * 4.5);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, currentY, contentWidth, noteHeight, 2, 2, 'FD');

    doc.text(noteLines, margin + 5, currentY + 6.5);
    currentY += noteHeight + 6;
  }

  // Pied de page Page 1
  const totalPages = ecgImage ? 2 : 1;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`ECGAssist • Page 1 sur ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

  // -------------------------------------------------------------
  // PAGE 2 : ANNEXE PHOTO DU TRACÉ ECG (Si présente)
  // -------------------------------------------------------------
  if (ecgImage) {
    doc.addPage('a4', 'landscape'); // Page en mode Paysage pour l'ECG

    const landscapeWidth = 297;
    const landscapeHeight = 210;

    // En-tête Annexe
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, margin, landscapeWidth - margin * 2, 14, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('ANNEXE : TRACÉ DE L\'ÉLECTROCARDIOGRAMME', margin + 6, margin + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(`Enregistré le : ${examDate}`, landscapeWidth - margin - 60, margin + 9);

    // Insertion de la photo de l'ECG
    const imageAreaX = margin;
    const imageAreaY = margin + 18;
    const imageAreaWidth = landscapeWidth - margin * 2;
    const imageAreaHeight = landscapeHeight - imageAreaY - margin - 8;

    try {
      doc.addImage(
        ecgImage,
        'JPEG',
        imageAreaX,
        imageAreaY,
        imageAreaWidth,
        imageAreaHeight,
        undefined,
        'FAST'
      );
    } catch {
      doc.setDrawColor(203, 213, 225);
      doc.rect(imageAreaX, imageAreaY, imageAreaWidth, imageAreaHeight);
      doc.setTextColor(148, 163, 184);
      doc.text('Photo de l\'ECG jointe', landscapeWidth / 2, landscapeHeight / 2, { align: 'center' });
    }

    // Pied de page Page 2
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`ECGAssist • Annexe Tracé • Page 2 sur 2`, landscapeWidth / 2, landscapeHeight - 5, { align: 'center' });
  }

  return doc;
}
