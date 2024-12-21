---
sidebar_position: 12
description: Talo Feedback allows you to receive feedback directly from players in your Godot game. Feedback can be categorised, analysed and filtered to improve your game.
---

# Feedback

Talo feedback lets you easily gather and categorise player feedback.

To create a feedback category, head over to [the dashboard](https://dashboard.trytalo.com), visit the feedback page and click "Edit categories". Take note of the `Internal name` of the category you create as this is how you'll be referring to it inside your game.

## Getting available categories

To list all the available categories for your game, use the Feedback API `get_categories()` function:

```gdscript title="get_categories_button.gd"
extends Button

func _on_pressed() -> void:
	var categories = await Talo.feedback.get_categories()

  	if categories.size() == 0:
    	print("No categories found. Create some in the Talo dashboard!")
	else:
		var mapped = categories.map(func (c): return c.internal_name)
		print("Category internal names: " + ", ".join(mapped)) # prints: "bugs, gameplay-feedback, terrain-issues"
```

## Sending feedback

Once you have your available categories and their `internal_names`, you can simply call the `send()` function with the player's comment and your chosen category's internal name:

```gdscript title="send_feedback_button.gd"
extends Button

@export var internal_name: String
@export var feedback_comment: String

func _on_pressed() -> void:
	await Talo.feedback.send(internal_name, feedback_comment)
	print("Feedback sent for %s: %s" % [internal_name, feedback_comment])
```

:::tip
You can attach additional metadata (player props, game state, etc.) to feedback by appending it to the `feedback_comment` String before calling `send()`.
:::
