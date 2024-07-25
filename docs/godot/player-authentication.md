---
sidebar_position: 2
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

The `login()` function returns a tuple of `[Error, bool]`. The `Error` refers to the result of the login operation and the `bool` refers to whether the player needs to verify their details before creating the session.

```gdscript
signal verification_required

@onready var username: TextEdit = %Username
@onready var password: TextEdit = %Password
@onready var validation_label: Label = %ValidationLabel

...

var res = await Talo.player_auth.login(username.text, password.text)
if res[0] != OK:
  match Talo.player_auth.last_error.get_code():
    TaloAuthError.ErrorCode.INVALID_CREDENTIALS:
      validation_label.text = "Username or password is incorrect"
    _:
      validation_label.text = Talo.player_auth.last_error.get_string()
else:
  if res[1]:
    verification_required.emit()
```

## Verifying logins

If you need to verify a player's login, you need to call `Talo.player_auth.verify()` with the `code` sent to the player's email:

```gdscript
@onready var code: TextEdit = %Code
@onready var validation_label: Label = %ValidationLabel

...

var res = await Talo.player_auth.verify(code.text)
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

## Getting the last error

As shown in the examples above, whenever a request fails you can query the last error returned using the `Talo.player_auth.last_error` variable.

You can get the `TaloAuthError.ErrorCode` enum value using the `get_code()` function or the raw string using the `get_string()` function.

You can view all the authentication errors and their descriptions [here](/docs/http/player-auth-api#error-codes).
