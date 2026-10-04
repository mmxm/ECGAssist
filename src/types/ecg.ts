export type QuestionType = 'checkbox' | 'radio' | 'numeric' | 'section';

export interface QuestionNode {
  id: string;
  label: string;
  type: QuestionType;
  groupName?: string; // Pour les boutons radio exclusifs
  description?: string; // Texte de l'info popover
  referenceUrl?: string; // Titre du cours ou de la fiche
  svgDiagram?: string; // Schéma vectoriel SVG intégré
  imageUrl?: string; // Illustration didactique du référentiel (crop haute résolution)
  imageCaption?: string; // Légende clinique de l'illustration
  children?: QuestionNode[];
  unit?: string;
  placeholder?: string;
  defaultValue?: number;
}

export interface MeasurementsState {
  rr?: number; // ms
  hr?: number; // bpm (calculé automatiquement si rr ou saisi)
  pr?: number; // ms
  qrs?: number; // ms
  qt?: number; // ms
  qtc?: number; // ms (formule de Bazett)
  sV1?: number; // mm
  rV56?: number; // mm
  sokolow?: number; // mm
  sV3?: number; // mm
  rAVL?: number; // mm
  cornell?: number; // mm
}

export interface ECGState {
  selectedIds: Record<string, boolean>; // id -> checked
  radioSelections: Record<string, string>; // groupName -> selectedId
  measurements: MeasurementsState;
  ecgImage: string | null; // dataURL ou blob URL de la photo
  patientNote: string;
  examDate: string; // ISO string ou date formatée
}
