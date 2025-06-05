
import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelected, disabled }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={openFileDialog}
        disabled={disabled}
        className="touch-target border-gray-300 hover:border-[var(--whatsapp-green)] transition-colors"
        title="Enviar comprovante"
      >
        <Camera className="w-5 h-5 mr-2" />
        <span className="text-sm">Câmera</span>
      </Button>
    </>
  );
}
