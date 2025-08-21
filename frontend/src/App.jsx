import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Kurssit from './Kurssit.jsx';
import Tilat from './Tilat.jsx';
import Opettajat from './Opettajat.jsx';
import Opiskelijat from './Opiskelijat.jsx';
import '../css/App.css';
import '../css/index.css';
import Kurssikirjautumiset from './Kurssikirjautumiset.jsx';


function App() {


  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kurssit" element={<Kurssit />} />
      <Route path="/tilat" element={<Tilat />} />
      <Route path="/opettajat" element={<Opettajat />} />
      <Route path="/opiskelijat" element={<Opiskelijat />} />
      <Route path="/kurssikirjautumiset" element={<Kurssikirjautumiset />} />
    </Routes>
    </Router>
  );
}

export default App;