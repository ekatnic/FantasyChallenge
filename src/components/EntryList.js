import React, { useEffect, useState } from "react";
import { getEntries } from "../services/api";

const EntryList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getEntries();
        setEntries(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Entries</h1>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {entry.name} - {entry.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntryList;
