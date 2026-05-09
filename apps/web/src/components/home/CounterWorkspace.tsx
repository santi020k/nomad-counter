import { ConfirmDialog } from './ConfirmDialog'
import { HomeCountryPanel } from './HomeCountryPanel'
import { SummaryPanel } from './SummaryPanel'
import { TripFormPanel } from './TripFormPanel'
import { TripLogPanel } from './TripLogPanel'
import styles from './CounterWorkspace.module.css'
import { useCounterWorkspace } from './useCounterWorkspace'

export default function CounterWorkspace() {
  const {
    closeConfirm,
    confirm,
    editingTrip,
    handleCancelEdit,
    handleAddCountry,
    handleAddTrip,
    handleEditTrip,
    handleConfirm,
    handleExportCsv,
    handleImportCsv,
    handleLocaleChange,
    handleRemoveSummaryCountry,
    handleRemoveTrackedCountry,
    handleRemoveTrip,
    handleUpdateTrip,
    handleWindowChange,
    messages,
    state,
    tripFormStatus
  } = useCounterWorkspace()

  return (
    <section id="counter" className={styles.section} aria-label="Nomad Counter app" data-animate>
      <div className={styles.dashboard}>
        <SummaryPanel
          summary={state.summary}
          windowLabel={state.windowLabel}
          windowMode={state.windowMode}
          messages={messages}
          onWindowChange={handleWindowChange}
          onRemoveCountry={handleRemoveSummaryCountry}
        />
        <TripLogPanel
          trips={state.trips}
          onRemoveTrip={handleRemoveTrip}
          onEditTrip={handleEditTrip}
          onExportCsv={handleExportCsv}
          onImportCsv={handleImportCsv}
          messages={messages}
        />
        {tripFormStatus && (
          <p className={styles.importStatus} role="status">{tripFormStatus}</p>
        )}
      </div>
      <div className={styles.sidebar}>
        <TripFormPanel
          key={editingTrip?.id ?? 'new-trip'}
          editingTrip={editingTrip}
          messages={messages}
          onAddTrip={handleAddTrip}
          onCancelEdit={handleCancelEdit}
          onUpdateTrip={handleUpdateTrip}
        />
        <HomeCountryPanel
          countries={state.countries}
          messages={messages}
          onAddCountry={handleAddCountry}
          onRemoveCountry={handleRemoveTrackedCountry}
        />
        <div className={styles.localePanel} aria-label="Language">
          <button
            className="btn secondary"
            type="button"
            aria-pressed={state.locale === 'en'}
            onClick={() => { handleLocaleChange('en') }}
          >
            English
          </button>
          <button
            className="btn secondary"
            type="button"
            aria-pressed={state.locale === 'es'}
            onClick={() => { handleLocaleChange('es') }}
          >
            Español
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        cancelLabel={messages.cancel}
        confirmLabel={messages.remove}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </section>
  )
}
