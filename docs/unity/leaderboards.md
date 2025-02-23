---
sidebar_position: 5
---

# Leaderboards

Talo leaderboards are highly customisable - for example you can configure the sort mode and whether entries must be unique (i.e. one or multiple per user).

To create a leaderboard, head over to [the dashboard](https://dashboard.trytalo.com), visit the leaderboards page and create your first leaderboard. Take note of the `Internal name` as this is how you'll be referring to your leaderboard.

:::tip
Check out this blog post on [how to add leaderboards to your Unity game](https://trytalo.com/blog/leaderboards-unity?utm_source=docs&utm_medium=tip) for a detailed walkthrough
:::

## Getting entries

Leaderboard entries are paginated: a maximum of 50 entries come back with each request. Use `Talo.Leaderboards.GetEntries()` to retrieve an array of entries:

```csharp title="GetEntries.cs"
string internalName = 'time-survived';
int page = 0;

public async void FetchEntries()
{
	LeaderboardEntry[] entries = await Talo.Leaderboards.GetEntries(internalName, page);
	if (entries.length == 0)
	{
	  // No entries on page
	}
	else
	{
		page++;
	}
}
```

### Getting entries for the current player

You can also get entries exclusively created by the current player using `Talo.Leaderboards.GetEntriesForCurrentPlayer()`.
### Getting archived entries

If your leaderboard uses refresh intervals (i.e. daily, weekly, monthly, yearly) you can get archived entries using the final parameter (`includeArchived`) of `GetEntries()` or `GetEntriesForCurrentPlayer()`.

```csharp
var res = await Talo.Leaderboards.GetEntries(leaderboardName, page, includeArchived: includeArchived)
// or
var res = await Talo.Leaderboards.GetEntriesForCurrentPlayer(leaderboardName, page, includeArchived)
```

## Creating entries

Use `Talo.Leaderboards.AddEntry()` to create an entry:

```csharp title="AddEntry.cs"
string internalName = 'time-survived';
float score = 300f;

public async void AddEntry()
{
	(LeaderboardEntry entry, bool updated) = await Talo.Leaderboards.AddEntry(internalName, score);
	Debug.Log(entry.position);
}
```

This function returns a tuple of the entry and whether it was updated.

Updated entries are only relevant if the leaderboard is set to unique. Leaderboard entries won't be updated if they are not better (depending on the sort mode) than the player's previous entry.

## Entry cache

After fetching your leaderboard entries you can take advantage of the internal cache to construct your UI, removing the need for any subsequent network requests.

You can use `Talo.Leaderboard.GetCachedEntries()` in the same way as `GetEntries()` above. Every entry fetched previously using `GetEntries()` will exist in the cache. The same logic applies for `GetEntriesForCurrentPlayer()` with `GetCachedEntriesForCurrentPlayer()`.

Similarly, updated results from `AddEntry()` will also be reflected in the cache - the entry returned from the response will be upserted and the positions of the other entries in the cache will be updated.

## Entry props

Along with a score, you can also send a dictionary of `props` with an entry. The key/value pairs will be stringified and can be used to, filter leaderboards on specific properties. For example, you could send a `team` prop:

```csharp
private async void OnPostClick()
{
	var username = root.Q<TextField>().text;
	var score = UnityEngine.Random.Range(0, 100);
	var team = UnityEngine.Random.Range(0, 2) == 0 ? "Blue" : "Red";

	await Talo.Players.Identify("username", username);
	(LeaderboardEntry entry, bool updated) = await Talo.Leaderboards.AddEntry(
		leaderboardName,
		score,
		("team", team)
	);

	infoLabel.text = $"You scored {score} for the {team} team.";
	if (updated) infoLabel.text += " Your highscore was updated!";

	entriesList.Rebuild();
}
```

You could then have a function that populates the leaderboard and checks if a team filter is active:

```csharp
private void OnFilterClick()
{
	filterIdx++;
	filter = GetNextFilter(filterIdx);

	infoLabel.text = $"Filtering on {filter.ToLower()}";
	root.Q<Button>("filter-btn").text = $"{GetNextFilter(filterIdx + 1)} team scores";

	if (filter == "All")
	{
		entriesList.itemsSource = Talo.Leaderboards.GetCachedEntries(leaderboardName);
	}
	else
	{
		entriesList.itemsSource = new List<LeaderboardEntry>(Talo.Leaderboards.GetCachedEntries(leaderboardName)
		  .FindAll((e) => e.GetProp("team", "") == filter));
	}

	entriesList.Rebuild();
}
```

The code above is available in the leaderboards sample included with the Talo Unity package.
