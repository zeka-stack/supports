import {ArrowLeft, Box, GitBranch, Zap} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const CuboHome = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-slate-900 text-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <a href="#/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('modules.backToStack')}
          </a>
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-amber-500">
              <Box className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('modules.cubo.title')}</h1>
              <p className="text-xl text-slate-400">{t('modules.cubo.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('modules.overview')}</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
                {t('modules.cubo.description')}
            </p>

             <div className="flex gap-4 mb-12">
                <a href="https://zekastack.dong4j.site/docs/cubo-starter/" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                    {t('modules.viewDocs')}
                </a>
                <a href="https://github.com/zeka-stack/zeka-stack/tree/main/cubo-starter" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    <GitBranch className="w-4 h-4 mr-2" /> {t('modules.viewSource')}
                </a>
                 <a href="#/feedback?project=cubo-starter" className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                    {t('modules.submitRequest')}
                </a>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('modules.starterCatalog')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    {name: t('modules.cubo.features.mybatis.title'), desc: t('modules.cubo.features.mybatis.desc')},
                    {name: t('modules.cubo.features.rest.title'), desc: t('modules.cubo.features.rest.desc')},
                    {name: t('modules.cubo.features.logsystem.title'), desc: t('modules.cubo.features.logsystem.desc')},
                    {name: t('modules.cubo.features.openapi.title'), desc: t('modules.cubo.features.openapi.desc')},
                    {name: t('modules.cubo.features.messaging.title'), desc: t('modules.cubo.features.messaging.desc')},
                    {name: t('modules.cubo.features.launcher.title'), desc: t('modules.cubo.features.launcher.desc')}
                ].map((m) => (
                    <div key={m.name} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors">
                         <div className="mt-1">
                             <Zap className="w-5 h-5 text-amber-500" />
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-900 mb-1">{m.name}</h3>
                             <p className="text-sm text-gray-600">{m.desc}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
