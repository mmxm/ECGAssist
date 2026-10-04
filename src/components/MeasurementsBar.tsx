import React, { useState } from 'react';
import type { MeasurementsState } from '../types/ecg';
import {
  calculateHeartRate,
  calculateRRFromHeartRate,
  calculateQTcFramingham,
  calculateSokolow,
  calculateCornell,
  evaluateQTc,
} from '../utils/calculations';
import { Calculator, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface MeasurementsBarProps {
  measurements: MeasurementsState;
  onChange: (updated: MeasurementsState) => void;
}

export const MeasurementsBar: React.FC<MeasurementsBarProps> = ({ measurements, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isFemale, setIsFemale] = useState(false);

  // Mise à jour RR -> calcul automatique de FC et QTc
  const handleRRChange = (valStr: string) => {
    const rr = valStr ? parseFloat(valStr) : undefined;
    const hr = rr ? calculateHeartRate(rr) : undefined;
    const qtc = rr && measurements.qt ? calculateQTcFramingham(measurements.qt, rr) : undefined;
    onChange({ ...measurements, rr, hr: hr ?? measurements.hr, qtc });
  };

  // Mise à jour FC -> calcul automatique de RR et QTc
  const handleHRChange = (valStr: string) => {
    const hr = valStr ? parseFloat(valStr) : undefined;
    const rr = hr ? calculateRRFromHeartRate(hr) : undefined;
    const qtc = rr && measurements.qt ? calculateQTcFramingham(measurements.qt, rr) : undefined;
    onChange({ ...measurements, hr, rr: rr ?? measurements.rr, qtc });
  };

  // Mise à jour PR
  const handlePRChange = (valStr: string) => {
    const pr = valStr ? parseFloat(valStr) : undefined;
    onChange({ ...measurements, pr });
  };

  // Mise à jour QRS
  const handleQRSChange = (valStr: string) => {
    const qrs = valStr ? parseFloat(valStr) : undefined;
    onChange({ ...measurements, qrs });
  };

  // Mise à jour QT -> calcul automatique de QTc
  const handleQTChange = (valStr: string) => {
    const qt = valStr ? parseFloat(valStr) : undefined;
    const qtc = qt && measurements.rr ? calculateQTcFramingham(qt, measurements.rr) : undefined;
    onChange({ ...measurements, qt, qtc });
  };

  // Calculs Sokolow
  const handleSokolowS = (valStr: string) => {
    const sV1 = valStr ? parseFloat(valStr) : undefined;
    const sokolow = sV1 !== undefined && measurements.rV56 !== undefined ? calculateSokolow(sV1, measurements.rV56) : undefined;
    onChange({ ...measurements, sV1, sokolow });
  };

  const handleSokolowR = (valStr: string) => {
    const rV56 = valStr ? parseFloat(valStr) : undefined;
    const sokolow = measurements.sV1 !== undefined && rV56 !== undefined ? calculateSokolow(measurements.sV1, rV56) : undefined;
    onChange({ ...measurements, rV56, sokolow });
  };

  // Calculs Cornell
  const handleCornellR = (valStr: string) => {
    const rAVL = valStr ? parseFloat(valStr) : undefined;
    const cornell = rAVL !== undefined && measurements.sV3 !== undefined ? calculateCornell(rAVL, measurements.sV3) : undefined;
    onChange({ ...measurements, rAVL, cornell });
  };

  const handleCornellS = (valStr: string) => {
    const sV3 = valStr ? parseFloat(valStr) : undefined;
    const cornell = measurements.rAVL !== undefined && sV3 !== undefined ? calculateCornell(measurements.rAVL, sV3) : undefined;
    onChange({ ...measurements, sV3, cornell });
  };

  const qtcEvaluation = measurements.qtc ? evaluateQTc(measurements.qtc, isFemale) : null;

  return (
    <section className="card measurements-card">
      <div className="card-header-clean">
        <div className="card-title-group">
          <Calculator className="text-sky-600" size={18} />
          <h2 className="card-title">Mesures & Calculateurs Rapides</h2>
        </div>

        <button
          type="button"
          className="btn-link"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>{showAdvanced ? 'Masquer calculs HVG' : 'Calculs HVG (Sokolow, Cornell)'}</span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <div className="measurements-grid">
        {/* Intervalle RR */}
        <div className="input-group">
          <label className="input-label" htmlFor="input_rr">
            RR <span className="unit">(ms)</span>
          </label>
          <input
            id="input_rr"
            type="number"
            step="10"
            className="input-field"
            placeholder="ex: 800"
            value={measurements.rr ?? ''}
            onChange={(e) => handleRRChange(e.target.value)}
          />
        </div>

        {/* Fréquence Cardiaque */}
        <div className="input-group">
          <label className="input-label" htmlFor="input_hr">
            Fréquence <span className="unit">(bpm)</span>
          </label>
          <input
            id="input_hr"
            type="number"
            step="1"
            className="input-field highlight-field"
            placeholder="ex: 75"
            value={measurements.hr ?? ''}
            onChange={(e) => handleHRChange(e.target.value)}
          />
        </div>

        {/* Durée PR */}
        <div className="input-group">
          <label className="input-label" htmlFor="input_pr">
            Durée PR <span className="unit">(ms)</span>
          </label>
          <input
            id="input_pr"
            type="number"
            step="10"
            className={`input-field ${measurements.pr && measurements.pr > 200 ? 'field-warning' : ''}`}
            placeholder="120 - 200"
            value={measurements.pr ?? ''}
            onChange={(e) => handlePRChange(e.target.value)}
          />
          {measurements.pr && measurements.pr > 200 && (
            <span className="field-hint text-amber-600">PR long &gt; 200 ms (BAV1)</span>
          )}
        </div>

        {/* Durée QRS */}
        <div className="input-group">
          <label className="input-label" htmlFor="input_qrs">
            Durée QRS <span className="unit">(ms)</span>
          </label>
          <input
            id="input_qrs"
            type="number"
            step="10"
            className={`input-field ${measurements.qrs && measurements.qrs >= 120 ? 'field-warning' : ''}`}
            placeholder="< 100 - 120"
            value={measurements.qrs ?? ''}
            onChange={(e) => handleQRSChange(e.target.value)}
          />
          {measurements.qrs && measurements.qrs >= 120 && (
            <span className="field-hint text-amber-600">QRS large &ge; 120 ms</span>
          )}
        </div>

        {/* Durée QT */}
        <div className="input-group">
          <label className="input-label" htmlFor="input_qt">
            Durée QT <span className="unit">(ms)</span>
          </label>
          <input
            id="input_qt"
            type="number"
            step="10"
            className="input-field"
            placeholder="ex: 380"
            value={measurements.qt ?? ''}
            onChange={(e) => handleQTChange(e.target.value)}
          />
        </div>

        {/* QTc Calculé Automatiquement */}
        <div className="input-group qtc-result-group">
          <div className="qtc-label-row">
            <span className="input-label" title="QTc corrigé selon la formule de Framingham : QTc = QT + 0.154 * (1000 - RR)">
              QTc <span className="unit">(ms)</span>
            </span>
            <div className="sex-toggle" title="Ajuster les seuils selon le sexe (H: 450 ms / F: 460 ms)">
              <button
                type="button"
                className={`btn-pill ${!isFemale ? 'active' : ''}`}
                onClick={() => setIsFemale(false)}
                title="Norme Homme (< 450 ms)"
              >
                H
              </button>
              <button
                type="button"
                className={`btn-pill ${isFemale ? 'active' : ''}`}
                onClick={() => setIsFemale(true)}
                title="Norme Femme (< 460 ms)"
              >
                F
              </button>
            </div>
          </div>

          <div className={`qtc-display-box ${qtcEvaluation ? `qtc-${qtcEvaluation.badgeType}` : ''}`}>
            <span className="qtc-value">{measurements.qtc ? `${measurements.qtc} ms` : '—'}</span>
            {qtcEvaluation && (
              <span className="qtc-status">
                {qtcEvaluation.badgeType === 'danger' && <AlertTriangle size={13} className="inline mr-1" />}
                {qtcEvaluation.statusText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Accordéon calculs avancés d'hypertrophie */}
      {showAdvanced && (
        <div className="advanced-measurements-panel">
          <h4 className="advanced-title">Indices d'Hypertrophie Ventriculaire Gauche (HVG)</h4>
          <div className="advanced-grid">
            <div className="advanced-subcard">
              <span className="subcard-title">Indice de Sokolow-Lyon (Seuil &gt; 35 mm)</span>
              <div className="inputs-inline">
                <div className="input-mini">
                  <label htmlFor="s_v1">S en V1 (mm)</label>
                  <input
                    id="s_v1"
                    type="number"
                    step="0.5"
                    className="input-field input-field-sm"
                    value={measurements.sV1 ?? ''}
                    onChange={(e) => handleSokolowS(e.target.value)}
                  />
                </div>
                <span className="plus-sign">+</span>
                <div className="input-mini">
                  <label htmlFor="r_v56">R en V5/V6 (mm)</label>
                  <input
                    id="r_v56"
                    type="number"
                    step="0.5"
                    className="input-field input-field-sm"
                    value={measurements.rV56 ?? ''}
                    onChange={(e) => handleSokolowR(e.target.value)}
                  />
                </div>
                <span className="equal-sign">=</span>
                <div className="result-mini">
                  <span className="result-label">Sokolow</span>
                  <span className={`result-value ${measurements.sokolow && measurements.sokolow > 35 ? 'text-danger' : ''}`}>
                    {measurements.sokolow ? `${measurements.sokolow} mm` : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="advanced-subcard">
              <span className="subcard-title">Indice de Cornell (Seuil &gt; 28 H / &gt; 20 F mm)</span>
              <div className="inputs-inline">
                <div className="input-mini">
                  <label htmlFor="r_avl">R en aVL (mm)</label>
                  <input
                    id="r_avl"
                    type="number"
                    step="0.5"
                    className="input-field input-field-sm"
                    value={measurements.rAVL ?? ''}
                    onChange={(e) => handleCornellR(e.target.value)}
                  />
                </div>
                <span className="plus-sign">+</span>
                <div className="input-mini">
                  <label htmlFor="s_v3">S en V3 (mm)</label>
                  <input
                    id="s_v3"
                    type="number"
                    step="0.5"
                    className="input-field input-field-sm"
                    value={measurements.sV3 ?? ''}
                    onChange={(e) => handleCornellS(e.target.value)}
                  />
                </div>
                <span className="equal-sign">=</span>
                <div className="result-mini">
                  <span className="result-label">Cornell</span>
                  <span className={`result-value ${measurements.cornell && ((!isFemale && measurements.cornell > 28) || (isFemale && measurements.cornell > 20)) ? 'text-danger' : ''}`}>
                    {measurements.cornell ? `${measurements.cornell} mm` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
