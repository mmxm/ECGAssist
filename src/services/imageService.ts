/**
 * Service de traitement et compression d'image côté client pour l'ECG
 * Optimise la photo pour le rendu PDF et le stockage local sans ralentir le navigateur
 */

export async function compressAndOptimizeECGImage(file: File, maxWidth = 2400, maxHeight = 1800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calcul du redimensionnement proportionnel si nécessaire
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Impossible de créer le contexte 2D'));
          return;
        }

        // Rendu net sur fond blanc
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Compression JPEG haute qualité (0.85)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
}
