import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { compressAndOptimizeECGImage } from '../services/imageService';

interface ECGPhotoUploaderProps {
  ecgImage: string | null;
  onImageChange: (imageDataUrl: string | null) => void;
}

export const ECGPhotoUploader: React.FC<ECGPhotoUploaderProps> = ({ ecgImage, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFullViewer, setShowFullViewer] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessing(true);
      const optimizedDataUrl = await compressAndOptimizeECGImage(file);
      onImageChange(optimizedDataUrl);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de l\'optimisation de l\'image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <section className="card photo-card">
      <div className="card-header-clean">
        <div className="card-title-group">
          <ImageIcon className="text-sky-600" size={18} />
          <h2 className="card-title">Photo du Tracé ECG</h2>
        </div>
        <span className="info-tag">Sera incluse en page 2 du rapport PDF</span>
      </div>

      {!ecgImage ? (
        <div
          className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
        >
          {/* Input fichier général */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {/* Input spécifique caméra mobile */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="upload-prompt">
            <div className="upload-icon-circle">
              <Upload size={22} className="text-sky-600" />
            </div>

            <p className="upload-title">
              {isProcessing ? 'Traitement du tracé...' : 'Glissez-déposez la photo de l\'ECG ici'}
            </p>
            <p className="upload-subtitle">Format JPG, PNG haute résolution</p>

            <div className="upload-buttons-row">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                <Upload size={14} />
                <span>Parcourir les fichiers</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isProcessing}
              >
                <Camera size={14} />
                <span>Prendre en photo</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="image-preview-container">
          <div className="image-thumbnail-wrapper" onClick={() => setShowFullViewer(true)}>
            <img src={ecgImage} alt="Tracé ECG importé" className="image-thumbnail" />
            <div className="image-overlay">
              <Maximize2 size={24} className="text-white" />
              <span>Agrandir</span>
            </div>
          </div>

          <div className="image-preview-actions">
            <p className="image-status-text">
              ✓ Tracé enregistré • Intégration pleine page prête
            </p>
            <div className="actions-cluster">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowFullViewer(true)}
              >
                <Maximize2 size={14} />
                <span>Agrandir</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                <span>Changer</span>
              </button>

              <button
                type="button"
                className="btn btn-danger-soft btn-sm"
                onClick={() => onImageChange(null)}
                title="Supprimer la photo"
              >
                <Trash2 size={14} />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal plein écran pour l'examen du tracé */}
      {showFullViewer && ecgImage && (
        <div className="modal-backdrop" onClick={() => setShowFullViewer(false)}>
          <div className="viewer-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="viewer-header">
              <h3 className="viewer-title">Aperçu du Tracé ECG</h3>
              <button
                type="button"
                className="btn-icon-close"
                onClick={() => setShowFullViewer(false)}
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="viewer-body">
              <img src={ecgImage} alt="Tracé ECG plein écran" className="viewer-full-image" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
