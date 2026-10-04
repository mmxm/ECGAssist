/**
 * Module de calculs biomédicaux pour l'ECG
 */

/**
 * Calcule la fréquence cardiaque (bpm) à partir de l'intervalle RR (ms)
 * Formule standard : FC = 60000 / RR
 */
export function calculateHeartRate(rrMs: number): number | undefined {
  if (!rrMs || rrMs <= 0 || isNaN(rrMs)) return undefined;
  return Math.round(60000 / rrMs);
}

/**
 * Calcule l'intervalle RR (ms) à partir de la fréquence cardiaque (bpm)
 * Formule : RR = 60000 / FC
 */
export function calculateRRFromHeartRate(hrBpm: number): number | undefined {
  if (!hrBpm || hrBpm <= 0 || isNaN(hrBpm)) return undefined;
  return Math.round(60000 / hrBpm);
}

/**
 * Calcule le QT corrigé (QTc) selon la formule de Bazett
 * Formule : QTc = QT / sqrt(RR_en_secondes) = QT / sqrt(RR_ms / 1000)
 * @param qtMs Durée QT en millisecondes
 * @param rrMs Durée RR en millisecondes
 */
export function calculateQTcBazett(qtMs: number, rrMs: number): number | undefined {
  if (!qtMs || !rrMs || qtMs <= 0 || rrMs <= 0 || isNaN(qtMs) || isNaN(rrMs)) {
    return undefined;
  }
  const rrSec = rrMs / 1000;
  const qtc = qtMs / Math.sqrt(rrSec);
  return Math.round(qtc);
}

/**
 * Calcule l'indice de Sokolow-Lyon (hypertrophie ventriculaire gauche)
 * S en V1 (mm) + R en V5 ou V6 (mm)
 * Seuil pathologique classique : > 35 mm
 */
export function calculateSokolow(sV1Mm: number, rV56Mm: number): number | undefined {
  if (isNaN(sV1Mm) || isNaN(rV56Mm) || sV1Mm < 0 || rV56Mm < 0) return undefined;
  return Number((sV1Mm + rV56Mm).toFixed(1));
}

/**
 * Calcule l'indice de Cornell
 * R en aVL (mm) + S en V3 (mm)
 * Seuil pathologique : > 28 mm chez l'homme, > 20 mm chez la femme
 */
export function calculateCornell(rAvLMm: number, sV3Mm: number): number | undefined {
  if (isNaN(rAvLMm) || isNaN(sV3Mm) || rAvLMm < 0 || sV3Mm < 0) return undefined;
  return Number((rAvLMm + sV3Mm).toFixed(1));
}

/**
 * Évalue la normalité du QTc selon les recommandations cardiologiques
 * Homme : normal < 450 ms (limite 450-460 ms, long > 460 ms)
 * Femme : normal < 460 ms (limite 460-470 ms, long > 470 ms)
 */
export function evaluateQTc(qtcMs: number, isFemale = false): {
  isLong: boolean;
  statusText: string;
  badgeType: 'normal' | 'warning' | 'danger';
} {
  const threshold = isFemale ? 460 : 450;
  const severeThreshold = 500;

  if (qtcMs >= severeThreshold) {
    return {
      isLong: true,
      statusText: `QTc très allongé (${qtcMs} ms ≥ 500 ms) - Risque élevé de Torsade de Pointes`,
      badgeType: 'danger',
    };
  }

  if (qtcMs > threshold) {
    return {
      isLong: true,
      statusText: `QTc allongé (${qtcMs} ms > seuil ${threshold} ms)`,
      badgeType: 'warning',
    };
  }

  if (qtcMs < 340) {
    return {
      isLong: false,
      statusText: `QTc court (${qtcMs} ms < 340 ms)`,
      badgeType: 'warning',
    };
  }

  return {
    isLong: false,
    statusText: `QTc normal (${qtcMs} ms)`,
    badgeType: 'normal',
  };
}
