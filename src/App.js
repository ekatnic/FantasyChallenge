import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EntryList from "./components/EntryList";
import CreateEntryTable from "./components/CreateEntryTable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-entry" element={<CreateEntryTable />} />
        <Route path="/view-entry" element={<EntryList />} />
      </Routes>
    </Router>
  );
}

export default App;
