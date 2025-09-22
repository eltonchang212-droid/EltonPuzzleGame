
import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import { Language } from '../types';

const Header: React.FC = () => {
  const context = useContext(LanguageContext);

  if (!context) return null;
  const { language, setLanguage, t } = context;

  const toggleLanguage = () => {
    setLanguage(lang => lang === Language.EN ? Language.ZH : Language.EN);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
        {t('title')}
      </h1>
      <button
        onClick={toggleLanguage}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {language === Language.EN ? '中文' : 'English'}
      </button>
    </header>
  );
};

export default Header;
