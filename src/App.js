import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EntryList from "./components/EntryList";
import CreateEntry from "./components/CreateEntry";
import EditEntry from "./components/EditEntry";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-entry" element={<CreateEntry />} />
        <Route path="/edit-entry/:id" element={<EditEntry />} />
        <Route path="/view-entry" element={<EntryList />} />
      </Routes>
    </Router>
  );
}

export default App;
