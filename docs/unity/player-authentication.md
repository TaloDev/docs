---
sidebar_position: 2
description: Talo player authentication for Unity games manages logging players in, registration and verification without needing to build any of your own infrastructure.
---

# Player authentication

Talo player authentication manages logging players in, registering them and verifying them without needing to provision any of your own infrastructure. More examples can be found in the "AuthenticationDemo" sample included with the Unity package.

## Registering

To register a player, you can use `Talo.PlayerAuth.Register()`. At a minimum, you need to provide a username and a password for the player.

If you want the player to be able to verify their logins via email (two factor authentication), you will also need to provide an email and set the `verificationEnabled` flag to `true`.

```csharp
private async void OnRegisterClick()
{
	var username = root.Q<TextField>("username").text;
	var password = root.Q<TextField>("password").text;
	var enableVerification = root.Q<Toggle>("enable-verification").value;
	var email = root.Q<TextField>("email").text;

	var validationLabel = root.Q<Label>("validation-label");

	if (string.IsNullOrEmpty(username))
	{
		validationLabel.text = "Username is required";
		return;
	}

	if (string.IsNullOrEmpty(password))
	{
		validationLabel.text = "Password is required";
		return;
	}

	validationLabel.text = "";

	try
	{
		await Talo.PlayerAuth.Register(username, password, email, enableVerification);
	}
	catch (PlayerAuthException e)
	{
		validationLabel.text = e.ErrorCode switch
		{
			PlayerAuthErrorCode.IDENTIFIER_TAKEN => "Username is already taken",
			_ => e.Message
		};
	}
	catch (Exception e)
	{
		validationLabel.text = e.Message;
	}
}
```

Once a player is registered, a session will automatically be created for them and they will be logged in.

## Logging in

To start a session, call the `Talo.PlayerAuth.Login()` function with the username and password the player provided.

The `Login()` function returns a boolean denoting whether or not verification is required. If this function returns `true`, the player will need to enter the verification code sent to the email they provided.

```csharp
private async void OnLoginClick()
{
	var username = root.Q<TextField>("username").text;
	var password = root.Q<TextField>("password").text;
	var validationLabel = root.Q<Label>("validation-label");

	if (string.IsNullOrEmpty(username))
	{
		validationLabel.text = "Username is required";
		return;
	}

	if (string.IsNullOrEmpty(password))
	{
		validationLabel.text = "Password is required";
		return;
	}

	validationLabel.text = "";

	try
	{
		if (await Talo.PlayerAuth.Login(username, password))
		{
			SendMessageUpwards("GoToVerify", SendMessageOptions.RequireReceiver);
		}
	}
	catch (PlayerAuthException e)
	{
		validationLabel.text = e.ErrorCode switch
		{
			PlayerAuthErrorCode.INVALID_CREDENTIALS => "Username or password is incorrect",
			_ => e.Message
		};
	}
	catch (Exception e)
	{
		validationLabel.text = e.Message;
	}
}
```

### Automatic logins

After a successful login, the player's session token is stored locally. If a token is found when the game is opened, Talo will automatically identify the player.

You can disable this behaviour by toggling off the `autoStartSession` setting in your Talo Settings Asset.

You can manually trigger this behaviour using `Talo.PlayerAuth.StartSession()`.

### The "OnSessionFound" and "OnSessionNotFound" events

When `Talo.PlayerAuth.StartSession()` is called (automatically or manually), either the `Talo.PlayerAuth.OnSessionFound` or the `Talo.PlayerAuth.OnSessionNotFound` event will be invoked if a token is found.

You can use these events when deciding whether or not to show a splash screen or login screen:

```csharp
private void Start()
{
	// autoStartSession should be disabled
	Talo.PlayerAuth.OnSessionFound += () => GoToLoading();
	Talo.PlayerAuth.OnSessionNotFound += () => GoToLogin();
	Talo.PlayerAuth.StartSession();
}
```

## Verifying logins

If you need to verify a player's login, you need to call `Talo.PlayerAuth.Verify()` with the `code` sent to the player's email:

```csharp
private async void OnVerifyClick()
{
	var code = root.Q<TextField>("code").text;
	var validationLabel = root.Q<Label>("validation-label");

	if (string.IsNullOrEmpty(code))
	{
		validationLabel.text = "Verification code is required";
		return;
	}

	validationLabel.text = "";

	try
	{
		await Talo.PlayerAuth.Verify(code);
	}
	catch (PlayerAuthException e)
	{
		validationLabel.text = e.ErrorCode switch
		{
			PlayerAuthErrorCode.VERIFICATION_CODE_INVALID => "Verification code is incorrect",
			_ => e.Message
		};
	}
	catch (Exception e)
	{
		validationLabel.text = e.Message;
	}
}
```

## Changing a player's password

To change the logged in player's password, you need to provide their current password and a new password to the `Talo.PlayerAuth.ChangePassword()` function:

```csharp
try
{
	await Talo.PlayerAuth.ChangePassword(currentPassword, newPassword);
}
catch (PlayerAuthException e)
{
	validationLabel.text = e.ErrorCode switch
	{
		PlayerAuthErrorCode.INVALID_CREDENTIALS => "Current password is incorrect",
		PlayerAuthErrorCode.NEW_PASSWORD_MATCHES_CURRENT_PASSWORD => "New password must be different from the current password",
		_ => e.Message
	};
}
catch (Exception e)
{
	validationLabel.text = e.Message;
}
```

## Changing a player's email

You can also change a player's email with the `Talo.PlayerAuth.ChangeEmail()` function - just pass in their current password and a new email.

## Forgotten password flow

If a player forgets their password, you can begin the recovery flow by providing their email to the `Talo.PlayerAuth.ForgotPassword()` function. Players who have not provided an email will not be able to initiate this flow.

If a player with the provided email exists, they'll receive a code that they'll use to set a new password.

To reset a password, pass the code from the email along with a new password to the `Talo.PlayerAuth.ResetPassword()` function:

```csharp
try
{
	await Talo.PlayerAuth.ResetPassword(code, newPassword);
}
catch (PlayerAuthException e)
{
	validationLabel.text = e.ErrorCode switch
	{
		PlayerAuthErrorCode.PASSWORD_RESET_CODE_INVALID => "Reset code is invalid",
		_ => e.Message
	};
}
catch (Exception e)
{
	validationLabel.text = e.Message;
}
```

## Toggling verification

To toggle verification on and off, you can call the `Talo.PlayerAuth.ToggleVerification`. You'll need to provide the player's current password.

If you're enabling verification and the player doesn't already have an email address set, you will need to provide one as the third parameter of the function call. By providing an email address for a player that already has one set, you will overwrite the existing email address with the newly provided email address.

## Deleting accounts

Player accounts can be deleted using `Talo.PlayerAuth.DeleteAccount`. You'll need to provide the player's current password. When an account is successfully deleted several things will happen internally:

1. The alias will be deleted. We'll go into more detail about this below.
2. The current alias will be set to `null`.
3. The auth session will be cleared.

You'll need to handle these things by, for example, navigating back to a "Login" screen.

### Deleted aliases

When an alias is deleted, all leaderboard entries and game feedback associated with that alias will be deleted. Any channels owned by the alias will now have a `null` owner.

## Exceptions and error codes

As shown in the examples above, whenever a request fails with an authentication-related error, a `PlayerAuthException` will be thrown.

The exception provides a `ErrorCode` property that returns a matching `PlayerAuthErrorCode` enum value for the error response.

You can view all the authentication errors and their descriptions [here](/docs/http/player-auth-api#error-codes).
