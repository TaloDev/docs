---
sidebar_position: 1
---

# Installation

## Import into Unity

Open the Package Manager (under the Window tab) in Unity. Click the `+` dropdown, `Add package from git URL…` and enter the following path: `https://github.com/TaloDev/unity-package.git`.

:::tip
You can install pre-release versions (found on the [releases page](https://github.com/TaloDev/unity/releases)) by adding `#version` to the git URL, e.g. https://github.com/TaloDev/unity-package.git#0.6.0-pre.0
:::

This will add the latest stable release to your project. If you want to update your SDK, simply repeat the process.

## Generate an access key

Visit [the Talo dashboard](https://dashboard.trytalo.com), login or create an account (and confirm your email address), and visit the Access Keys page.

Choose the scopes available to your access key (you'll need the `read:players` and `write:players` scope to use the SDK) and create your access key.
Save your access key somewhere securely.

## Create a Talo asset

Once the package has been imported, right-click in your Resources folder, click `Create > Talo > Settings Asset`. Paste your newly-created access key into the access key field and you're ready to go.

:::caution
Your settings asset must always be at the top-level in the Resources folder and named `Talo Settings`.
:::

### Self-hosting

If you're self-hosting Talo, you can configure your custom endpoint here in the Settings Asset.
