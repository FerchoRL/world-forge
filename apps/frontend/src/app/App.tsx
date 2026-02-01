import { AppShell } from './layout/AppShell'
import '../styles/index.css'

function App() {
  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-xl">Layout test</h1>
        <p>Si ves el sidebar y topbar, ya funcionó.</p>
      </div>
    </AppShell>
  )
}

export default App
