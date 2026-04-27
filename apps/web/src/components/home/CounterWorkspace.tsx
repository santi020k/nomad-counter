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
    handleAddCountry,
    handleAddTrip,
    handleConfirm,
    handleExportCsv,
    handleImportCsv,
    handleRemoveSummaryCountry,
    handleRemoveTrackedCountry,
    handleRemoveTrip,
    handleWindowChange,
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
          onWindowChange={handleWindowChange}
          onRemoveCountry={handleRemoveSummaryCountry}
        />
        <TripLogPanel
          trips={state.trips}
          onRemoveTrip={handleRemoveTrip}
          onExportCsv={handleExportCsv}
          onImportCsv={handleImportCsv}
        />
        {tripFormStatus && (
          <p className={styles.importStatus} role="status">{tripFormStatus}</p>
        )}
      </div>
      <div className={styles.sidebar}>
        <TripFormPanel onAddTrip={handleAddTrip} />
        <HomeCountryPanel
          countries={state.countries}
          onAddCountry={handleAddCountry}
          onRemoveCountry={handleRemoveTrackedCountry}
        />
      </div>
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </section>
  )
}
