import type { QuestionNode } from '../types/ecg';

/**
 * Récupère récursivement tous les IDs descendants d'un nœud donné
 */
export function getAllDescendantIds(node: QuestionNode): string[] {
  const ids: string[] = [];
  if (!node.children || node.children.length === 0) return ids;

  for (const child of node.children) {
    ids.push(child.id);
    ids.push(...getAllDescendantIds(child));
  }
  return ids;
}

/**
 * Trouve un nœud par son ID dans un arbre ou sous-arbre
 */
export function findNodeById(nodes: QuestionNode[], id: string): QuestionNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Vérifie si au moins une anomalie est sélectionnée (hors sections et hors '14258' = ECG normal)
 */
export function hasAnyAnomalySelected(
  selectedIds: Record<string, boolean>,
  radioSelections: Record<string, string>
): boolean {
  // Vérifie les cases à cocher
  for (const [id, checked] of Object.entries(selectedIds)) {
    if (checked && id !== '14258' && id !== '14149' && !id.startsWith('section_')) {
      return true;
    }
  }

  // Vérifie les boutons radio sélectionnés (si le groupe est actif)
  for (const [group, selectedId] of Object.entries(radioSelections)) {
    if (selectedId && group !== '') {
      return true;
    }
  }

  return false;
}

/**
 * Construit un résumé textuel clair des anomalies retenues pour le compte-rendu PDF
 */
export function getSelectedReportItems(
  tree: QuestionNode[],
  selectedIds: Record<string, boolean>,
  radioSelections: Record<string, string>
): { sectionTitle: string; items: string[] }[] {
  const report: { sectionTitle: string; items: string[] }[] = [];

  for (const topNode of tree) {
    const sectionItems: string[] = [];

    // Fonction de parcours
    function collectSelected(node: QuestionNode, prefix = '') {
      const isSelected = selectedIds[node.id] || Object.values(radioSelections).includes(node.id);

      if (isSelected && node.type !== 'section') {
        const fullLabel = prefix ? `${prefix} > ${node.label}` : node.label;
        sectionItems.push(fullLabel);

        if (node.children) {
          for (const child of node.children) {
            collectSelected(child, fullLabel);
          }
        }
      } else if (node.type === 'section' && node.children) {
        for (const child of node.children) {
          collectSelected(child, '');
        }
      }
    }

    collectSelected(topNode);

    if (sectionItems.length > 0) {
      report.push({
        sectionTitle: topNode.label,
        items: sectionItems,
      });
    }
  }

  return report;
}
