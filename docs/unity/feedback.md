---
sidebar_position: 11
description: Talo Feedback allows you to receive feedback directly from players in your Unity game. Feedback can be categorised, analysed and filtered to improve your game.
---

# Feedback

Talo feedback lets you easily gather and categorise player feedback.

To create a feedback category, head over to [the dashboard](https://dashboard.trytalo.com), visit the feedback page and click "Edit categories". Take note of the `Internal name` of the category you create as this is how you'll be referring to it inside your game.

## Getting available categories

To list all the available categories for your game, use the Feedback API `GetCategories()` function:

```csharp title="GetCategories.cs"
using UnityEngine;
using TaloGameServices;
using System.Threading.Tasks;
using System.Linq;

public class GetCategories : MonoBehaviour
{
	public async void OnButtonClick()
	{
		await FetchCategories();
	}

	private async Task FetchCategories()
	{
		var categories = await Talo.Feedback.GetCategories();

		if (categories.Length == 0)
		{
			Debug.Log("No categories found. Create some in the Talo dashboard!");
		}
		else
		{
			var mapped = categories.Select((c) => c.internalName);
			Debug.Log($"Categories: " + string.Join(',', mapped)); // prints: "bugs, gameplay-feedback, terrain-issues"
		}
	}
}
```

## Sending feedback

Once you have your available categories and their `internalNames`, you can simply call the `Send()` function with the player's comment and your chosen category's internal name:

```csharp title="SendFeedback.cs"
using UnityEngine;
using TaloGameServices;

public class SendFeedback : MonoBehaviour
{
	public string internalName, feedbackComment;

	public async void OnButtonClick()
	{
		await Talo.Feedback.Send(internalName, feedbackComment);
		Debug.Log($"Feedback sent for {internalName}: {feedbackComment}");
	}
}
```

### Additional context with props

You can also provide extra information with `props` by providing `(string, string)` tuples as the final parameter(s) of `Send()`. Props will be displayed in the Talo dashboard and you can also filter by props, e.g. looking at all feedback from a specific game version.

```csharp
public async void OnButtonClick()
{
	var categoryInternalName = "worldgen_feedback";
	var feedbackComment = "Too many spikes!";

	await Talo.Feedback.Send(categoryInternalName, feedbackComment, ("seed", "432423432"), ("difficultyLevel", "EASY"));
}
```
