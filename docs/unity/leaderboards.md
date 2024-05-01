---
sidebar_position: 5
---

# Leaderboards

Talo leaderboards are highly customisable - for example you can configure the sort mode and whether entries must be unique (i.e. one or multiple per user).

To create a leaderboard, head over to [the dashboard](https://dashboard.trytalo.com), visit the leaderboards page and create your first leaderboard. Take note of the `Internal name` as this is how you'll be referring to your leaderboard.

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
  } else
  {
    page++;
  }
}
```

### Getting entries for the current player

You can also get entries exclusively created by the current player using `Talo.Leaderboards.GetEntriesForCurrentPlayer()`.

## Creating entries

Use `Talo.Leaderboards.AddEntry` to create an entry:

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
