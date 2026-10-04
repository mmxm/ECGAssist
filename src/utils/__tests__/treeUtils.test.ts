import { describe, it, expect } from 'vitest';
import { getAllDescendantIds, findNodeById, hasAnyAnomalySelected } from '../treeUtils';
import type { QuestionNode } from '../../types/ecg';

const mockTree: QuestionNode[] = [
  {
    id: 'parent1',
    label: 'Trouble de conduction',
    type: 'checkbox',
    children: [
      {
        id: 'child1',
        label: 'BAV',
        type: 'checkbox',
        children: [
          { id: 'grandchild1', label: 'BAV 3', type: 'checkbox' },
          { id: 'grandchild2', label: 'BAV 2', type: 'checkbox' },
        ],
      },
      {
        id: 'child2',
        label: 'Bloc sino-atrial',
        type: 'checkbox',
      },
    ],
  },
  {
    id: '14258',
    label: 'ECG strictement normal',
    type: 'checkbox',
  },
  {
    id: '14149',
    label: 'Rythme sinusal normal',
    type: 'checkbox',
  },
];

describe('Utilitaires d\'arbre ECG (treeUtils)', () => {
  it('trouve correctement tous les descendants d\'un nœud', () => {
    const parent = mockTree[0];
    const descendants = getAllDescendantIds(parent);
    expect(descendants).toEqual(['child1', 'grandchild1', 'grandchild2', 'child2']);
  });

  it('retourne un tableau vide pour un nœud sans enfant', () => {
    expect(getAllDescendantIds(mockTree[1])).toEqual([]);
  });

  it('trouve un nœud par son ID même profondément imbriqué', () => {
    const node = findNodeById(mockTree, 'grandchild1');
    expect(node).toBeDefined();
    expect(node?.label).toBe('BAV 3');
  });

  it('détecte correctement la présence d\'anomalies sélectionnées', () => {
    // Cas 1 : aucune anomalie cochée
    expect(hasAnyAnomalySelected({}, {})).toBe(false);

    // Cas 2 : seulement "ECG normal" ou "Rythme sinusal"
    expect(hasAnyAnomalySelected({ '14258': true, '14149': true }, {})).toBe(false);

    // Cas 3 : une anomalie réelle cochée
    expect(hasAnyAnomalySelected({ 'child1': true }, {})).toBe(true);

    // Cas 4 : un bouton radio d'anomalie sélectionné
    expect(hasAnyAnomalySelected({}, { axe_coeur: '14267' })).toBe(true);
  });
});
