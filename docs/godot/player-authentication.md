---
sidebar_position: 2
description: Talo player authentication for Godot games manages logging players in, registration and verification without needing to build any of your own infrastructure.
---

# Player authentication

Talo player authentication manages logging players in, registering them and verifying them without needing to provision any of your own infrastructure. All of the examples below can be found in the `authentication` sample from the Godot plugin.

## Registering

To register a player, you can use `Talo.player_auth.register()`. At a minimum, you need to provide a username and a password for the player.

If you want the player to be able to verify their logins via email (two factor authentication), you will also need to provide an email and set the `verification_enabled` flag to `true`.

```gdscript
@onready var username: TextEdit = %Username
@onready var password: TextEdit = %Password
@onready var enable_verification: CheckBox = %EnableVerification
@onready var email: TextEdit = %Email
@onready var validation_label: Label = %ValidationLabel

...

var res = await Talo.player_auth.register(username.text, password.text, email.text, enable_verification.button_pressed)
if res != OK:
	match Talo.player_auth.last_error.get_code():
		TaloAuthError.ErrorCode.IDENTIFIER_TAKEN:
			validation_label.text = "Username is already taken"
		_:
			validation_label.text = Talo.player_auth.last_error.get_string()
```

Once a player is registered, a session will automatically be created for them and they will be logged in.

## Logging in

To start a session, call the `Talo.player_auth.login()` function with the username and password the player provided.

The `login()` function returns a `Talo.player_auth.LoginResult` which maps to:
1. A successful login
2. A successful login but the player must verify their details before creating the session
3. An unsuccessful login attempt

```gdscript
signal verification_required

@onready var username: TextEdit = %Username
@onready var password: TextEdit = %Password
@onready var validation_label: Label = %ValidationLabel

...

var res := await Talo.player_auth.login(username.text, password.text)
match res:
	Talo.player_auth.LoginResult.FAILED:
		match Talo.player_auth.last_error.get_code():
			TaloAuthError.ErrorCode.INVALID_CREDENTIALS:
				validation_label.text = "Username or password is incorrect"
			_:
				validation_label.text = Talo.player_auth.last_error.get_string()
	Talo.player_auth.LoginResult.VERIFICATION_REQUIRED:
		verification_required.emit()
	Talo.player_auth.LoginResult.OK:
		pass
```

### Automatic logins

After a successful login, the player's session token is stored locally. If a token is found when the game is opened, Talo will automatically identify the player.

You can disable this by adding this to your `settings.cfg`:

```
[player_auth]
auto_start_session=false
```

You can manually trigger this behaviour using `Talo.player_auth.start_session()`.

### The "session_found" and "session_not_found" signals

When `Talo.player_auth.start_session()` is called (automatically or manually), either the `Talo.player_auth.session_found` or the `Talo.player_auth.session_not_found` signal will be emitted if a token is found.

You can use these signals when deciding whether or not to show a splash screen or login screen:

```gdscript
func _ready() -> void:
	# auto_start_session should be disabled
	Talo.player_auth.session_found.connect(func (): go_to_loading())
	Talo.player_auth.session_not_found.connect(func (): go_to_login())
	Talo.player_auth.start_session()
```

## Verifying logins

If you need to verify a player's login, you need to call `Talo.player_auth.verify()` with the `code` sent to the player's email:

```gdscript
@onready var code: TextEdit = %Code
@onready var validation_label: Label = %ValidationLabel

...

var res := await Talo.player_auth.verify(code.text)
if res != OK:
	match Talo.player_auth.last_error.get_code():
		TaloAuthError.ErrorCode.INVALID_CREDENTIALS:
			validation_label.text = "Verification code is incorrect"
		_:
			validation_label.text = Talo.player_auth.last_error.get_string()
```

## Changing a player's password

To change the logged in player's password, you need to provide their current password and a new password to the `Talo.player_auth.change_password()` function:

```gdscript
signal password_change_success

@onready var current_password: TextEdit = %CurrentPassword
@onready var new_password: TextEdit = %NewPassword
@onready var validation_label: Label = %ValidationLabel

...

var res = await Talo.player_auth.change_password(current_password.text, new_password.text)
if res != OK:
	match Talo.player_auth.last_error.get_code():
		TaloAuthError.ErrorCode.INVALID_CREDENTIALS:
			validation_label.text = "Current password is incorrect"
		TaloAuthError.ErrorCode.NEW_PASSWORD_MATCHES_CURRENT_PASSWORD:
			validation_label.text = "New password must be different from the current password"
		_:
			validation_label.text = Talo.player_auth.last_error.get_string()    
else:
	password_change_success.emit()
```

## Changing a player's email

You can also change a player's email with the `Talo.player_auth.change_email()` function - just pass in their current password and a new email.

## Forgotten password flow

If a player forgets their password, you can begin the recovery flow by providing their email to the `Talo.player_auth.forgot_password()` function. Players who have not provided an email will not be able to initiate this flow:

```gdscript title="forgot_password.gd"
signal forgot_password_success

@onready var email: TextEdit = %Email

...

if await Talo.player_auth.forgot_password(email.text) == OK:
	forgot_password_success.emit()
```

If a player with the provided email exists, they'll receive a code that they'll use to set a new password.

To reset a password, pass the code from the email along with a new password to the `Talo.player_auth.reset_password()` function:

```gdscript title="reset_password.gd"
signal password_reset_success

@onready var code: TextEdit = %Code
@onready var new_password: TextEdit = %NewPassword
@onready var validation_label: Label = %ValidationLabel

...

var res = await Talo.player_auth.reset_password(code.text, new_password.text)
if res != OK:
	match Talo.player_auth.last_error.get_code():
		TaloAuthError.ErrorCode.PASSWORD_RESET_CODE_INVALID:
			validation_label.text = "Reset code is invalid"
		_:
			validation_label.text = Talo.player_auth.last_error.get_string()
else:
	password_reset_success.emit()
```

## Toggling verification

To toggle verification on and off, you can call the `Talo.player_auth.toggle_verification`. You'll need to provide the player's current password.

If you're enabling verification and the player doesn't already have an email address set, you will need to provide one as the third parameter of the function call. By providing an email address for a player that already has one set, you will overwrite the existing email address with the newly provided email address.

## Deleting accounts

Player accounts can be deleted using `Talo.player_auth.delete_account`. You'll need to provide the player's current password. When an account is successfully deleted several things will happen internally:

1. The alias will be deleted. We'll go into more detail about this below.
2. The current alias will be set to `null`.
3. The auth session will be cleared.

You'll need to handle these things by, for example, navigating back to a "Login" screen.

### Deleted aliases

When an alias is deleted, all leaderboard entries and game feedback associated with that alias will be deleted. Any channels owned by the alias will now have a `null` owner.

## Getting the last error

As shown in the examples above, whenever a request fails you can query the last error returned using the `Talo.player_auth.last_error` variable.

You can get the `TaloAuthError.ErrorCode` enum value using the `get_code()` function or the raw string using the `get_string()` function.

You can view all the authentication errors and their descriptions [here](/docs/http/player-auth-api#error-codes).
