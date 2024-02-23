import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-chained-backend'
import FsBackend from 'i18next-fs-backend'
import HttpApi from 'i18next-http-backend'

void i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: false,
    ns: [
      'common',
      'home'
    ],
    partialBundledLanguages: true,
    supportedLngs: [
      'en',
      'es'
    ],
    initImmediate: true,
    load: 'languageOnly',
    backend: {
      backends: [
        HttpApi,
        FsBackend
      ],
      backendOptions: [
        {
          loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        {
          loadPath: './public/locales/{{lng}}/{{ns}}.json'
        }
      ]
    }
  })

export default i18next
