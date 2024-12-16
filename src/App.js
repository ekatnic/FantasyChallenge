import "./App.css";
import EntryList from "./components/EntryList";
import CreateEntry from "./components/CreateEntry";

function App() {
  return (
    <div className="App">
      <EntryList />
      <CreateEntry />
    </div>
  );
}

export default App;
