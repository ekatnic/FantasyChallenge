import requests
from django.conf import settings
from django.core.cache import cache
from .helper_classes import DataProcessor

# Define API endpoints as constants
GET_NFL_GAMES_FOR_DATE = "/getNFLGamesForDate"
GET_NFL_BOX_SCORE = "/getNFLBoxScore"

class TankAPIClient:
    # Set the base URL and headers for the API
    base_url = f"https://{settings.TANK_API_ENDPOINT}"
    headers = {
        "X-RapidAPI-Key": settings.TANK_API_KEY,
        "X-RapidAPI-Host": settings.TANK_API_ENDPOINT,
    }

    # Define a method to make a request to the API
    def _make_request(self, endpoint, params):
        url = f"{self.base_url}{endpoint}"
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()  # Raises a HTTPError if the response was unsuccessful
        return response.json()

    # Define a method to get games for a specific date
    def get_games_for_date(self, date):
        params = {
            "gameDate": date, 
            "topPerformers": "false"
        }
        json_response = self._make_request(GET_NFL_GAMES_FOR_DATE, params)
        return [game["gameID"] for game in json_response.get("body", [])]

    # Define a method to get stats from a specific game
    def get_stats_from_game(self, game_id):
        params = {
            "gameID": game_id,
            "fantasyPoints": "false"
        }
        json_response = self._make_request(GET_NFL_BOX_SCORE, params)
        body = json_response.get("body", {})
        player_stats_dict = body.get("playerStats", {})
        defense_body = body.get("DST", {})
        defensive_stats_dict = {team_stats["teamAbv"]: team_stats for team_stats in defense_body.values()}
        return player_stats_dict, defensive_stats_dict

    # Define a method to get stats from a list of game IDs
    def get_stats_from_game_id_list(self, game_id_list):
        merged_player_dict = {}
        merged_defense_dict = {}
        for game_id in game_id_list:
            player_stats_dict, defensive_stats_dict = self.get_stats_from_game(game_id)
            merged_player_dict = {**merged_player_dict, **player_stats_dict}
            merged_defense_dict = {**merged_defense_dict, **defensive_stats_dict}
        return merged_player_dict, merged_defense_dict

    # Define a method to process player stats for a specific date
    def process_player_stats_for_date(self, date, week):
        cache.delete('ranked_entries_dict')
        cache.delete('players_scoring_dict')
        game_id_list = self.get_games_for_date(date)
        player_stats_dict, defensive_stats_dict = self.get_stats_from_game_id_list(game_id_list)
        DataProcessor.process_player_stats_dict(player_stats_dict, week)
        DataProcessor.process_defense_stats_dict(defensive_stats_dict, week)
