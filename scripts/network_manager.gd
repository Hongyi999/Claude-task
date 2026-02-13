extends Node

## Network manager for multiplayer functionality

# Signals
signal player_connected(peer_id: int, player_info: Dictionary)
signal player_disconnected(peer_id: int)
signal server_disconnected()
signal connection_failed()
signal connection_succeeded()

# Network settings
const DEFAULT_PORT = 7777
const MAX_PLAYERS = 5

# Player information
var players: Dictionary = {}  # peer_id -> player_info
var local_player_info: Dictionary = {}

# Network state
var is_host: bool = false

func _ready() -> void:
	multiplayer.peer_connected.connect(_on_peer_connected)
	multiplayer.peer_disconnected.connect(_on_peer_disconnected)
	multiplayer.connected_to_server.connect(_on_connected_to_server)
	multiplayer.connection_failed.connect(_on_connection_failed)
	multiplayer.server_disconnected.connect(_on_server_disconnected)

func create_server(port: int = DEFAULT_PORT) -> bool:
	var peer = ENetMultiplayerPeer.new()
	var error = peer.create_server(port, MAX_PLAYERS)

	if error != OK:
		push_error("Failed to create server: %d" % error)
		return false

	multiplayer.multiplayer_peer = peer
	is_host = true

	# Add host as first player
	players[1] = local_player_info.duplicate()

	print("Server created on port %d" % port)
	return true

func join_server(address: String, port: int = DEFAULT_PORT) -> bool:
	var peer = ENetMultiplayerPeer.new()
	var error = peer.create_client(address, port)

	if error != OK:
		push_error("Failed to join server: %d" % error)
		return false

	multiplayer.multiplayer_peer = peer
	is_host = false

	print("Connecting to server at %s:%d" % [address, port])
	return true

func disconnect_from_server() -> void:
	if multiplayer.multiplayer_peer:
		multiplayer.multiplayer_peer.close()
		multiplayer.multiplayer_peer = null

	players.clear()
	is_host = false
	print("Disconnected from server")

func set_local_player_info(player_name: String, player_color: Color = Color.WHITE) -> void:
	local_player_info = {
		"name": player_name,
		"color": player_color,
		"hero_id": "",
		"ready": false
	}

func get_player_count() -> int:
	return players.size()

func get_local_peer_id() -> int:
	if multiplayer.multiplayer_peer:
		return multiplayer.multiplayer_peer.get_unique_id()
	return 0

@rpc("any_peer", "reliable")
func register_player(player_info: Dictionary) -> void:
	var peer_id = multiplayer.get_remote_sender_id()
	players[peer_id] = player_info

	print("Player registered: %s (ID: %d)" % [player_info.get("name", "Unknown"), peer_id])
	player_connected.emit(peer_id, player_info)

	# If we're the server, sync all players to the new client
	if is_host:
		rpc_id(peer_id, "sync_players", players)

@rpc("authority", "reliable")
func sync_players(all_players: Dictionary) -> void:
	players = all_players
	print("Players synced: %d players" % players.size())

@rpc("any_peer", "reliable")
func update_player_info(player_info: Dictionary) -> void:
	var peer_id = multiplayer.get_remote_sender_id()
	players[peer_id] = player_info

	# Relay to all clients if we're the server
	if is_host:
		for id in players.keys():
			if id != peer_id:
				rpc_id(id, "update_player_info", player_info)

@rpc("any_peer", "reliable")
func set_player_ready(ready: bool) -> void:
	var peer_id = multiplayer.get_remote_sender_id()
	if players.has(peer_id):
		players[peer_id]["ready"] = ready

@rpc("authority", "call_local", "reliable")
func start_game(player_heroes: Dictionary) -> void:
	# Store hero selections
	for peer_id in player_heroes.keys():
		if players.has(peer_id):
			players[peer_id]["hero_id"] = player_heroes[peer_id]

	# Change to game scene
	get_tree().change_scene_to_file("res://scenes/game.tscn")

# Signal handlers
func _on_peer_connected(id: int) -> void:
	print("Peer connected: %d" % id)

func _on_peer_disconnected(id: int) -> void:
	print("Peer disconnected: %d" % id)

	if players.has(id):
		players.erase(id)
		player_disconnected.emit(id)

func _on_connected_to_server() -> void:
	print("Successfully connected to server")
	connection_succeeded.emit()

	# Register ourselves with the server
	rpc("register_player", local_player_info)

func _on_connection_failed() -> void:
	print("Connection to server failed")
	multiplayer.multiplayer_peer = null
	connection_failed.emit()

func _on_server_disconnected() -> void:
	print("Server disconnected")
	multiplayer.multiplayer_peer = null
	players.clear()
	server_disconnected.emit()
