---
sidebar_position: 1
description: Talo's Unity package helps you build games faster - set up save files, leaderboards, stat tracking and more in minutes.
---

# Installation

:::caution
Talo takes advantage of features from C# 9.0+. If you receive compilation errors after installing the package, you may need to make some configuration changes in your Unity project. For more info, [check out this article](https://learn.microsoft.com/en-us/visualstudio/gamedev/unity/unity-scripting-upgrade).
:::

## Import into Unity

### Using the Unity Asset Store (recommended)

The easiest way to add Talo to your project is by downloading it from the Unity Asset Store. Simply visit the [Talo Asset Store page](https://assetstore.unity.com/packages/tools/game-toolkits/talo-game-services-292832) and click "Add to My Assets".

To add Talo to your project, open the `Window > My Assets` window, find `Talo Game Services` and click `Download`.

![Importing Talo into a Unity project](/img/unity-my-assets.png)

If you want to update your package, simply repeat the same process.

### Downloading from itch.io

You can download the latest version of the Unity package from our [itch.io page](https://sleepystudios.itch.io/talo-unity).

Once downloaded, you can simply unzip the file and double-click `talo.unitypackage` to import it into your project.

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
