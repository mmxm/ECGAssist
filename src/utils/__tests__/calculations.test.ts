import { describe, it, expect } from 'vitest';
import {
  calculateHeartRate,
  calculateRRFromHeartRate,
  calculateQTcFramingham,
  calculateSokolow,
  calculateCornell,
  evaluateQTc,
} from '../calculations';

describe('Calculs ECG Biomédicaux', () => {
  describe('calculateHeartRate & calculateRRFromHeartRate', () => {
    it('calcule correctement la fréquence cardiaque pour 1000 ms (60 bpm)', () => {
      expect(calculateHeartRate(1000)).toBe(60);
    });

    it('calcule correctement la fréquence cardiaque pour 750 ms (80 bpm)', () => {
      expect(calculateHeartRate(750)).toBe(80);
    });

    it('calcule correctement la fréquence cardiaque pour 600 ms (100 bpm)', () => {
      expect(calculateHeartRate(600)).toBe(100);
    });

    it('calcule correctement la conversion inverse FC -> RR', () => {
      expect(calculateRRFromHeartRate(60)).toBe(1000);
      expect(calculateRRFromHeartRate(120)).toBe(500);
    });

    it('gère les valeurs invalides ou nulles', () => {
      expect(calculateHeartRate(0)).toBeUndefined();
      expect(calculateHeartRate(-500)).toBeUndefined();
      expect(calculateHeartRate(NaN)).toBeUndefined();
      expect(calculateRRFromHeartRate(0)).toBeUndefined();
    });
  });

  describe('calculateQTcFramingham', () => {
    it('calcule le QTc identique au QT mesuré si FC = 60 bpm (RR = 1000 ms)', () => {
      // QTc = 400 + 0.154 * (1000 - 1000) = 400
      expect(calculateQTcFramingham(400, 1000)).toBe(400);
    });

    it('calcule correctement le QTc en cas de tachycardie (ex: QT = 320 ms, RR = 500 ms / FC 120)', () => {
      // QTc = 320 + 0.154 * (1000 - 500) = 320 + 77 = 397 ms
      expect(calculateQTcFramingham(320, 500)).toBe(397);
    });

    it('calcule correctement le QTc en cas de bradycardie (ex: QT = 440 ms, RR = 1500 ms / FC 40)', () => {
      // QTc = 440 + 0.154 * (1000 - 1500) = 440 - 77 = 363 ms
      expect(calculateQTcFramingham(440, 1500)).toBe(363);
    });

    it('retourne undefined pour des entrées non physiologiques ou négatives', () => {
      expect(calculateQTcFramingham(0, 1000)).toBeUndefined();
      expect(calculateQTcFramingham(400, 0)).toBeUndefined();
      expect(calculateQTcFramingham(-400, 1000)).toBeUndefined();
    });
  });

  describe('evaluateQTc', () => {
    it('indique un QTc normal si < 450 ms chez l homme', () => {
      const res = evaluateQTc(420, false);
      expect(res.isLong).toBe(false);
      expect(res.badgeType).toBe('normal');
    });

    it('indique un QTc allongé si > 450 ms chez l homme', () => {
      const res = evaluateQTc(465, false);
      expect(res.isLong).toBe(true);
      expect(res.badgeType).toBe('warning');
    });

    it('tient compte du seuil femme de 460 ms', () => {
      const resH = evaluateQTc(455, false);
      const resF = evaluateQTc(455, true);
      expect(resH.isLong).toBe(true); // > 450
      expect(resF.isLong).toBe(false); // <= 460
    });

    it('détecte le seuil critique à risque de torsade (>= 500 ms)', () => {
      const res = evaluateQTc(510, false);
      expect(res.isLong).toBe(true);
      expect(res.badgeType).toBe('danger');
      expect(res.statusText).toContain('Torsade de Pointes');
    });
  });

  describe('calculateSokolow & calculateCornell', () => {
    it('calcule la somme de Sokolow avec précision', () => {
      expect(calculateSokolow(15.5, 22)).toBe(37.5);
    });

    it('calcule l indice de Cornell', () => {
      expect(calculateCornell(12, 14.5)).toBe(26.5);
    });
  });
});
