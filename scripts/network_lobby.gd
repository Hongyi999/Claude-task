extends Control

## Network lobby for multiplayer games

@onready var network_manager = $"/root/NetworkManager"

# Host/Join UI
@onready var player_name_input = $VBoxContainer/PlayerNameContainer/PlayerNameInput
@onready var host_button = $VBoxContainer/ButtonsContainer/HostButton
@onready var join_button = $VBoxContainer/ButtonsContainer/JoinButton
@onready var ip_input = $VBoxContainer/JoinContainer/IPInput
@onready var port_input = $VBoxContainer/PortContainer/PortInput
@onready var join_container = $VBoxContainer/JoinContainer
@onready var port_container = $VBoxContainer/PortContainer

# Lobby UI
@onready var lobby_panel = $VBoxContainer/LobbyPanel
@onready var players_list = $VBoxContainer/LobbyPanel/VBoxContainer/ScrollContainer/PlayersList
@onready var start_game_button = $VBoxContainer/LobbyPanel/VBoxContainer/ButtonsContainer/StartGameButton
@onready var disconnect_button = $VBoxContainer/LobbyPanel/VBoxContainer/ButtonsContainer/DisconnectButton
@onready var status_label = $VBoxContainer/StatusLabel

var in_lobby: bool = false

func _ready() -> void:
	# Hide lobby initially
	lobby_panel.visible = false
	join_container.visible = false
	port_container.visible = true

	# Set default values
	player_name_input.text = "Player_%d" % randi_range(1000, 9999)
	ip_input.text = "127.0.0.1"
	port_input.text = "7777"

	# Connect network signals
	network_manager.player_connected.connect(_on_player_connected)
	network_manager.player_disconnected.connect(_on_player_disconnected)
	network_manager.connection_succeeded.connect(_on_connection_succeeded)
	network_manager.connection_failed.connect(_on_connection_failed)
	network_manager.server_disconnected.connect(_on_server_disconnected)

func _on_host_button_pressed() -> void:
	var player_name = player_name_input.text.strip_edges()
	if player_name.is_empty():
		show_status("Please enter a player name", Color.RED)
		return

	var port = int(port_input.text)
	if port <= 0 or port > 65535:
		show_status("Invalid port number", Color.RED)
		return

	# Set local player info
	network_manager.set_local_player_info(player_name)

	# Create server
	if network_manager.create_server(port):
		show_status("Server created! Waiting for players...", Color.GREEN)
		enter_lobby(true)
	else:
		show_status("Failed to create server", Color.RED)

func _on_join_button_pressed() -> void:
	# Toggle join container visibility
	join_container.visible = !join_container.visible

func _on_connect_button_pressed() -> void:
	var player_name = player_name_input.text.strip_edges()
	if player_name.is_empty():
		show_status("Please enter a player name", Color.RED)
		return

	var address = ip_input.text.strip_edges()
	if address.is_empty():
		show_status("Please enter server IP address", Color.RED)
		return

	var port = int(port_input.text)
	if port <= 0 or port > 65535:
		show_status("Invalid port number", Color.RED)
		return

	# Set local player info
	network_manager.set_local_player_info(player_name)

	# Join server
	if network_manager.join_server(address, port):
		show_status("Connecting to server...", Color.YELLOW)
		host_button.disabled = true
		join_button.disabled = true
	else:
		show_status("Failed to connect to server", Color.RED)

func enter_lobby(is_host: bool) -> void:
	in_lobby = true
	lobby_panel.visible = true

	# Hide main menu buttons
	host_button.visible = false
	join_button.visible = false
	player_name_input.editable = false
	ip_input.visible = false
	port_input.editable = false
	join_container.visible = false

	# Show/hide start button based on host status
	start_game_button.visible = is_host

	# Update players list
	update_players_list()

func leave_lobby() -> void:
	in_lobby = false
	lobby_panel.visible = false

	# Show main menu buttons
	host_button.visible = true
	join_button.visible = true
	player_name_input.editable = true
	port_input.editable = true

	# Disconnect
	network_manager.disconnect_from_server()

	show_status("Disconnected from lobby", Color.WHITE)

func update_players_list() -> void:
	# Clear existing list
	for child in players_list.get_children():
		child.queue_free()

	# Add each player
	for peer_id in network_manager.players.keys():
		var player_info = network_manager.players[peer_id]
		var label = Label.new()

		var player_text = "%s" % player_info.get("name", "Unknown")
		if peer_id == 1:
			player_text += " (Host)"
		if peer_id == network_manager.get_local_peer_id():
			player_text += " (You)"

		label.text = player_text
		label.add_theme_font_size_override("font_size", 20)
		players_list.add_child(label)

func show_status(message: String, color: Color = Color.WHITE) -> void:
	status_label.text = message
	status_label.add_theme_color_override("font_color", color)

func _on_start_game_button_pressed() -> void:
	if not network_manager.is_host:
		return

	# Change to hero selection
	get_tree().change_scene_to_file("res://scenes/hero_select.tscn")

func _on_disconnect_button_pressed() -> void:
	leave_lobby()

func _on_back_button_pressed() -> void:
	if in_lobby:
		leave_lobby()
	else:
		get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

# Network signal handlers
func _on_player_connected(peer_id: int, player_info: Dictionary) -> void:
	show_status("Player connected: %s" % player_info.get("name", "Unknown"), Color.GREEN)
	update_players_list()

func _on_player_disconnected(peer_id: int) -> void:
	show_status("Player disconnected", Color.YELLOW)
	update_players_list()

func _on_connection_succeeded() -> void:
	show_status("Connected to server!", Color.GREEN)
	enter_lobby(false)
	update_players_list()

func _on_connection_failed() -> void:
	show_status("Failed to connect to server", Color.RED)
	host_button.disabled = false
	join_button.disabled = false

func _on_server_disconnected() -> void:
	show_status("Server disconnected", Color.RED)
	leave_lobby()
