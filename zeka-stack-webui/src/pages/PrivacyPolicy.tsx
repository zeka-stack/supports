import React from 'react';
import {AlertTriangle, Database, Eye, Lock, Server, Shield} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const PrivacyPolicy: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-700">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <Shield className="w-8 h-8 text-indigo-600"/>
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {t('privacyPolicy.title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        {t('privacyPolicy.subtitle')}
                    </p>
                </div>

                <div className="space-y-12">
                    {/* 1. 收集的信息 */}
                    <section>
                        <h2 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                            <Eye className="w-5 h-5 mr-2 text-indigo-500"/>
                            {t('privacyPolicy.section1.title')}
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <p className="mb-4 text-gray-700">
                                {t('privacyPolicy.section1.description')}
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">{t('privacyPolicy.section1.codeContext.title')}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {t('privacyPolicy.section1.codeContext.description')}
                                        <br/>
                                        <span className="text-indigo-600 font-medium">{t('privacyPolicy.section1.codeContext.note')}</span>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">{t('privacyPolicy.section1.usageStats.title')}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {t('privacyPolicy.section1.usageStats.description')}
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
                                        <li>
                                            <span className="font-medium text-gray-700">{t('privacyPolicy.section1.usageStats.featureUsage')}</span>
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-700">{t('privacyPolicy.section1.usageStats.performanceMetrics')}</span>
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-700">{t('privacyPolicy.section1.usageStats.modelInfo')}</span>
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-700">{t('privacyPolicy.section1.usageStats.tokenConsumption')}</span>
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-700">{t('privacyPolicy.section1.usageStats.entryPoints')}</span>
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-700">{t('privacyPolicy.section1.usageStats.timeDimensions')}</span>
                                        </li>
                                        <li>
                                            <span className="font-medium text-gray-700">{t('privacyPolicy.section1.usageStats.anonymousDevice')}</span>
                                        </li>
                                    </ul>
                                    <p className="mt-3 text-sm text-gray-600">
                                        <span className="text-indigo-600 font-medium">{t('privacyPolicy.section1.usageStats.noCredentials')}</span>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">{t('privacyPolicy.section1.notCollect.title')}</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
                                        <li>{t('privacyPolicy.section1.notCollect.noApiKeys')}</li>
                                        <li>{t('privacyPolicy.section1.notCollect.noCodeContent')}</li>
                                        <li>{t('privacyPolicy.section1.notCollect.noOtherData')}</li>
                                    </ul>
                                    <p className="mt-2 text-sm text-gray-600">
                                        {t('privacyPolicy.section1.notCollect.statement')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. 信息的用途 */}
                    <section>
                        <h2 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                            <Database className="w-5 h-5 mr-2 text-indigo-500"/>
                            {t('privacyPolicy.section2.title')}
                        </h2>
                        <p className="mb-4 text-gray-600">
                            {t('privacyPolicy.section2.description')}
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2"></div>
                                <span>{t('privacyPolicy.section2.usage1')}</span>
                            </li>
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2"></div>
                                <span>{t('privacyPolicy.section2.usage2')}</span>
                            </li>
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2"></div>
                                <span>{t('privacyPolicy.section2.usage3')}</span>
                            </li>
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2"></div>
                                <span>{t('privacyPolicy.section2.usage4')}</span>
                            </li>
                        </ul>
                    </section>

                    {/* 3. 数据保护 */}
                    <section>
                        <h2 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                            <Lock className="w-5 h-5 mr-2 text-indigo-500"/>
                            {t('privacyPolicy.section3.title')}
                        </h2>
                        <div className="prose prose-indigo text-gray-600 text-sm">
                            <p className="mb-3">
                                {t('privacyPolicy.section3.description')}
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>
                                    <strong>{t('privacyPolicy.section3.encryptedTransmission').split(':')[0]}：</strong>{t('privacyPolicy.section3.encryptedTransmission').split(':').slice(1).join(':')}
                                </li>
                                <li>
                                    <strong>{t('privacyPolicy.section3.localFirst').split(':')[0]}：</strong>{t('privacyPolicy.section3.localFirst').split(':').slice(1).join(':')}
                                </li>
                                <li>
                                    <strong>{t('privacyPolicy.section3.sensitiveStorage').split(':')[0]}：</strong>{t('privacyPolicy.section3.sensitiveStorage').split(':').slice(1).join(':')}
                                </li>
                                <li>
                                    <strong>{t('privacyPolicy.section3.noCodeStorage').split(':')[0]}：</strong>{t('privacyPolicy.section3.noCodeStorage').split(':').slice(1).join(':')}
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 4. 第三方服务 */}
                    <section>
                        <h2 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                            <Server className="w-5 h-5 mr-2 text-indigo-500"/>
                            {t('privacyPolicy.section4.title')}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {t('privacyPolicy.section4.description')}
                        </p>
                    </section>

                    {/* 5. 免责声明 */}
                    <section className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                        <h2 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                            <AlertTriangle className="w-5 h-5 mr-2 text-amber-600"/>
                            {t('privacyPolicy.section5.title')}
                        </h2>
                        <div className="space-y-4 text-sm text-gray-700">
                            <div>
                                <h3 className="font-bold text-gray-900">{t('privacyPolicy.section5.aiAccuracy.title')}</h3>
                                <p>
                                    {t('privacyPolicy.section5.aiAccuracy.description')}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900">{t('privacyPolicy.section5.asIsSoftware.title')}</h3>
                                <p>
                                    {t('privacyPolicy.section5.asIsSoftware.description')}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900">{t('privacyPolicy.section5.securityRisks.title')}</h3>
                                <p>
                                    {t('privacyPolicy.section5.securityRisks.description')}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-gray-200 pt-8 mt-10">
                        <p className="text-sm text-gray-400 text-center">
                            {t('privacyPolicy.lastUpdated')}{new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
