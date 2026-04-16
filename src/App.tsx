import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Campaigns from '@/pages/Campaigns';
import Creators from '@/pages/Creators';
import Shortlist from '@/pages/Shortlist';
import Analytics from '@/pages/Analytics';
import { useAppStore } from '@/store/useAppStore';

function App() {
  const { creators, setCreators } = useAppStore();

  useEffect(() => {
    // Only load from JSON if we don't have active data (to avoid overwriting localStorage sheets sync)
    if (creators.length === 0) {
      fetch('/creators.json')
        .then(res => res.json())
        .then(data => setCreators(data))
        .catch(err => console.error("Failed to load initial creators database: ", err));
    }
  }, [creators.length, setCreators]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Campaigns />} />
          <Route path="creators" element={<Creators />} />
          <Route path="shortlist" element={<Shortlist />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
