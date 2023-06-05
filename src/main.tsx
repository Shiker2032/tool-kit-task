import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RepoCard from './components/RepoCard.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/repositories/:repoId" element={<RepoCard />} />
      </Routes>
    </Router>
  </Provider>
);
