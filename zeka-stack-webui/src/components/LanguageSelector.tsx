import {Globe} from 'lucide-react';
import {useTranslation} from 'react-i18next';

const languages = [
    {code: 'zh-CN', name: '简体中文', flag: '🇨🇳'},
    {code: 'en-US', name: 'English', flag: '🇺🇸'}
];

export const LanguageSelector: React.FC = () => {
    const {i18n} = useTranslation();
    const currentLanguage = i18n.language;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Globe className="w-4 h-4"/>
                <span className="text-sm font-medium">
          {languages.find(l => l.code === currentLanguage)?.flag || '🌐'}
        </span>
            </button>
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                currentLanguage === lang.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                            }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                            {currentLanguage === lang.code && (
                                <span className="ml-auto text-indigo-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
