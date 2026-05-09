export type Locale = 'en' | 'es'

const localeKey = 'nomad-counter:locale'
const isLocale = (value: string | null): value is Locale => value === 'en' || value === 'es'

export const readLocale = (): Locale => {
  if (typeof localStorage === 'undefined') return 'en'

  const stored = localStorage.getItem(localeKey)

  return isLocale(stored) ? stored : 'en'
}

export const saveLocale = (locale: Locale): void => {
  localStorage.setItem(localeKey, locale)

  document.documentElement.lang = locale

  window.dispatchEvent(new CustomEvent<Locale>('nomad-counter:locale-change', { detail: locale }))
}

export interface Messages {
  addTrip: string
  cancel: string
  calendarYear: string
  changeEmail: string
  chooseWindow: string
  codeSent: string
  country: string
  countryDayCounts: string
  countingRule: string
  currentThere: string
  daysInWindow: string
  daysOverThreshold: (days: number) => string
  daysRemaining: (days: number) => string
  defaultGuestState: string
  deleteCountryTrips: (name: string, count: number) => string
  deleteCountryTripsOnly: (name: string, count: number) => string
  edit: string
  editTrip: string
  emailCodeHelp: string
  emailMeCode: string
  entryDate: string
  exceeded: string
  exposure: string
  exitDate: string
  exitDateHelp: string
  exportCsv: string
  importCsv: string
  inboxCodeSent: (email: string) => string
  inboxTitle: string
  invalidLoginCode: string
  loginCode: string
  loginCodeIntro: string
  loginEmailIntro: string
  nearLimit: string
  newStay: string
  noTrips: string
  note: string
  noteHelp: string
  onTrack: string
  openEndedHelp: string
  optional: string
  remove: string
  removeFromDashboard: string
  removeTrip: string
  removeTripConfirm: (entry: string, exit: string, country: string) => string
  rolling365: string
  saveAccount: string
  sendingCode: string
  signedIn: string
  signedInStatus: (email: string) => string
  signInSync: string
  signOut: string
  stopTracking: string
  stopTrackingConfirm: (name: string) => string
  stopTrackingSummary: (name: string) => string
  threshold: string
  trackCountry: string
  trackedCountry: string
  travelLog: string
  tripData: string
  trips: string
  updateTrip: string
  verifyingCode: string
  window: string
}

const translations: Record<Locale, Messages> = {
  en: {
    addTrip: 'Add trip',
    cancel: 'Cancel',
    calendarYear: 'Calendar year',
    changeEmail: 'Use a different email',
    chooseWindow: 'Choose the date range used for exposure counts.',
    codeSent: 'Code sent. Enter the digits below when they arrive.',
    country: 'Country',
    countryDayCounts: 'Country day counts',
    countingRule:
      'Counting rule: any calendar day with presence in a country counts as one full day. Entry and exit dates are inclusive. This is a tracking aid, not tax advice.',
    currentThere: 'Currently there',
    daysInWindow: 'Days in window vs threshold',
    daysOverThreshold: (days: number) => `${String(days)} days over threshold`,
    daysRemaining: (days: number) => `${String(days)} days remaining`,
    defaultGuestState: 'Guest mode. Your data stays in this browser until you save it to an account.',
    deleteCountryTrips: (name: string, count: number) => `This will stop tracking ${name} and delete all ${String(count)} trip${count === 1 ? '' : 's'} for this country from your travel log. You cannot undo this.`,
    deleteCountryTripsOnly: (name: string, count: number) => `This will delete all ${String(count)} trip${count === 1 ? '' : 's'} to ${name} from your travel log. You cannot undo this.`,
    edit: 'Edit',
    editTrip: 'Edit trip',
    emailCodeHelp: 'Codes expire after a short time. Check spam if you do not see it.',
    emailMeCode: 'Email me a code',
    entryDate: 'Entry date',
    exceeded: 'Exceeded',
    exposure: 'Exposure',
    exitDate: 'Exit date',
    exitDateHelp: 'Required for completed stays. Disabled while "Currently there" is checked.',
    exportCsv: 'Export CSV',
    importCsv: 'Import CSV',
    inboxCodeSent: (email: string) => `To ${email}`,
    inboxTitle: 'Check your inbox',
    invalidLoginCode: 'Enter the 6-digit code.',
    loginCode: '6-digit code',
    loginCodeIntro: 'Enter the code from your email to upload this browser\'s trips.',
    loginEmailIntro:
      'Email yourself a one-time code when you want these local trips synced across devices.',
    nearLimit: 'Near limit',
    newStay: 'New stay',
    noTrips: 'No trips yet. Add your first stay or import a CSV.',
    note: 'Note',
    noteHelp: 'Avoid sensitive tax, immigration, or identity details.',
    onTrack: 'On track',
    openEndedHelp: 'When checked, exit date is optional until the stay ends.',
    optional: 'Optional',
    remove: 'Remove',
    removeFromDashboard: 'Remove from dashboard',
    removeTrip: 'Remove trip',
    removeTripConfirm: (entry: string, exit: string, country: string) => `Remove this stay (${entry} -> ${exit}) for ${country}? You cannot undo this.`,
    rolling365: 'Rolling 365 days',
    saveAccount: 'Save to your account',
    sendingCode: 'Sending code...',
    signedIn: 'You are signed in',
    signedInStatus: (email: string) => `Synced to ${email}`,
    signInSync: 'Sign in and sync',
    signOut: 'Sign out',
    stopTracking: 'Stop tracking country',
    stopTrackingConfirm: (name: string) => `Stop tracking ${name}? Its custom threshold and warning settings will be removed. Trips in your travel log are not deleted. You cannot undo this.`,
    stopTrackingSummary: (name: string) => `This will stop tracking ${name} and remove its custom threshold from your settings. You cannot undo this.`,
    threshold: 'Threshold',
    trackCountry: 'Track country',
    trackedCountry: 'Tracked country',
    travelLog: 'Travel log',
    tripData: 'Trip data',
    trips: 'Trips',
    updateTrip: 'Update trip',
    verifyingCode: 'Verifying code...',
    window: 'Window'
  },
  es: {
    addTrip: 'Agregar viaje',
    cancel: 'Cancelar',
    calendarYear: 'Año calendario',
    changeEmail: 'Usar otro correo',
    chooseWindow: 'Elige el rango de fechas usado para los conteos.',
    codeSent: 'Código enviado. Ingresa los dígitos cuando lleguen.',
    country: 'País',
    countryDayCounts: 'Conteo de días por país',
    countingRule:
      'Regla de conteo: cualquier día calendario con presencia en un país cuenta como un día completo. Entrada y salida son inclusivas. Es una ayuda de seguimiento, no asesoría fiscal.',
    currentThere: 'Estoy allí ahora',
    daysInWindow: 'Días en el periodo vs límite',
    daysOverThreshold: (days: number) => `${String(days)} días sobre el límite`,
    daysRemaining: (days: number) => `${String(days)} días restantes`,
    defaultGuestState: 'Modo invitado. Tus datos quedan en este navegador hasta guardarlos en una cuenta.',
    deleteCountryTrips: (name: string, count: number) => `Esto dejará de seguir ${name} y eliminará ${String(count)} viaje${count === 1 ? '' : 's'} de este país. No se puede deshacer.`,
    deleteCountryTripsOnly: (name: string, count: number) => `Esto eliminará ${String(count)} viaje${count === 1 ? '' : 's'} a ${name}. No se puede deshacer.`,
    edit: 'Editar',
    editTrip: 'Editar viaje',
    emailCodeHelp: 'Los códigos expiran pronto. Revisa spam si no lo ves.',
    emailMeCode: 'Enviarme un código',
    entryDate: 'Fecha de entrada',
    exceeded: 'Excedido',
    exposure: 'Exposición',
    exitDate: 'Fecha de salida',
    exitDateHelp: 'Requerida para estadías finalizadas. Se desactiva si marcas "Estoy allí ahora".',
    exportCsv: 'Exportar CSV',
    importCsv: 'Importar CSV',
    inboxCodeSent: (email: string) => `A ${email}`,
    inboxTitle: 'Revisa tu correo',
    invalidLoginCode: 'Ingresa el código de 6 dígitos.',
    loginCode: 'Código de 6 dígitos',
    loginCodeIntro: 'Ingresa el código del correo para subir los viajes de este navegador.',
    loginEmailIntro:
      'Envíate un código de un solo uso cuando quieras sincronizar estos viajes entre dispositivos.',
    nearLimit: 'Cerca del límite',
    newStay: 'Nueva estadía',
    noTrips: 'Aún no hay viajes. Agrega tu primera estadía o importa un CSV.',
    note: 'Nota',
    noteHelp: 'Evita detalles fiscales, migratorios o de identidad sensibles.',
    onTrack: 'En rango',
    openEndedHelp: 'Si está marcado, la fecha de salida queda pendiente hasta terminar la estadía.',
    optional: 'Opcional',
    remove: 'Eliminar',
    removeFromDashboard: 'Eliminar del panel',
    removeTrip: 'Eliminar viaje',
    removeTripConfirm: (entry: string, exit: string, country: string) => `¿Eliminar esta estadía (${entry} -> ${exit}) en ${country}? No se puede deshacer.`,
    rolling365: 'Últimos 365 días',
    saveAccount: 'Guardar en tu cuenta',
    sendingCode: 'Enviando código...',
    signedIn: 'Sesión iniciada',
    signedInStatus: (email: string) => `Sincronizado con ${email}`,
    signInSync: 'Iniciar sesión y sincronizar',
    signOut: 'Cerrar sesión',
    stopTracking: 'Dejar de seguir país',
    stopTrackingConfirm: (name: string) => `¿Dejar de seguir ${name}? Se eliminarán su límite y alertas personalizados. Los viajes no se borran. No se puede deshacer.`,
    stopTrackingSummary: (name: string) => `Esto dejará de seguir ${name} y eliminará su límite personalizado. No se puede deshacer.`,
    threshold: 'Límite',
    trackCountry: 'Seguir país',
    trackedCountry: 'País seguido',
    travelLog: 'Registro de viajes',
    tripData: 'Datos de viaje',
    trips: 'Viajes',
    updateTrip: 'Actualizar viaje',
    verifyingCode: 'Verificando código...',
    window: 'Periodo'
  }
}

export const getMessages = (locale: Locale): Messages => translations[locale]
