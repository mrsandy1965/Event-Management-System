import { AppProvider } from './context/AppContext';
import EventManagement from './components/EventManagement';
import './index.css';

function App() {
  return (
    <AppProvider>
      <div className="app">
        <EventManagement />
      </div>
    </AppProvider>
  );
}

export default App;
