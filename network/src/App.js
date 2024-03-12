import './App.css';
import GraphView from './components/graph';
import PrayerForm from './Form.tsx';
import { Header } from './Header';

function App() {
  console.log("script started")
  return (
    <div className="App">
      <Header />
      <GraphView />
      <PrayerForm />
    </div>
  );
}

export default App;
