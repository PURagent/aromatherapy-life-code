# Local Figma repair plugin

This development plugin is an **unexecuted recovery artifact**, not evidence that the remote file is finished. It does not use Figma MCP calls, network access, account settings, or purchases. It operates only on the exact existing Amber Atelier page and recorded artboard/node IDs.

In Figma Desktop, use **Plugins → Development → Import plugin from manifest…** and choose this directory's `manifest.json`. Open https://www.figma.com/design/LqRPvQwLT21JOqbGjazCyh and run **Life Code · Finish Amber Atelier**. If the import dialog requires a plugin ID, use Figma's **Create new plugin** workflow to obtain the local development ID, then copy that generated ID into this manifest; no invented published ID is included.

Use **Repair CTA only** to fix the Thai label sizing. To populate the existing hero image slots, select two PNG crops of the actual running Three.js scene, then use **Repair + insert captures**. This changes only the two existing button instances and the two scene slots. Native text, layout, the actual Higgsfield editorial image, and all other nodes remain editable.

After execution, inspect the desktop and mobile artboards. The native form section and comparison against the final implementation still need completion as recorded in [the handoff](../figma-handoff.md).

Manifest conventions were checked against the [official Figma manifest documentation](https://developers.figma.com/docs/plugins/manifest/). This plugin has only received local JavaScript syntax validation; it has not been executed in the user's Figma editor.
