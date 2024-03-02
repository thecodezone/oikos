import ReactDOM from 'react-dom';
import { NetworkDiagramAndSliders } from './NetworkDiagramAndSliders';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <NetworkDiagramAndSliders width={500} height={500} />,
  rootElement
);
