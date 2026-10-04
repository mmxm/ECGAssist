import type { QuestionNode } from '../types/ecg';
import { ECG_DIAGRAMS } from './diagrams';

/**
 * Arborescence sémiologique complète d'interprétation d'ECG (référentiel UNESS)
 * Conçue sans les mentions R2C et optimisée pour la clinique quotidienne.
 */
export const ECG_TREE: QuestionNode[] = [
  // -------------------------------------------------------------
  // 1. AXE DU CŒUR
  // -------------------------------------------------------------
  {
    id: '14266',
    label: 'Axe du cœur anormal',
    type: 'checkbox',
    description: `L'axe du cœur permet de connaître son orientation anatomique (selon la morphologie du patient), de dépister une dilatation d'une cavité (ex: dilatation du cœur droit dans l'embolie pulmonaire) ou des anomalies d'activation électrique d'une hémi-branche.
La méthode rapide consiste à regarder la polarité en D1 et aVF : l'axe normal est compris entre -30° et +90°.`,
    referenceUrl: 'ECG mesures et calcul (Axe des QRS)',
    svgDiagram: ECG_DIAGRAMS.axe,
    children: [
      {
        id: '14267',
        label: 'Axe Gauche (-30° à -90°)',
        type: 'radio',
        groupName: 'axe_coeur',
        description: 'D1 positif et aVF négatif (avec D2 négatif). Évoque notamment un hémibloc antérieur gauche (HBAG) ou une séquelle inférieure.',
      },
      {
        id: '14268',
        label: 'Axe Droit (+90° à +180°)',
        type: 'radio',
        groupName: 'axe_coeur',
        description: 'D1 négatif et aVF positif. Évoque un hémibloc postérieur gauche (HBPG), une surcharge ventriculaire droite (ex: cœur pulmonaire) ou un sujet jeune/longiligne.',
      },
      {
        id: '14269',
        label: 'Axe Extrême (-90° à -180° / Nord-Ouest)',
        type: 'radio',
        groupName: 'axe_coeur',
        description: 'D1 négatif et aVF négatif. Retrouvé dans les tachycardies ventriculaires, les cardiopathies congénitales ou les inversions d\'électrodes.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. QUALITÉ DU TRACÉ
  // -------------------------------------------------------------
  {
    id: 'section_qualite',
    label: 'Anomalie de la qualité du tracé',
    type: 'section',
    children: [
      {
        id: '14145',
        label: 'Artéfacts',
        type: 'checkbox',
        description: `Un artéfact est une anomalie du tracé liée à un élément externe à l'activité électrique cardiaque (parasites 50Hz, tremblements musculaires, électrodes mal collées).
Très fréquents, ils peuvent simuler à tort une arythmie (comme une fibrillation atriale ou une tachycardie ventriculaire).`,
        referenceUrl: 'ECG réalisation',
      },
      {
        id: '14146',
        label: "Inversion d'électrodes",
        type: 'checkbox',
        description: `Les inversions sont fréquentes, surtout sur les dérivations périphériques.
Le signe le plus classique d'inversion bras droit / bras gauche est une onde P et un QRS entièrement négatifs en DI avec une onde P positive en aVR.`,
        referenceUrl: 'ECG réalisation',
      },
      {
        id: '14147',
        label: 'Calibration anormale (vitesse ≠ 25 mm/s ou amplitude ≠ 10 mm/mV)',
        type: 'checkbox',
        description: 'La vitesse standard est de 25 mm/s (1 petit carreau = 40 ms) et l\'amplitude de 10 mm = 1 mV (1 petit carreau = 0,1 mV). Toute modification altère les mesures.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 3. RYTHME & CONDUCTION
  // -------------------------------------------------------------
  {
    id: 'section_rythme',
    label: 'Rythme & Conduction',
    type: 'section',
    children: [
      {
        id: '14149',
        label: 'Rythme sinusal normal (60 - 100 bpm)',
        type: 'checkbox',
        description: `Rythme sinusal normal :
1. Activité sinusale régulière : onde P positive en D2, D3, aVF et négative en aVR.
2. Conduction atrio-ventriculaire 1:1 : chaque onde P est suivie d'un QRS et chaque QRS est précédé d'une onde P.
3. Fréquence cardiaque de repos entre 60 et 100 bpm.`,
        referenceUrl: 'Rythme sinusal',
        svgDiagram: ECG_DIAGRAMS.normalBeat,
      },
      {
        id: '14150',
        label: 'Bradycardie / Anomalie de conduction (< 60 bpm)',
        type: 'checkbox',
        description: `Fréquence cardiaque < 60 bpm ou présence d'un bloc de conduction sur le réseau spécialisé (nœud sinusal, NAV, faisceau de His, branches).`,
        referenceUrl: 'Bradycardie : orientation diagnostique',
        children: [
          {
            id: '14153',
            label: 'Dysfonction sinusale / Bloc sino-atrial (BSA)',
            type: 'checkbox',
        imageUrl: '/illustrations/dysfonction_sinusale.png',
        imageCaption: "Référentiel CNEC : Présentation sémiologique des différentes formes de dysfonction sinusale",
            description: 'Dysfonctionnement de l\'automaticité sinusale ou de la conduction du nœud sinusal à l\'oreillette.',
            children: [
              {
                id: '14154',
                label: 'Ondes P trop lentes / Bradycardie sinusale (< 60 bpm)',
                type: 'checkbox',
                description: 'Ondes P de morphologie sinusale normale mais survenant à une fréquence inférieure à 60 bpm.',
              },
              {
                id: '14155',
                label: 'Onde P manquante (BSA 2)',
                type: 'checkbox',
        imageUrl: '/illustrations/bsa_2_onde_p_manquante.png',
        imageCaption: "Référentiel CNEC : Bloc sino-atrial du 2e degré — Onde P manquante avec pause égale à un multiple de PP",
                description: 'Pause sinusale dont la durée est un multiple exact du cycle PP de base.',
              },
              {
                id: '14156',
                label: 'Ondes P absentes (+/- P rétrogrades) (BSA 3)',
                type: 'checkbox',
        imageUrl: '/illustrations/bsa_3_echappement_jonctionnel.png',
        imageCaption: "Référentiel CNEC : Dysfonction sinusale majeure — Ondes P absentes avec échappement jonctionnel (± P' rétrogrades)",
                description: 'Arrêt de l\'activité sinusale avec rythme d\'échappement jonctionnel ou ventriculaire.',
              },
              {
                id: '14157',
                label: 'Pause sinusale > 3 secondes',
                type: 'checkbox',
        imageUrl: '/illustrations/pause_sinusale.png',
        imageCaption: "Référentiel CNEC : Pause sinusale prolongée",
                description: 'Critère de sévérité imposant souvent l\'indication d\'un stimulateur cardiaque en cas de symptômes.',
                children: [
                  {
                    id: '14158',
                    label: 'Post-réduction de tachycardie (Syndrome tachy-brady)',
                    type: 'checkbox',
                    description: 'Pause prolongée survenant immédiatement après la cessation d\'un accès de FA ou flutter (maladie de l\'oreillette).',
                  },
                ],
              },
            ],
          },
          {
            id: '14159',
            label: 'Anomalie de la conduction atrio-ventriculaire (BAV)',
            type: 'checkbox',
        imageUrl: '/illustrations/bav_resume.png',
        imageCaption: "Référentiel CNEC : Synthèse comparative de la sémiologie des blocs atrio-ventriculaires",
            description: 'Ralentissement ou interruption de la transmission de l\'influx entre oreillettes et ventricules.',
            children: [
              {
                id: '14160',
                label: 'Ondes P = QRS (Toutes ondes P conduites)',
                type: 'checkbox',
                description: 'Chaque onde P conduit à un QRS, mais avec un délai anormal.',
                children: [
                  {
                    id: '14161',
                    label: 'BAV 1 (Allongement fixe du PR > 200 ms)',
                    type: 'checkbox',
        imageUrl: '/illustrations/bav_1.png',
        imageCaption: "Référentiel CNEC : BAV 1 — Allongement fixe et constant de l'intervalle PR (> 200 ms) sans onde P bloquée",
                    description: 'PR allongé de manière constante au-delà de 200 ms (5 petits carreaux). Chaque onde P est suivie d\'un QRS.',
                  },
                ],
              },
              {
                id: '14163',
                label: 'Ondes P > QRS (Présence d\'onde(s) P bloquée(s))',
                type: 'checkbox',
                description: 'Une ou plusieurs ondes P ne sont pas transmises aux ventricules.',
                children: [
                  {
                    id: '14164',
                    label: 'Extrasystole atriale (ESA) bloquée',
                    type: 'checkbox',
                    description: 'Onde P prématurée survenant trop tôt alors que le nœud AV est encore en période réfractaire.',
                  },
                  {
                    id: '14165',
                    label: 'BAV 2 Mobitz 1 (Périodes de Wenckebach)',
                    type: 'checkbox',
        imageUrl: '/illustrations/bav_2_mobitz1.png',
        imageCaption: "Référentiel CNEC : BAV 2 Mobitz 1 (Wenckebach) — Allongement progressif du PR jusqu'à une onde P bloquée",
                    description: 'Allongement progressif de l\'intervalle PR jusqu\'à ce qu\'une onde P soit bloquée, puis le cycle reprend.',
                  },
                  {
                    id: '14166',
                    label: 'BAV 2:1',
                    type: 'checkbox',
        imageUrl: '/illustrations/bav_2_1.png',
        imageCaption: "Référentiel CNEC : BAV 2:1 — Une onde P bloquée sur deux",
                    description: 'Une onde P sur deux est conduite, une sur deux est bloquée. Peut être nodal (QRS fin) ou infranodal (QRS large).',
                  },
                  {
                    id: '14167',
                    label: 'BAV 2 Mobitz 2',
                    type: 'checkbox',
        imageUrl: '/illustrations/bav_2_mobitz2.png',
        imageCaption: "Référentiel CNEC : BAV 2 Mobitz 2 — Intervalle PR constant avec onde P bloquée inopinée (haut risque de BAV 3)",
                    description: 'Blocage inopiné d\'une onde P sans allongement préalable du PR. Indication formelle d\'appareillage.',
                  },
                  {
                    id: '14168',
                    label: 'BAV 3 (Bloc auriculo-ventriculaire complet)',
                    type: 'checkbox',
        imageUrl: '/illustrations/bav_3_complet.png',
        imageCaption: "Référentiel CNEC : BAV 3 complet — Dissociation atrio-ventriculaire complète, ondes P et QRS indépendants",
                    description: 'Dissociation auriculo-ventriculaire complète : les oreillettes battent à leur rythme propre et les ventricules à un rythme d\'échappement régulier et plus lent.',
                  },
                ],
              },
              {
                id: '14169',
                label: 'FA / Flutter / Tachycardie atriale à conduction lente',
                type: 'checkbox',
                description: 'Arythmie atriale associée à un filtre nodal sévère ou à un BAV associé.',
                children: [
                  {
                    id: '14170',
                    label: 'FA à conduction irrégulière lente (< 60 bpm)',
                    type: 'checkbox',
                    description: 'Fibrillation atriale avec réponse ventriculaire anormalement lente.',
                  },
                  {
                    id: '14172',
                    label: 'FA/Flutter avec QRS lents et parfaitement réguliers (Équivalent BAV 3)',
                    type: 'checkbox',
                    description: 'La régularité parfaite des QRS en présence de FA prouve l\'existence d\'un BAV complet avec échappement autonome.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: '14173',
        label: 'Tachycardie / Anomalie de rythme (> 100 bpm)',
        type: 'checkbox',
        description: 'Fréquence ventriculaire > 100 bpm. Démarche : régularité des QRS, largeur des QRS et analyse de l\'activité atriale.',
        children: [
          {
            id: '14175',
            label: 'QRS réguliers',
            type: 'checkbox',
            children: [
              {
                id: '14176',
                label: 'QRS fins (< 120 ms) - Tachycardie supraventriculaire (TSV)',
                type: 'checkbox',
                children: [
                  {
                    id: '14177',
                    label: 'Ondes P (ou F) > QRS : Flutter ou Tachycardie atriale',
                    type: 'checkbox',
                    description: 'Flutter : boucle d\'activation atriale (300 bpm) en toit d\'usine en D2, D3, aVF sans retour à la ligne isoélectrique.',
                    svgDiagram: ECG_DIAGRAMS.flutter,
                  },
                  {
                    id: '14178',
                    label: 'Ondes P = QRS ou ratio P/QRS indéterminable',
                    type: 'checkbox',
                    children: [
                      {
                        id: '14179',
                        label: 'Tachycardie sinusale (> 100 bpm)',
                        type: 'radio',
                        groupName: 'tsv_reguliere',
                        description: 'Ondes P sinusales normales positives en D2, D3, aVF précédant chaque QRS avec variabilité progressive.',
                      },
                      {
                        id: '14180',
                        label: 'Flutter ou Tachycardie atriale en 1:1',
                        type: 'radio',
                        groupName: 'tsv_reguliere',
                        description: 'Très rapide (autour de 250-300 bpm), chaque impulsion atriale franchit le nœud AV.',
                      },
                      {
                        id: '14181',
                        label: 'Tachycardie jonctionnelle (Maladie de Bouveret / TRIN / Rythme réciproque)',
                        type: 'radio',
                        groupName: 'tsv_reguliere',
                        description: 'Tachycardie régulière à début et fin brusques (~150-220 bpm). Réentrée intranodale ou par faisceau accessoire (Kent). Réduction par manœuvres vagales ou Adénosine.',
                      },
                      {
                        id: '14182',
                        label: 'TSV inclassable',
                        type: 'radio',
                        groupName: 'tsv_reguliere',
                        description: 'Activité atriale masquée dans l\'onde T ou le QRS non catégorisable avec certitude.',
                      },
                    ],
                  },
                ],
              },
              {
                id: '14183',
                label: 'QRS larges (≥ 120 ms)',
                type: 'checkbox',
                description: 'Toute tachycardie régulière à QRS larges est une TV jusqu\'à preuve du contraire !',
                children: [
                  {
                    id: '14185',
                    label: 'Tachycardie ventriculaire (TV) / TVNS / RIVA',
                    type: 'radio',
        imageUrl: '/illustrations/tv_fusion_capture.png',
        imageCaption: "Référentiel CNEC : Signes de certitude de TV — Complexes de fusion et de capture ventriculaire",
                    groupName: 'tachy_large',
                    description: `Arguments de certitude :
- Dissociation ventriculo-atriale (plus de QRS que d'ondes P)
- Complexes de capture ou de fusion
Arguments en faveur : cardiopathie sous-jacente, concordance positive ou négative de V1 à V6, axe extrême.`,
                  },
                  {
                    id: '14184',
                    label: 'TSV avec bloc de branche associé (aberration de conduction)',
                    type: 'radio',
                    groupName: 'tachy_large',
                    description: 'Tachycardie supraventriculaire transmise avec un bloc de branche préexistant ou fonctionnel lié à la fréquence.',
                  },
                  {
                    id: '14186',
                    label: 'Tachycardie à QRS larges inclassable',
                    type: 'radio',
                    groupName: 'tachy_large',
                    description: 'À traiter comme une TV par prudence clinique.',
                  },
                ],
              },
            ],
          },
          {
            id: '14187',
            label: 'QRS irréguliers monomorphes',
            type: 'checkbox',
            children: [
              {
                id: '14271',
                label: 'Fibrillation atriale (FA) à réponse rapide',
                type: 'checkbox',
                description: 'Rythme "anarchique" : intervalles RR complètement irréguliers sans ondes P visibles, trémulation de la ligne de base.',
              },
              {
                id: '14171',
                label: 'Flutter ou TA à conduction variable (pseudo-irrégulier)',
                type: 'checkbox',
                description: 'Filtrage nodal variable (ex: alternance de blocs 2:1, 3:1, 4:1).',
              },
            ],
          },
          {
            id: '14188',
            label: 'QRS irréguliers polymorphes (Urgence vitale)',
            type: 'checkbox',
            children: [
              {
                id: '14189',
                label: 'Fibrillation ventriculaire (FV)',
                type: 'radio',
                groupName: 'tachy_polymorphe',
                description: 'Arrêt cardiorespiratoire immédiat. Tracé désorganisé sans QRS identifiable. Choc électrique externe immédiat.',
              },
              {
                id: '14190',
                label: 'Torsade de pointes',
                type: 'radio',
                groupName: 'tachy_polymorphe',
                description: 'Tachycardie ventriculaire polymorphe avec torsion de l\'axe des pointes autour de la ligne isoélectrique, favorisée par un QT long.',
              },
              {
                id: '14191',
                label: 'Syndrome de Wolff-Parkinson-White avec FA (SuperWolff)',
                type: 'radio',
                groupName: 'tachy_polymorphe',
                description: 'FA transmise par une voie accessoire à haute cadence sans le filtre nodal : QRS très rapides, larges et polymorphes. Risque de dégénérescence en FV !',
              },
            ],
          },
          {
            id: '14192',
            label: 'Extrasystoles',
            type: 'checkbox',
        imageUrl: '/illustrations/extrasystoles_aspects.png',
        imageCaption: "Référentiel CNEC : Aspects des extrasystoles selon leur origine — Sinusale, atriale, jonctionnelle et ventriculaire",
            description: 'Battements prématurés ectopiques par rapport au rythme sinusal de base.',
            children: [
              {
                id: '14193',
                label: 'Extrasystole supraventriculaire (ESSV / ESA)',
                type: 'checkbox',
                description: 'Onde P précoce de morphologie différente, suivie en général d\'un QRS fin.',
                children: [
                  {
                    id: '14270',
                    label: 'ESA bloquée',
                    type: 'checkbox',
                    description: 'Onde P précoce non suivie de QRS car survenue en période réfractaire du NAV.',
                  },
                ],
              },
              {
                id: '14194',
                label: 'Extrasystole ventriculaire (ESV)',
                type: 'checkbox',
        imageUrl: '/illustrations/extrasystole_ventriculaire.png',
        imageCaption: "Référentiel CNEC : Extrasystole ventriculaire — QRS précoce large, sans onde P préalable, repolarisation opposée",
                description: 'Complexe prématuré à QRS large (≥ 120 ms), non précédé d\'onde P, avec pause compensatrice complète.',
              },
            ],
          },
        ],
      },
      {
        id: '14255',
        label: 'Rythme électro-entraîné (Pacemaker)',
        type: 'checkbox',
        description: 'Présence d\'artéfacts de stimulation (spikes) très fins et verticaux précédant l\'activation.',
        children: [
          {
            id: '14256',
            label: 'Stimulation atriale (Spike auriculaire avant onde P)',
            type: 'checkbox',
            description: 'Spike suivi d\'une onde P électro-induite.',
          },
          {
            id: '14257',
            label: 'Stimulation ventriculaire (Spike ventriculaire avant QRS)',
            type: 'checkbox',
            description: 'Spike suivi d\'un QRS large (aspect d\'activation ectopique de type retard gauche).',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 4. ANALYSE P, QRS, T, ST, QT
  // -------------------------------------------------------------
  {
    id: 'section_pqrs',
    label: 'Analyse P - QRS - T & Repolarisation',
    type: 'section',
    children: [
      {
        id: '14195',
        label: 'Anomalie de morphologie de l\'onde P',
        type: 'checkbox',
        children: [
          {
            id: '14196',
            label: 'Hypertrophie atriale',
            type: 'checkbox',
        imageUrl: '/illustrations/hypertrophie_atriale_p.png',
        imageCaption: "Référentiel CNEC : Morphologie de l'onde P — De gauche à droite : normale, HAD (ample pointue > 2,5 mm), HAG (large bifide ≥ 120 ms)",
            description: `• Hypertrophie atriale droite (HAD) : P > 2,5 mm en D2 ou > 2 mm en V1/V2 (P pointue).
• Hypertrophie atriale gauche (HAG) : P de durée > 120 ms (bifide en D2) ou composante négative terminale > 40 ms en V1.`,
          },
          {
            id: '14197',
            label: 'Activité atriale basse (onde P négative en D2, D3, aVF)',
            type: 'checkbox',
            description: 'Rythme du sinus coronaire ou onde P rétrograde.',
          },
        ],
      },
      {
        id: '14198',
        label: 'Préexcitation ventriculaire (Syndrome de Wolff-Parkinson-White)',
        type: 'checkbox',
        imageUrl: '/illustrations/preexcitation_wpw.png',
        imageCaption: "Référentiel CNEC : Préexcitation ventriculaire (WPW) — PR court (< 120 ms) et onde delta initiale par conduction par voie accessoire",
        description: 'Triade classique : PR court (< 120 ms), onde Delta (empâtement initial du QRS) et élargissement du QRS.',
        svgDiagram: ECG_DIAGRAMS.preexcitation,
      },
      {
        id: '14199',
        label: 'Anomalie de morphologie du QRS',
        type: 'checkbox',
        children: [
          {
            id: '14201',
            label: 'Onde Q de nécrose pathologique',
            type: 'checkbox',
        imageUrl: '/illustrations/territoires_coronaires_12d.png',
        imageCaption: "Référentiel CNEC : Territoires myocardiques selon les 12 dérivations pour la localisation d'une nécrose ou ischémie",
            description: 'Onde Q ≥ 40 ms ou profondeur ≥ 1/3 de l\'amplitude du QRS dans au moins deux dérivations d\'un même territoire.',
            children: [
              { id: '14202', label: 'Territoire Septal (V1 - V2)', type: 'checkbox' },
              { id: '14203', label: 'Territoire Apical (V3 - V4)', type: 'checkbox' },
              { id: '14204', label: 'Territoire Latéral bas (V5 - V6)', type: 'checkbox' },
              { id: '14205', label: 'Territoire Antérieur étendu (V1 - V6)', type: 'checkbox' },
              { id: '14206', label: 'Territoire Latéral haut (D1, aVL)', type: 'checkbox' },
              { id: '14207', label: 'Territoire Inférieur (D2, D3, aVF)', type: 'checkbox' },
            ],
          },
          {
            id: '14208',
            label: 'Bloc de branche & troubles de conduction intra-ventriculaires',
            type: 'checkbox',
            children: [
              {
                id: '14209',
                label: 'Bloc de branche droit incomplet (BBDi, QRS 100-120 ms)',
                type: 'checkbox',
                description: 'Aspect RsR\' en V1 avec onde S traînante en V6, mais durée de QRS entre 100 et 120 ms.',
              },
              {
                id: '14210',
                label: 'Bloc de branche droit complet (BBD, QRS ≥ 120 ms)',
                type: 'checkbox',
        imageUrl: '/illustrations/bbd_complet.png',
        imageCaption: "Référentiel CNEC : Bloc de branche droit complet — Aspect rSR' en V1 et onde S large (qrS) en V6 (QRS ≥ 120 ms)",
                description: 'QRS ≥ 120 ms, aspect typique en "oreilles de lapin" rSR\' en V1 et S large et arrondie en V6.',
                svgDiagram: ECG_DIAGRAMS.bbd,
              },
              {
                id: '14211',
                label: 'Hémibloc antérieur gauche (HBAG / BFAG)',
                type: 'checkbox',
        imageUrl: '/illustrations/hbag_hemibloc.png',
        imageCaption: "Référentiel CNEC : Hémibloc antérieur gauche — Déviation axiale gauche (≤ -30°), aspect qR en DI et rS en DII/DIII/aVF",
                description: 'Axe hypergauche du QRS (< -30°), QRS fin ou peu élargi, aspect qR en D1 et rS en D2, D3, aVF.',
              },
              {
                id: '14212',
                label: 'Hémibloc postérieur gauche (HBPG / BFPG)',
                type: 'checkbox',
        imageUrl: '/illustrations/hbpg_hemibloc.png',
        imageCaption: "Référentiel CNEC : Hémibloc postérieur gauche — Déviation axiale droite (≥ +90°), aspect rS en DI et qR en DII/DIII/aVF",
                description: 'Axe droit (> +90°), aspect S1Q3 avec rS en D1 et qR en D2, D3, aVF (diagnostic d\'élimination).',
              },
              {
                id: '14213',
                label: 'Bloc de branche gauche complet (BBG, QRS ≥ 120 ms)',
                type: 'checkbox',
        imageUrl: '/illustrations/bbg_complet.png',
        imageCaption: "Référentiel CNEC : Bloc de branche gauche complet — Aspect rS ou QS élargi en V1, onde R large crochetée en plateau sans onde Q en V6",
                description: 'QRS ≥ 120 ms, négatif en V1 (QS ou rS), aspect large avec notch/dôme en V6, D1, aVL.',
                svgDiagram: ECG_DIAGRAMS.bbg,
              },
            ],
          },
          {
            id: '14214',
            label: 'Élargissement du QRS par rythme d\'échappement ventriculaire',
            type: 'checkbox',
            description: 'Activation ventriculaire de proche en proche hors des voies de Purkinje.',
          },
          {
            id: '14263',
            label: 'Élargissement du QRS évocateur d\'une hyperkaliémie',
            type: 'checkbox',
            description: 'Signe de gravité extrême : élargissement progressif du QRS fusionnant avec l\'onde T en onde sinusoïdale.',
            svgDiagram: ECG_DIAGRAMS.hyperkaliemie,
          },
          {
            id: '14215',
            label: 'Anomalie d\'amplitude des QRS (Hypertrophie / Microvoltage)',
            type: 'checkbox',
            children: [
              {
                id: '14216',
                label: 'Hypertrophie ventriculaire gauche (HVG)',
                type: 'checkbox',
                description: `• Indice de Sokolow-Lyon : S(V1) + R(V5 ou V6) > 35 mm.
• Indice de Cornell : R(aVL) + S(V3) > 28 mm (Homme) ou > 20 mm (Femme).`,
              },
              {
                id: '14223',
                label: 'Hypertrophie ventriculaire droite (HVD)',
                type: 'checkbox',
                description: 'Déviation axiale droite (> +90°), grande onde R en V1 (> 6 mm) et onde S profonde en V5/V6 (> 7 mm).',
              },
              {
                id: '14224',
                label: 'Microvoltage diffus',
                type: 'checkbox',
                description: 'QRS ≤ 5 mm dans toutes les dérivations périphériques et ≤ 10 mm en précordiales (épanchement péricardique, obésité, BPCO).',
              },
            ],
          },
        ],
      },
      {
        id: '14225',
        label: 'Anomalie du point J ou du segment ST',
        type: 'checkbox',
        description: 'La déviation du segment ST se mesure impérativement au point J (jonction entre la fin du QRS et le début du ST).',
        children: [
          {
            id: '14226',
            label: 'Variantes de la normale (Physiologiques)',
            type: 'checkbox',
            children: [
              {
                id: '14227',
                label: 'Sus-décalage physiologique antérieur (Repolarisation masculine)',
                type: 'checkbox',
                description: 'Sus-décalage concave vers le haut, stable dans le temps, fréquent chez l\'homme jeune en V1-V3.',
              },
              {
                id: '14228',
                label: 'Repolarisation précoce (Onde J inféro-latérale)',
                type: 'checkbox',
                description: 'Surélévation du point J ≥ 1 mm avec aspect d\'encoche ("notch") ou d\'empâtement ("slur") en V4-V6 et/ou dérivations inférieures.',
              },
            ],
          },
          {
            id: '14229',
            label: 'Sus-décalage pathologique de ST (ST+)',
            type: 'checkbox',
            description: 'Nouveau sus-décalage au point J dans ≥ 2 dérivations contiguës (≥ 1 mm, ou ≥ 2 mm en V2-V3 chez l\'homme).',
            svgDiagram: ECG_DIAGRAMS.stElevation,
            children: [
              {
                id: '14230',
                label: 'Syndrome Coronarien Aigu avec sus-décalage ST (SCA ST+ / Infarctus)',
                type: 'checkbox',
        imageUrl: '/illustrations/territoires_coronaires_12d.png',
        imageCaption: "Référentiel CNEC : Territoires coronaires sur l'ECG 12D pour le repérage de l'artère coupable et du miroir",
                description: 'Sus-décalage convexe vers le haut (onde de Pardee), localisé à un territoire coronaire avec image en miroir.',
                children: [
                  { id: '14231', label: 'Septal (V1 - V2)', type: 'checkbox' },
                  { id: '14232', label: 'Apical (V3 - V4)', type: 'checkbox' },
                  { id: '14233', label: 'Latéral bas (V5 - V6)', type: 'checkbox' },
                  { id: '14234', label: 'Antérieur étendu (V1 - V6)', type: 'checkbox' },
                  { id: '14235', label: 'Latéral haut (D1, aVL)', type: 'checkbox' },
                  { id: '14236', label: 'Inférieur (D2, D3, aVF)', type: 'checkbox' },
                  { id: '14237', label: 'Postérieur / Basal (V7 - V8 - V9)', type: 'checkbox' },
                  { id: '14238', label: 'Ventricule Droit (V3R, V4R)', type: 'checkbox' },
                ],
              },
              {
                id: '14239',
                label: 'Péricardite aiguë / Myocardite',
                type: 'checkbox',
                description: 'Sus-décalage diffus, concave vers le haut, sans miroir, sans onde Q de nécrose, souvent associé à un sous-décalage du segment PQ.',
              },
              {
                id: '14240',
                label: 'Aspect ou Syndrome de Brugada (Type 1)',
                type: 'checkbox',
                description: 'Point J surélevé ≥ 2 mm en V1-V2 avec ST convexe en dôme englobant une onde T négative.',
                svgDiagram: ECG_DIAGRAMS.brugada,
              },
              {
                id: '14260',
                label: 'Anévrysme ventriculaire',
                type: 'checkbox',
                description: 'Persistance anormale d\'un sus-décalage de ST plusieurs mois après un infarctus du myocarde.',
              },
            ],
          },
          {
            id: '14241',
            label: 'Sous-décalage pathologique de ST (ST-)',
            type: 'checkbox',
            description: 'Sous-décalage horizontal ou descendant ≥ 1 mm dans au moins deux dérivations contiguës.',
            children: [
              {
                id: '14242',
                label: 'Ischémie myocardique sous-endocardique (dont miroir de SCA ST+)',
                type: 'checkbox',
                description: 'Sous-décalage horizontal ou descendant. Toujours rechercher un ST+ en miroir (notamment en dérivations postérieures V7-V9).',
              },
              {
                id: '14243',
                label: 'Secondaire à une hypertrophie ventriculaire (Surcharge VG)',
                type: 'checkbox',
                description: 'Sous-décalage asymétrique avec onde T négative dans les dérivations latérales (V5-V6, D1-aVL).',
              },
            ],
          },
          {
            id: '14245',
            label: 'Anomalies de repolarisation secondaire à un QRS large (Discordance appropriée)',
            type: 'checkbox',
        imageUrl: '/illustrations/bbg_discordance_appropriee.png',
        imageCaption: "Référentiel CNEC : Discordance appropriée du segment ST et de l'onde T en présence d'un bloc de branche gauche",
            description: 'En cas de bloc de branche ou d\'activation ventriculaire large, le segment ST et l\'onde T sont naturellement de polarité opposée au QRS principal.',
          },
          {
            id: '14244',
            label: 'Anomalie de repolarisation évocatrice d\'une hypokaliémie',
            type: 'checkbox',
            description: 'Sous-décalage diffus du ST, aplatissement de l\'onde T, onde U proéminente et allongement apparent du QT (QU).',
          },
        ],
      },
      {
        id: '14246',
        label: 'Anomalie de l\'onde T',
        type: 'checkbox',
        children: [
          {
            id: '14247',
            label: 'Ondes T négatives, bifides ou plates pathologiques',
            type: 'checkbox',
            description: 'L\'onde T doit normalement être positive sur tout l\'ECG sauf en aVR et V1 (et parfois D3 de façon isolée). Deux ondes T négatives contiguës sont pathologiques.',
          },
          {
            id: '14265',
            label: 'Ondes T négatives en V1-V3 évocatrices d\'une Embolie Pulmonaire',
            type: 'checkbox',
            description: 'Surcharge aiguë du cœur droit : tachycardie sinusale, aspect S1Q3T3 (onde S en D1, onde Q en D3, onde T négative en D3) et T négatives antérieures.',
          },
          {
            id: '14248',
            label: 'Ondes T amples (> 75% du QRS)',
            type: 'checkbox',
            description: 'Ondes T géantes d\'ischémie suraiguë ou secondaires.',
          },
          {
            id: '14264',
            label: 'Ondes T amples, pointues et symétriques d\'Hyperkaliémie',
            type: 'checkbox',
            description: 'Aspect typique en "tente d\'officier" à base étroite, symétrique, signe précoce d\'hyperkaliémie menaçante.',
            svgDiagram: ECG_DIAGRAMS.hyperkaliemie,
          },
          {
            id: '14249',
            label: 'Onde U anormale (Onde U > onde T)',
            type: 'checkbox',
            description: 'Évoque en premier lieu une hypokaliémie sévère.',
          },
        ],
      },
      {
        id: '14250',
        label: 'Anomalie de durée de l\'intervalle QT',
        type: 'checkbox',
        imageUrl: '/illustrations/intervalles_mesure_qt.png',
        imageCaption: "Référentiel CNEC : Mesure rigoureuse de l'intervalle QT par la méthode de la tangente à l'onde T et repères d'intervalles",
        children: [
          {
            id: '14254',
            label: 'QTc Long (> 450 ms H / > 460 ms F, sévère si ≥ 500 ms)',
            type: 'checkbox',
        imageUrl: '/illustrations/intervalles_mesure_qt.png',
        imageCaption: "Référentiel CNEC : Mesure du QT et repères cliniques (allongement pathologique si > 450 ms H / > 460 ms F)",
            description: `Risque majeur de Torsade de pointes et mort subite.
Causes : hypokaliémie, hypocalcémie, médicaments (antiarythmiques, psychotropes, macrolides...), bradycardie, QT long congénital.`,
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 5. CONCLUSION : ECG NORMAL
  // -------------------------------------------------------------
  {
    id: '14258',
    label: 'ECG strictement normal',
    type: 'checkbox',
    description: `Pour affirmer qu'un ECG est normal, il faut vérifier :
1. Rythme sinusal régulier entre 60 et 100 bpm.
2. Axe du cœur normal (entre -30° et +90°).
3. Conduction normale : PR 120-200 ms, QRS < 100-120 ms, QT corrigé normal.
4. Absence d'onde Q de nécrose, absence d'hypertrophie.
5. Repolarisation normale : pas de sus/sous-décalage de ST, ondes T positives concordantes.`,
    svgDiagram: ECG_DIAGRAMS.normalBeat,
  },
];
