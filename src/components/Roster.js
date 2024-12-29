import React from "react";
import { useDrop } from "react-dnd";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Roster = ({
  rosterPositions,
  roster,
  allPlayers,
  handleRemovePlayer,
  handleDropPlayer,
  setRoster,
  setTeamError,
}) => {
  const ItemTypes = {
    PLAYER: "player",
  };

  const isEligiblePosition = (player, position) => {
    const flexPositions = ["Flex1", "Flex2", "Flex3", "Flex4", "Scaled Flex"];
    if (position === "QB" && player.position !== "QB") return false;
    if (
      position.startsWith("RB") &&
      player.position !== "RB" &&
      !flexPositions.includes(position)
    )
      return false;
    if (
      position.startsWith("WR") &&
      player.position !== "WR" &&
      !flexPositions.includes(position)
    )
      return false;
    if (
      position === "TE" &&
      player.position !== "TE" &&
      !flexPositions.includes(position)
    )
      return false;
    if (
      flexPositions.includes(position) &&
      !["RB", "WR", "TE"].includes(player.position)
    )
      return false;
    if (position === "DEF" && player.position !== "DEF") return false;
    if (position === "K" && player.position !== "K") return false;
    return true;
  };

  const isTeamAlreadyInRoster = (player) => {
    return Object.values(roster).some((playerId) => {
      const existingPlayer = allPlayers.find((p) => p.id === playerId);
      return existingPlayer && existingPlayer.team === player.team;
    });
  };

  const RosterPosition = ({ position }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: ItemTypes.PLAYER,
      canDrop: (item) =>
        isEligiblePosition(item.player, position) &&
        !isTeamAlreadyInRoster(item.player),
      drop: (item) => {
        if (
          isEligiblePosition(item.player, position) &&
          !isTeamAlreadyInRoster(item.player)
        ) {
          handleDropPlayer(item.player, position, roster, setRoster, allPlayers, setTeamError);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }));

    const playerId = roster[position];
    const player = allPlayers.find((p) => p.id === playerId);

    const getBackgroundColor = () => {
      if (!isOver) return "white";
      return canDrop ? "lightgreen" : "lightcoral";
    };

    return (
      <ListItem ref={drop} style={{ backgroundColor: getBackgroundColor() }}>
        <ListItemText
          primary={
            <Typography variant="body1" component="span">
              <strong>{position}</strong>: {player ? player.name : "---"}
            </Typography>
          }
        />
        {player && (
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleRemovePlayer(position)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </ListItem>
    );
  };

  return (
    <Card>
      <CardHeader
        title="Your Roster"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <List>
          {rosterPositions.map((position) => (
            <RosterPosition key={position} position={position} />
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Roster;