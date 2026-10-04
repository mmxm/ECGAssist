import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useECGForm } from '../useECGForm';
import type { QuestionNode } from '../../types/ecg';

describe('useECGForm hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initialise avec un état vide par défaut', () => {
    const { result } = renderHook(() => useECGForm());
    expect(result.current.state.selectedIds).toEqual({});
    expect(result.current.state.ecgImage).toBeNull();
  });

  it('coche une case et la sauvegarde', () => {
    const { result } = renderHook(() => useECGForm());
    const dummyNode: QuestionNode = { id: 'test_item', label: 'Test', type: 'checkbox' };

    act(() => {
      result.current.toggleCheckbox(dummyNode, true);
    });

    expect(result.current.state.selectedIds['test_item']).toBe(true);
  });

  it('décoche en cascade tous les descendants quand le parent est décoché', () => {
    const { result } = renderHook(() => useECGForm());
    const childNode: QuestionNode = { id: 'child', label: 'Child', type: 'checkbox' };
    const parentNode: QuestionNode = {
      id: 'parent',
      label: 'Parent',
      type: 'checkbox',
      children: [childNode],
    };

    // Cocher parent puis enfant
    act(() => {
      result.current.toggleCheckbox(parentNode, true);
      result.current.toggleCheckbox(childNode, true);
    });

    expect(result.current.state.selectedIds['parent']).toBe(true);
    expect(result.current.state.selectedIds['child']).toBe(true);

    // Décocher parent -> l'enfant doit disparaître en cascade
    act(() => {
      result.current.toggleCheckbox(parentNode, false);
    });

    expect(result.current.state.selectedIds['parent']).toBeUndefined();
    expect(result.current.state.selectedIds['child']).toBeUndefined();
  });

  it('déclenche la modale de conflit si on coche ECG normal alors qu une anomalie est présente', () => {
    const { result } = renderHook(() => useECGForm());
    const anomalyNode: QuestionNode = { id: '14173', label: 'Tachycardie', type: 'checkbox' };
    const normalNode: QuestionNode = { id: '14258', label: 'ECG strictement normal', type: 'checkbox' };

    // Cocher une anomalie
    act(() => {
      result.current.toggleCheckbox(anomalyNode, true);
    });

    // Tenter de cocher "ECG normal"
    act(() => {
      result.current.toggleCheckbox(normalNode, true);
    });

    // La modale de conflit doit s'ouvrir et "ECG normal" n'est pas encore forcé
    expect(result.current.showNormalConflictModal).toBe(true);
    expect(result.current.state.selectedIds['14258']).toBeUndefined();

    // L'utilisateur confirme le nettoyage
    act(() => {
      result.current.confirmClearAndSetNormal();
    });

    expect(result.current.showNormalConflictModal).toBe(false);
    expect(result.current.state.selectedIds['14258']).toBe(true);
    expect(result.current.state.selectedIds['14173']).toBeUndefined();
  });
});
