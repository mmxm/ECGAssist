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

  // En-tête Médical avec bandeau élégant
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(margin, margin, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('COMPTE-RENDU D\'INTERPRÉTATION ECG', margin + 6, margin + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(`Examen réalisé le : ${examDate}`, margin + 6, margin + 16);
  doc.text('ECGAssist • Référentiel Clinique', pageWidth - margin - 52, margin + 16);

  let currentY = margin + 30;

  // Bloc 1 : Mesures et Constantes biomédicales
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('1. MESURES SUR LE TRACÉ', margin + 6, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const col1X = margin + 6;
  const col2X = margin + 70;
  const col3X = margin + 130;

  const row1Y = currentY + 16;
  const row2Y = currentY + 26;

  // Ligne 1
  const rrText = measurements.rr ? `${measurements.rr} ms` : 'Non mesuré';
  const hrText = measurements.hr ? `${measurements.hr} bpm` : 'Non mesuré';
  const prText = measurements.pr ? `${measurements.pr} ms` : 'Non mesuré';

  doc.text(`• Intervalle RR : `, col1X, row1Y);
  doc.setFont('helvetica', 'bold');
  doc.text(rrText, col1X + 26, row1Y);
  doc.setFont('helvetica', 'normal');

  doc.text(`• Fréquence : `, col2X, row1Y);
  doc.setFont('helvetica', 'bold');
  doc.text(hrText, col2X + 22, row1Y);
  doc.setFont('helvetica', 'normal');

  doc.text(`• Durée PR : `, col3X, row1Y);
  doc.setFont('helvetica', 'bold');
  doc.text(prText, col3X + 22, row1Y);
  doc.setFont('helvetica', 'normal');

  // Ligne 2 : QRS, QT, QTc
  const qrsText = measurements.qrs ? `${measurements.qrs} ms` : 'Non mesuré';
  const qtText = measurements.qt ? `${measurements.qt} ms` : 'Non mesuré';

  let qtcText = 'Non calculé';
  if (measurements.qtc) {
    const qtcEval = evaluateQTc(measurements.qtc);
    qtcText = `${measurements.qtc} ms (${qtcEval.isLong ? 'Allongé' : 'Normal'})`;
  }

  doc.text(`• Durée QRS : `, col1X, row2Y);
  doc.setFont('helvetica', 'bold');
  doc.text(qrsText, col1X + 24, row2Y);
  doc.setFont('helvetica', 'normal');

  doc.text(`• Durée QT : `, col2X, row2Y);
  doc.setFont('helvetica', 'bold');
  doc.text(qtText, col2X + 21, row2Y);
  doc.setFont('helvetica', 'normal');

  doc.text(`• QTc (Bazett) : `, col3X, row2Y);
  doc.setFont('helvetica', 'bold');
  if (measurements.qtc && evaluateQTc(measurements.qtc).isLong) {
    doc.setTextColor(220, 38, 38); // Rouge si allongé
  }
  doc.text(qtcText, col3X + 27, row2Y);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');

  currentY += 42;

  // Indices d'hypertrophie si présents
  if (measurements.sokolow || measurements.cornell) {
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const sokolowStr = measurements.sokolow ? `Indice de Sokolow : ${measurements.sokolow} mm` : '';
    const cornellStr = measurements.cornell ? `Indice de Cornell : ${measurements.cornell} mm` : '';
    const indicesStr = [sokolowStr, cornellStr].filter(Boolean).join('  |  ');
    doc.text(indicesStr, margin + 6, currentY);
    currentY += 6;
  }

  // Bloc 2 : Constatations & Anomalies
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('2. CONSTATATIONS & ANOMALIES ÉLECTROCARDIOGRAPHIQUES', margin, currentY);
  currentY += 6;

  const reportItems = getSelectedReportItems(tree, selectedIds, radioSelections);
  const isEcgNormal = !!selectedIds['14258'];

  if (isEcgNormal && reportItems.length === 0) {
    doc.setFillColor(240, 253, 244); // Vert très clair
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('✓ TRACÉ ÉLECTROCARDIOGRAPHIQUE NORMAL', margin + 8, currentY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Rythme sinusal régulier, absence d\'anomalie de conduction, d\'excitabilité ou de repolarisation.', margin + 8, currentY + 14);
    currentY += 26;
  } else if (reportItems.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Aucune anomalie cochée lors de l\'interprétation.', margin + 6, currentY + 6);
    currentY += 14;
  } else {
    for (const group of reportItems) {
      if (currentY > pageHeight - 55) {
        doc.addPage();
        currentY = margin + 10;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(2, 132, 199); // Sky 600
      doc.text(group.sectionTitle.toUpperCase(), margin, currentY);
      currentY += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);

      for (const item of group.items) {
        if (currentY > pageHeight - 50) {
          doc.addPage();
          currentY = margin + 10;
        }

        const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 8);
        doc.text(lines, margin + 4, currentY);
        currentY += lines.length * 4.5;
      }
      currentY += 3;
    }
  }

  // Bloc 3 : Conclusion & Note clinique libre
  if (currentY > pageHeight - 55) {
    doc.addPage();
    currentY = margin + 10;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('3. CONCLUSION & SYNTHÈSE MÉDICALE', margin, currentY + 4);
  currentY += 10;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  const noteBoxHeight = 32;
  doc.roundedRect(margin, currentY, contentWidth, noteBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const noteContent = patientNote.trim()
    ? patientNote
    : isEcgNormal
    ? 'ECG normal ne nécessitant pas de prise en charge rythmologique spécifique dans ce contexte.'
    : 'Anomalie(s) électrocardiographique(s) identifiée(s) à confronter au contexte clinique et hémodynamique.';

  const noteLines = doc.splitTextToSize(noteContent, contentWidth - 10);
  doc.text(noteLines, margin + 5, currentY + 8);

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
    doc.text('ANNEXE : TRACÉ DE L\'ÉLECTROCARDIOGRAMME (12 DÉRIVATIONS)', margin + 6, margin + 9);

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
      // En cas d'erreur de format, cadre de secours
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
