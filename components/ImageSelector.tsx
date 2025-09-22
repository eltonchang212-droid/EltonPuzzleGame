import React, { useContext, useRef } from 'react';
import { LanguageContext } from '../App';
import { BUILT_IN_IMAGES, TRANSLATIONS } from '../constants';

interface ImageSelectorProps {
  onImageSelect: (imageUrl: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelect }) => {
  const context = useContext(LanguageContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!context) return null;
  const { t } = context;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">{t('selectImage')}</h2>
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('builtInImages')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {BUILT_IN_IMAGES.map((image) => (
            <div key={image.name} className="cursor-pointer group" onClick={() => onImageSelect(image.src)}>
              <img 
                src={image.src} 
                alt={t(image.name as keyof typeof TRANSLATIONS.en)}
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl group-hover:scale-105 transform transition-all duration-300" 
              />
              <p className="text-center mt-2 text-sm font-medium">{t(image.name as keyof typeof TRANSLATIONS.en)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-4">{t('uploadYourOwn')}</h3>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleUploadClick}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          {t('uploadButton')}
        </button>
      </div>
    </div>
  );
};

export default ImageSelector;