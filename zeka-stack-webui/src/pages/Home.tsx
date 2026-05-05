import React from 'react';
import { ArrowRight, Layers, Box, Cpu, Grid, Server, Activity, CheckCircle2, Zap, Shield, Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LayerCard = ({ title, description, icon: Icon, color, delay, href }: { title: string, description: string, icon: any, color: string, delay: string, href?: string }) => {
  const { t } = useTranslation();
  return (
    <div className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300 animate-fade-in-up`} style={{ animationDelay: delay }}>
      <div className={`p-3 rounded-lg w-fit mb-4 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-4 min-h-[48px]">
        {description}
      </p>
      <a href={href || "#"} className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
        {t('home.learnMore')} <ArrowRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  );
};

export const Home = () => {
  const { t } = useTranslation();
  const [version, setVersion] = React.useState<string>('v1.0.0');
  const [status, setStatus] = React.useState<'initial' | 'success' | 'error'>('initial');

  React.useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/framework/version');
        if (response.ok) {
          const text = await response.text();
          setVersion('v' + text.trim());
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    fetchVersion();
    const interval = setInterval(fetchVersion, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDotColors = () => {
    if (status === 'success') {
      return {ping: 'bg-green-400', dot: 'bg-green-500'};
    } else if (status === 'error') {
      return {ping: 'bg-red-400', dot: 'bg-red-500'};
    }
    return {ping: 'bg-indigo-400', dot: 'bg-indigo-500'};
  };

  const dotColors = getDotColors();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors.ping}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors.dot}`}></span>
            </span>
            {version} {t('home.nowAvailable')}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Zeka Stack</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('home.heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://zekastack.dong4j.site/docs/" target="_blank" rel="noreferrer" className="px-8 py-4 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-500/25">
              {t('home.docsSite')}
            </a>
            <a href="#/plugins/engine" className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25">
              {t('home.explorePlugins')}
            </a>
            <a href="https://github.com/zeka-stack/zeka-stack" target="_blank" rel="noreferrer" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-lg font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
              {t('home.githubSource')}
            </a>
          </div>
        </div>
      </section>

      {/* Architecture Layers */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.coreArchitecture')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t('home.coreArchitectureDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LayerCard
              title={t('modules.arco.title')}
              description={t('modules.arco.subtitle')}
              icon={Layers}
              color="bg-indigo-600"
              delay="0ms"
              href="#/modules/arco"
            />
            <LayerCard
              title={t('modules.blen.title')}
              description={t('modules.blen.subtitle')}
              icon={Cpu}
              color="bg-blue-600"
              delay="100ms"
              href="#/modules/blen"
            />
            <LayerCard
              title={t('modules.cubo.title')}
              description={t('modules.cubo.subtitle')}
              icon={Box}
              color="bg-amber-500"
              delay="200ms"
              href="#/modules/cubo"
            />
            <LayerCard
              title={t('modules.domi.title')}
              description={t('modules.domi.description')}
              icon={Grid}
              color="bg-emerald-600"
              delay="300ms"
            />
            <LayerCard
              title={t('modules.eiko.title')}
              description={t('modules.eiko.description')}
              icon={Server}
              color="bg-purple-600"
              delay="400ms"
            />
            <LayerCard
              title={t('modules.felo.title')}
              description={t('modules.felo.description')}
              icon={Activity}
              color="bg-rose-500"
              delay="500ms"
            />
          </div>
        </div>
      </section>
      {/* Why Zeka Stack */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('home.whyZeka.title')}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {t('home.whyZeka.desc')}
              </p>
              
              <div className="space-y-6">
                {[
                  { title: t('home.whyZeka.standards.title'), desc: t('home.whyZeka.standards.desc') },
                  { title: t('home.whyZeka.cloud.title'), desc: t('home.whyZeka.cloud.desc') },
                  { title: t('home.whyZeka.ai.title'), desc: t('home.whyZeka.ai.desc') }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-8 rounded-2xl flex flex-col h-full hover:shadow-md transition-shadow">
                  <Zap className="w-8 h-8 text-indigo-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{t('home.benefits.performance.title')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t('home.benefits.performance.desc')}</p>
                </div>
                <div className="bg-purple-50 p-8 rounded-2xl flex flex-col h-full hover:shadow-md transition-shadow">
                  <Shield className="w-8 h-8 text-purple-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{t('home.benefits.security.title')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t('home.benefits.security.desc')}</p>
                </div>
                <div className="bg-emerald-50 p-8 rounded-2xl flex flex-col h-full hover:shadow-md transition-shadow">
                  <Code2 className="w-8 h-8 text-emerald-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{t('home.benefits.developer.title')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t('home.benefits.developer.desc')}</p>
                </div>
                <div className="bg-amber-50 p-8 rounded-2xl flex flex-col h-full hover:shadow-md transition-shadow">
                  <Layers className="w-8 h-8 text-amber-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{t('home.benefits.modular.title')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t('home.benefits.modular.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <h2 className="text-3xl font-bold mb-6">{t('home.integration.title')}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg" dangerouslySetInnerHTML={{ __html: t('home.integration.desc') }} />
            <a href="#/plugin" className="inline-flex items-center px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-indigo-50 transition-all transform hover:scale-105">
                {t('home.integration.cta')} <ArrowRight className="w-5 h-5 ml-2" />
            </a>
        </div>
      </section>
    </div>
  );
};