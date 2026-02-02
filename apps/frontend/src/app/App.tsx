import { AppShell } from './layout/AppShell'
import '../styles/index.css'
import { CharactersListPage } from '../pages/CharactersListPage'

function App() {
  return (
    <AppShell>
      <CharactersListPage></CharactersListPage>
    </AppShell>
  )
}

export default App
