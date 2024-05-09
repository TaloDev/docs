---
sidebar_position: 1
---

# Installation

## Import into Unity

:::caution
Talo takes advantage of features from C# 9.0+. If you receive compilation errors after installing the package, you may need to make some configuration changes in your Unity project. For more info, [check out this article](https://learn.microsoft.com/en-us/visualstudio/gamedev/unity/unity-scripting-upgrade).
:::

### Using git (recommended)

Open the Package Manager (under the Window tab) in Unity. Click the `+` dropdown, `Add package from git URL…` and enter the following path: `https://github.com/TaloDev/unity-package.git`.

:::tip
You can install any version (found on the [releases page](https://github.com/TaloDev/unity/releases)) by adding `#version` to the git URL, e.g. https://github.com/TaloDev/unity-package.git#0.20.0
:::

This will add the latest stable release to your project. If you want to update your package, simply repeat the process.

### Downloading from itch.io

You can download the latest version of the Unity package from our [itch.io page](https://sleepystudios.itch.io/talo-unity).

Once downloaded, open the Package Manager (under the Window tab) in Unity. Click the `+` dropdown, `Add package from tarball…` and select the `.tgz` file you downloaded earlier.

## Generate an access key

Visit [the Talo dashboard](https://dashboard.trytalo.com), login or create an account (and confirm your email address), and visit the Access Keys page.

Choose the scopes available to your access key (you'll need the `read:players` and `write:players` scope to use the package) and create your access key.
Save your access key somewhere securely.

## Create a Talo asset

Once the package has been imported, right-click in your Resources folder, click `Create > Talo > Settings Asset`. Paste your newly-created access key into the access key field and you're ready to go.

:::caution
Your settings asset must always be at the top-level in the Resources folder and named `Talo Settings`.
:::

### Self-hosting

If you're self-hosting Talo, you can configure your custom endpoint here in the Settings Asset.
