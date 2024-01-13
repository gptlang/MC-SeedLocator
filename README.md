# Locate MineCraft structures from the seed

Code and WASM are extracted/reversed from Chunk Base.

**Main changes**:

- Make compatible with NodeJS
- Refactoring to allow for calling as functions instead of using worker/signals

## Usage

`npm i mc-seedlocator`

```js
import {getAreaResult} from `mc-seedlocator`;
let optional_params = {
    tileSize: 16,
    searchWidth: 8,
    edition: "Java",
    javaVersion: 10200,
    tileScale: 0.25,
    dimension: "overworld",
    biomeHeight: "worldSurface",
  }
let x = 0
let z = 0
getAreaResult("yourseedhere", [x, z], [
    // "buriedTreasure",
    // "dungeon",
    // "netherFortress",
    // "bastionRemnant",
    // "endCity",
    // "slimeChunk",
    "stronghold",
    "village",
    // "mineshaft",
    // "woodlandMansion",
    // "pillagerOutpost",
    // "oceanRuin",
    // "oceanMonument",
    // "shipwreck",
    // "desertTemple",
    // "jungleTemple",
    "witchHut",
    "igloo",
    // "ruinedPortalOverworld",
    // "ruinedPortalNether",
    // "spawn",
    // "fossil",
    // "ravine",
    // "endGateway",
    // "amethystGeode",
    // "ancientCity",
    // "itemOverworld",
    // "oreVein",
    // "cave",
    // "desertWell",
    // "trailRuin",
  ], optional_params).then(console.log)
```
