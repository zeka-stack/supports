import React from 'react';
import { Layers, Box, Cpu, ArrowLeft, GitBranch, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ModuleHeader = ({ title, subtitle, icon: Icon, color }: any) => {
  const { t } = useTranslation();
  return (
    <div className={`bg-slate-900 text-white pt-24 pb-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <a href="#/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('modules.backToStack')}
        </a>
        <div className="flex items-center gap-6">
          <div className={`p-4 rounded-2xl ${color}`}>
            <Icon className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-xl text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureList = ({ features }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
    {features.map((f: any, i: number) => (
      <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Terminal className="w-5 h-5 text-gray-600" />
          </div>
          <h3 className="font-bold text-gray-900">{f.title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{f.desc}</p>
      </div>
    ))}
  </div>
);

export const ArcoHome = () => {
  const { t } = useTranslation();
  const features = [
    { title: t('modules.arco.features.supreme.title'), desc: t('modules.arco.features.supreme.desc') },
    { title: t('modules.arco.features.builder.title'), desc: t('modules.arco.features.builder.desc') },
    { title: t('modules.arco.features.processor.title'), desc: t('modules.arco.features.processor.desc') },
    { title: t('modules.arco.features.plugin.title'), desc: t('modules.arco.features.plugin.desc') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ModuleHeader 
        title={t('modules.arco.title')} 
        subtitle={t('modules.arco.subtitle')} 
        icon={Layers} 
        color="bg-indigo-600" 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('modules.overview')}</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
                {t('modules.arco.description')}
            </p>

            <div className="flex gap-4 mb-12">
                <a href="https://github.com/zeka-stack/zeka-stack/tree/main/arco-meta" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    <GitBranch className="w-4 h-4 mr-2" /> {t('modules.viewSource')}
                </a>
                 <a href="#/feedback?project=arco-meta" className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                    {t('modules.submitRequest')}
                </a>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('modules.coreComponents')}</h2>
            <FeatureList features={features} />
        </div>
      </div>
    </div>
  );
};
