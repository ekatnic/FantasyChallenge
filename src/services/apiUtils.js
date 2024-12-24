export const processEntryData = (entryData) => {
    const rosterName = entryData.name;
    const roster = entryData.rostered_players.reduce((acc, player) => {
      acc[player.roster_position] = player.player_id;
      return acc;
    }, {});
    return { rosterName, roster };
  };