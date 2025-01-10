export const handleSort = (key, sortConfig, setSortConfig) => {
  setSortConfig((prevSortConfig) => {
    const existingSort = prevSortConfig.find((sort) => sort.key === key);
    if (existingSort) {
      const newDirection =
        existingSort.direction === "ascending" ? "descending" : "ascending";
      return prevSortConfig.map((sort) =>
        sort.key === key ? { ...sort, direction: newDirection } : sort
      );
    } else {
      return [...prevSortConfig, { key, direction: "ascending" }];
    }
  });
};

export const sortPlayers = (players, sortConfig, positionOrder) => {
  return [...players].sort((a, b) => {
    for (const { key, direction } of sortConfig) {
      if (key === "position") {
        const orderA = positionOrder[a.position] || 99;
        const orderB = positionOrder[b.position] || 99;
        if (orderA < orderB) return direction === "ascending" ? -1 : 1;
        if (orderA > orderB) return direction === "ascending" ? 1 : -1;
      } else {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });
};

const teamAlreadyInRoster = (roster, player, allPlayers) => {
  return (
    roster &&
    Object.values(roster).some((playerId) => {
      const existingPlayer = allPlayers.find((p) => p.id === playerId);
      return existingPlayer && existingPlayer.team === player.team;
    })
  );
};

export const filterPlayers = (
  players,
  roster,
  allPlayers,
  filterPosition,
  filterTeam,
  searchTerm,
  rbPositions,
  wrPositions,
  tePositions
) => {
  return players
    .map((player) => {
      let isGrayedOut = teamAlreadyInRoster(roster, player, allPlayers);

      if (!isGrayedOut) {
        if (player.position === "QB" && roster.QB) {
          isGrayedOut = true;
        } else if (player.position === "DEF" && roster.DEF) {
          isGrayedOut = true;
        } else if (player.position === "K" && roster.K) {
          isGrayedOut = true;
        } else if (player.position === "RB") {
          isGrayedOut = rbPositions.every((pos) => roster[pos]);
        } else if (player.position === "WR") {
          isGrayedOut = wrPositions.every((pos) => roster[pos]);
        } else if (player.position === "TE") {
          isGrayedOut = tePositions.every((pos) => roster[pos]);
        }
      }

      return {
        ...player,
        isGrayedOut,
      };
    })
    .filter((player) => {
      return (
        (filterPosition === "All" ||
          (filterPosition === "Flex" &&
            ["RB", "WR", "TE"].includes(player.position)) ||
          player.position === filterPosition) &&
        (filterTeam === "All" || player.team === filterTeam) &&
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
};

export const handleAddPlayer = (
  player,
  roster,
  setRoster,
  allPlayers,
  rbPositions,
  wrPositions,
  tePositions,
  setTeamError
) => {
  const position = player.position;
  const playerTeam = player.team;

  if (teamAlreadyInRoster(roster, player, allPlayers)) {
    setTeamError(
      `You cannot have more than one player from the same team (${playerTeam}) in your roster.`
    );
    return;
  }

  let positionToAdd = null;

  if (position === "QB" || position === "DEF" || position === "K") {
    positionToAdd = position;
  } else if (position === "RB") {
    positionToAdd = rbPositions.find((pos) => !roster[pos]) || "Scaled Flex";
  } else if (position === "WR") {
    positionToAdd = wrPositions.find((pos) => !roster[pos]) || "Scaled Flex";
  } else if (position === "TE") {
    positionToAdd = tePositions.find((pos) => !roster[pos]) || "Scaled Flex";
  }

  if (positionToAdd) {
    setRoster((prev) => ({
      ...prev,
      [positionToAdd]: player.id,
    }));
  }

  // Clear any previous team error
  setTeamError(null);
};

export const handleDropPlayer = (
  player,
  positionToAdd,
  roster,
  setRoster,
  allPlayers,
  setTeamError
) => {
  const playerTeam = player.team;

  if (teamAlreadyInRoster(roster, player, allPlayers)) {
    setTeamError(
      `You cannot have more than one player from the same team (${playerTeam}) in your roster.`
    );
    return;
  }

  if (positionToAdd) {
    setRoster((prev) => ({
      ...prev,
      [positionToAdd]: player.id,
    }));
  }

  // Clear any previous team error
  setTeamError(null);
};

export const getFullValidationErrorMessage = (err, fallbackMessage = "Signup failed") => {
  const errorMessage = err.response?.data?.message;
  const validationErrors = err.response?.data?.errors;

  // Flatten and format all error messages
  const fullErrorMessage = validationErrors
    ? Object.values(validationErrors)
        .flat() // Flatten the arrays of error messages
        .join("\n") // Join them with a newline
    : errorMessage || fallbackMessage;

  return fullErrorMessage;
}