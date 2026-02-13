extends Control

## Hero selection screen

@onready var player_count_label = $VBoxContainer/PlayerCountLabel
@onready var player_count_slider = $VBoxContainer/PlayerCountSlider
@onready var hero_grid = $VBoxContainer/HeroGridContainer
@onready var start_button = $VBoxContainer/HBoxContainer/StartButton
@onready var network_manager = $"/root/NetworkManager"

var player_count: int = 2
var selected_heroes: Array[String] = []
var hero_buttons: Array[Button] = []

# Load heroes from data
var heroes_data: Array = []

# Multiplayer mode
var is_multiplayer: bool = false
var local_hero_selected: String = ""

func _ready() -> void:
	load_heroes_data()
	create_hero_buttons()

	# Check if we're in multiplayer mode
	is_multiplayer = network_manager.multiplayer_peer != null

	if is_multiplayer:
		# In multiplayer, each player selects one hero
		player_count_slider.visible = false
		player_count_label.text = "Select Your Hero (Multiplayer Mode)"
		player_count = network_manager.get_player_count()

		# Only host can start the game
		if not network_manager.is_host:
			start_button.visible = false

	update_ui()

func load_heroes_data() -> void:
	var heroes_file = FileAccess.open("res://data/heroes.json", FileAccess.READ)
	if heroes_file:
		var heroes_json = JSON.parse_string(heroes_file.get_as_text())
		heroes_data = heroes_json.get("heroes", [])
		heroes_file.close()

func create_hero_buttons() -> void:
	# Clear existing buttons
	for child in hero_grid.get_children():
		child.queue_free()

	hero_buttons.clear()

	# Create a card for each hero
	for hero in heroes_data:
		var card = create_hero_card(hero)
		hero_grid.add_child(card)
		hero_buttons.append(card)

func create_hero_card(hero: Dictionary) -> Button:
	var button = Button.new()
	button.custom_minimum_size = Vector2(200, 200)
	button.toggle_mode = true

	# Store hero ID in metadata
	var hero_id = hero.get("id", "")
	button.set_meta("hero_id", hero_id)

	# Create card layout
	var vbox = VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
	vbox.mouse_filter = Control.MOUSE_FILTER_IGNORE
	vbox.add_theme_constant_override("separation", 5)

	# Add portrait
	var portrait = TextureRect.new()
	portrait.custom_minimum_size = Vector2(180, 100)
	portrait.expand_mode = TextureRect.EXPAND_FIT_WIDTH_PROPORTIONAL
	portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	portrait.mouse_filter = Control.MOUSE_FILTER_IGNORE

	# Try to load hero portrait
	var portrait_path = "res://assets/heroes/portraits/%s.png" % hero_id
	if FileAccess.file_exists(portrait_path):
		portrait.texture = load(portrait_path)
	else:
		# Create placeholder if image doesn't exist
		var placeholder_label = Label.new()
		placeholder_label.text = "?"
		placeholder_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		placeholder_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		placeholder_label.add_theme_font_size_override("font_size", 48)
		placeholder_label.custom_minimum_size = Vector2(180, 100)
		placeholder_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
		vbox.add_child(placeholder_label)
		vbox.add_child(portrait)
		portrait.visible = false

	if portrait.texture != null:
		vbox.add_child(portrait)

	# Add hero name
	var name_label = Label.new()
	name_label.text = hero.get("name", "Unknown")
	name_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	name_label.add_theme_font_size_override("font_size", 16)
	name_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	vbox.add_child(name_label)

	# Add ability description
	var ability_label = Label.new()
	var ability_desc = hero.get("ability_description", "")
	ability_label.text = ability_desc if ability_desc.length() < 50 else ability_desc.substr(0, 47) + "..."
	ability_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	ability_label.add_theme_font_size_override("font_size", 10)
	ability_label.add_theme_color_override("font_color", Color(0.7, 0.7, 0.8))
	ability_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	ability_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	vbox.add_child(ability_label)

	button.add_child(vbox)

	# Connect button press
	button.toggled.connect(_on_hero_button_toggled.bind(button))

	return button

func _on_hero_button_toggled(toggled_on: bool, button: Button) -> void:
	var hero_id = button.get_meta("hero_id", "")

	if is_multiplayer:
		# In multiplayer, each player selects only one hero
		if toggled_on:
			# Deselect previous hero
			if local_hero_selected != "":
				for btn in hero_buttons:
					if btn.get_meta("hero_id") == local_hero_selected:
						btn.button_pressed = false
						break

			local_hero_selected = hero_id

			# Notify other players (if needed)
			# For now, we'll just store locally
		else:
			if local_hero_selected == hero_id:
				local_hero_selected = ""
	else:
		# Local game: select heroes for all players
		if toggled_on:
			# Check if we can select more heroes
			if selected_heroes.size() >= player_count:
				# Deselect the first selected hero
				var first_hero = selected_heroes[0]
				selected_heroes.remove_at(0)

				# Find and deselect the button
				for btn in hero_buttons:
					if btn.get_meta("hero_id") == first_hero:
						btn.button_pressed = false
						break

			if not selected_heroes.has(hero_id):
				selected_heroes.append(hero_id)
		else:
			selected_heroes.erase(hero_id)

	update_ui()

func _on_player_count_slider_value_changed(value: float) -> void:
	player_count = int(value)
	player_count_label.text = "Number of Players: %d" % player_count

	# Adjust selected heroes if needed
	while selected_heroes.size() > player_count:
		var removed_hero = selected_heroes.pop_back()

		# Deselect the button
		for btn in hero_buttons:
			if btn.get_meta("hero_id") == removed_hero:
				btn.button_pressed = false
				break

	update_ui()

func update_ui() -> void:
	if is_multiplayer:
		# In multiplayer mode, enable start button if local hero is selected
		# (for host only)
		if network_manager.is_host:
			start_button.disabled = local_hero_selected.is_empty()

		# Highlight selected hero
		for button in hero_buttons:
			var hero_id = button.get_meta("hero_id")
			if hero_id == local_hero_selected:
				button.modulate = Color.GREEN
			else:
				button.modulate = Color.WHITE
	else:
		# Local game mode
		# Enable start button only if we have enough heroes selected
		start_button.disabled = selected_heroes.size() < player_count

		# Update button appearance to show selection order
		for i in range(hero_buttons.size()):
			var button = hero_buttons[i]
			var hero_id = button.get_meta("hero_id")

			if selected_heroes.has(hero_id):
				var player_num = selected_heroes.find(hero_id) + 1
				# Add selection indicator to the button
				button.modulate = GameConstants.PLAYER_COLORS[player_num - 1]
			else:
				button.modulate = Color.WHITE

func _on_back_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

func _on_start_button_pressed() -> void:
	if is_multiplayer:
		# In multiplayer mode, collect all player heroes
		if not network_manager.is_host:
			return

		# For now, assign random heroes to other players
		# In a full implementation, you'd wait for all players to select
		var player_heroes: Dictionary = {}
		var peer_ids = network_manager.players.keys()

		for i in range(peer_ids.size()):
			var peer_id = peer_ids[i]
			# Assign a hero (in real implementation, use player's selection)
			if peer_id == network_manager.get_local_peer_id():
				player_heroes[peer_id] = local_hero_selected
			else:
				# Assign random hero for now
				if i < heroes_data.size():
					player_heroes[peer_id] = heroes_data[i].get("id", "")

		# Start the game for all players
		network_manager.rpc("start_game", player_heroes)
	else:
		# Local game mode
		if selected_heroes.size() < player_count:
			return

		# Start the game with selected heroes
		var game_data = {
			"player_count": player_count,
			"selected_heroes": selected_heroes
		}

		# Store in a singleton or pass to next scene
		# For now, we'll just change to the game scene
		get_tree().change_scene_to_file("res://scenes/game.tscn")
