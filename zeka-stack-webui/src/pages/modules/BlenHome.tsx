import {ArrowLeft, Code2, Cpu, GitBranch} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const BlenHome = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-slate-900 text-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <a href="#/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('modules.backToStack')}
          </a>
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-blue-600">
              <Cpu className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('modules.blen.title')}</h1>
              <p className="text-xl text-slate-400">{t('modules.blen.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('modules.overview')}</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
                {t('modules.blen.description')}
            </p>

             <div className="flex gap-4 mb-12">
                <a href="https://zekastack.dong4j.site/docs/blen-kernel/" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                    {t('modules.viewDocs')}
                </a>
                <a href="https://github.com/zeka-stack/zeka-stack/tree/main/blen-kernel" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    <GitBranch className="w-4 h-4 mr-2" /> {t('modules.viewSource')}
                </a>
                 <a href="#/feedback?project=blen-kernel" className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                    {t('modules.submitRequest')}
                </a>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('modules.keyModules')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {name: t('modules.blen.features.common.title'), desc: t('modules.blen.features.common.desc')},
                    {name: t('modules.blen.features.auth.title'), desc: t('modules.blen.features.auth.desc')},
                    {name: t('modules.blen.features.web.title'), desc: t('modules.blen.features.web.desc')},
                    {name: t('modules.blen.features.validation.title'), desc: t('modules.blen.features.validation.desc')},
                    {name: t('modules.blen.features.tracer.title'), desc: t('modules.blen.features.tracer.desc')},
                    {name: t('modules.blen.features.test.title'), desc: t('modules.blen.features.test.desc')}
                ].map((m) => (
                    <div key={m.name} className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors group">
                        <div className="flex items-center gap-2 mb-2">
                            <Code2 className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
                            <h3 className="font-semibold text-gray-900">{m.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500">{m.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
