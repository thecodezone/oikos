import './App.css';
import GraphView from './components/graph';
import { Header } from './Header';

function App() {
  console.log("script started")
  return (
    <div className="App">
      <Header />
      <GraphView />
    </div>
  );
}

export default App;
