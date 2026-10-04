/**
 * Schémas vectoriels SVG autonomes représentant les anomalies électrocardiographiques
 * Conçus pour être 100% lisibles et fonctionnels hors-ligne sans aucune image externe.
 */

export const ECG_DIAGRAMS = {
  // Axe du cœur : cadrans D1 / aVF
  axe: `
    <svg viewBox="0 0 300 200" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="100" r="80" fill="none" stroke="#cbd5e1" stroke-width="2" />
      <line x1="50" y1="100" x2="250" y2="100" stroke="#94a3b8" stroke-dasharray="3,3" />
      <line x1="150" y1="20" x2="150" y2="180" stroke="#94a3b8" stroke-dasharray="3,3" />
      <!-- Axe normal (-30° à +90°) -->
      <path d="M 150 100 L 220 60 A 80 80 0 0 1 150 180 Z" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" stroke-width="1.5" />
      <text x="210" y="130" font-size="11" fill="#15803d" font-weight="bold">Normal (-30° à +90°)</text>
      <!-- Axe gauche (-30° à -90°) -->
      <path d="M 150 100 L 220 60 A 80 80 0 0 0 150 20 Z" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" stroke-width="1.5" />
      <text x="170" y="45" font-size="10" fill="#c2410c">Axe Gauche</text>
      <!-- Axe droit (+90° à +180°) -->
      <path d="M 150 100 L 70 100 A 80 80 0 0 0 150 180 Z" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" stroke-width="1.5" />
      <text x="80" y="150" font-size="10" fill="#1d4ed8">Axe Droit</text>
      <!-- Axe extrême -->
      <path d="M 150 100 L 70 100 A 80 80 0 0 1 150 20 Z" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="1.5" />
      <text x="75" y="45" font-size="10" fill="#b91c1c">Extrême</text>
      <text x="255" y="104" font-size="11" fill="#475569" font-weight="bold">D1 (+)</text>
      <text x="140" y="195" font-size="11" fill="#475569" font-weight="bold">aVF (+)</text>
    </svg>
  `,

  // Tracé normal avec intervalles P, PR, QRS, ST, T, QT
  normalBeat: `
    <svg viewBox="0 0 400 120" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fed7aa" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="120" fill="#fffaf5" />
      <rect width="400" height="120" fill="url(#grid)" />
      <!-- Tracé ECG standard -->
      <path d="M 20 80 L 70 80 C 80 80 85 65 95 65 C 105 65 110 80 120 80 L 150 80 L 155 85 L 165 20 L 175 105 L 180 80 L 220 80 C 235 80 245 50 265 50 C 285 50 295 80 310 80 L 380 80" 
            fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Annotations -->
      <text x="92" y="58" font-size="11" font-weight="bold" fill="#0369a1">P</text>
      <text x="145" y="98" font-size="10" font-weight="bold" fill="#0369a1">Q</text>
      <text x="160" y="15" font-size="11" font-weight="bold" fill="#0369a1">R</text>
      <text x="175" y="115" font-size="10" font-weight="bold" fill="#0369a1">S</text>
      <text x="260" y="42" font-size="11" font-weight="bold" fill="#0369a1">T</text>
      <!-- Intervalles repères -->
      <line x1="70" y1="108" x2="155" y2="108" stroke="#0284c7" stroke-width="1.5" />
      <text x="95" y="118" font-size="10" fill="#0284c7">PR (120-200ms)</text>
    </svg>
  `,

  // Pré-excitation / Wolff-Parkinson-White
  preexcitation: `
    <svg viewBox="0 0 320 120" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="120" fill="#f8fafc" rx="6" />
      <path d="M 30 80 C 45 80 50 65 60 65 C 70 65 75 80 85 80 L 95 80 L 115 50 L 125 15 L 135 100 L 140 80 L 175 80 C 190 80 200 60 215 60 C 230 60 240 80 250 80 L 300 80" 
            fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" />
      <!-- Onde Delta -->
      <path d="M 95 80 L 115 50" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
      <text x="75" y="45" font-size="11" fill="#b45309" font-weight="bold">Onde Delta (empâtement)</text>
      <text x="35" y="105" font-size="10" fill="#475569">PR court &lt; 120 ms</text>
    </svg>
  `,

  // Bloc de branche droit (RsR' en V1)
  bbd: `
    <svg viewBox="0 0 300 120" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="120" fill="#f8fafc" rx="6" />
      <path d="M 30 80 C 45 80 50 70 58 70 C 66 70 70 80 80 80 L 95 80 L 105 45 L 115 75 L 130 20 L 142 95 L 150 80 C 165 80 175 95 190 95 C 205 95 215 80 230 80 L 280 80" 
            fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />
      <text x="100" y="35" font-size="10" fill="#1e40af" font-weight="bold">r</text>
      <text x="110" y="88" font-size="10" fill="#1e40af" font-weight="bold">s</text>
      <text x="127" y="15" font-size="11" fill="#1e40af" font-weight="bold">R' (Oreille de lapin)</text>
      <text x="175" y="112" font-size="10" fill="#475569">Onde T inversée (V1)</text>
    </svg>
  `,

  // Bloc de branche gauche (Aspect en plateau / Notch en V6, DI)
  bbg: `
    <svg viewBox="0 0 300 120" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="120" fill="#f8fafc" rx="6" />
      <path d="M 30 80 C 45 80 50 70 58 70 C 66 70 70 80 80 80 L 100 80 L 115 25 L 125 32 L 135 20 L 150 85 L 155 80 C 170 80 180 95 200 95 C 215 95 225 80 240 80 L 280 80" 
            fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="125" cy="27" r="14" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2,2" />
      <text x="142" y="25" font-size="11" fill="#b45309" font-weight="bold">Notch / double dôme</text>
      <text x="80" y="105" font-size="10" fill="#475569">QRS large &gt; 120 ms + T négative en V6/DI</text>
    </svg>
  `,

  // Sus-décalage de ST (SCA ST+ / Pardee)
  stElevation: `
    <svg viewBox="0 0 300 120" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="120" fill="#fef2f2" rx="6" />
      <!-- Ligne de base isoélectrique -->
      <line x1="20" y1="80" x2="280" y2="80" stroke="#fca5a5" stroke-dasharray="3,3" />
      <!-- Tracé avec onde de Pardee -->
      <path d="M 30 80 C 45 80 50 70 60 70 C 70 70 75 80 85 80 L 95 80 L 105 15 L 120 45 C 135 45 155 40 170 50 C 190 65 205 80 220 80 L 280 80" 
            fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
      <!-- Flèche point J -->
      <circle cx="120" cy="45" r="4" fill="#dc2626" />
      <text x="126" y="42" font-size="11" fill="#991b1b" font-weight="bold">Point J sus-décalé</text>
      <text x="135" y="25" font-size="11" fill="#dc2626" font-weight="bold">Onde de Pardee (ST+)</text>
      <text x="40" y="105" font-size="10" fill="#7f1d1d">≥ 1-2 mm dans ≥ 2 dérivations contiguës</text>
    </svg>
  `,

  // Flutter atrial (toit d'usine 300 bpm)
  flutter: `
    <svg viewBox="0 0 320 120" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="120" fill="#f8fafc" rx="6" />
      <!-- Ondes F en dents de scie -->
      <path d="M 20 70 L 40 50 L 55 75 L 75 50 L 90 75 L 110 50 L 120 85 L 125 15 L 133 90 L 140 75 L 160 50 L 175 75 L 195 50 L 210 75 L 225 85 L 230 15 L 238 90 L 245 75 L 265 50 L 280 75 L 300 50" 
            fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" />
      <text x="45" y="35" font-size="11" fill="#0e7490" font-weight="bold">Ondes F en "dents de scie" (300 bpm)</text>
      <text x="45" y="110" font-size="10" fill="#475569">Pas de ligne isoélectrique en D2-D3-aVF</text>
    </svg>
  `,

  // Hyperkaliémie (Onde T pointue, symétrique, base étroite)
  hyperkaliemie: `
    <svg viewBox="0 0 300 120" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="120" fill="#f8fafc" rx="6" />
      <path d="M 30 80 C 45 80 50 72 58 72 C 66 72 70 80 80 80 L 100 80 L 110 30 L 120 95 L 130 80 L 160 80 L 180 18 L 200 80 L 270 80" 
            fill="none" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round" />
      <text x="155" y="14" font-size="11" fill="#c2410c" font-weight="bold">Onde T pointue & symétrique</text>
      <text x="60" y="110" font-size="10" fill="#475569">T tentes d'officier + QRS élargi si K+ très élevé</text>
    </svg>
  `,

  // Syndrome de Brugada (Dôme ST convexe en V1-V2)
  brugada: `
    <svg viewBox="0 0 300 120" class="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="120" fill="#f8fafc" rx="6" />
      <path d="M 30 80 L 80 80 L 95 30 L 105 60 C 115 45 135 45 150 65 C 160 80 170 100 185 100 C 195 100 205 80 215 80 L 270 80" 
            fill="none" stroke="#b91c1c" stroke-width="2.5" stroke-linecap="round" />
      <text x="110" y="32" font-size="11" fill="#991b1b" font-weight="bold">ST convexe en dôme &gt; 2 mm</text>
      <text x="165" y="115" font-size="10" fill="#475569">Onde T négative consécutive (V1-V2)</text>
    </svg>
  `,
};
