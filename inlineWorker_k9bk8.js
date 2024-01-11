import Worker from './worker.js'

let wrk = new Worker("./helper.cjs", {type: "module"});
wrk.onerror = console.log;
wrk.addEventListener("message", console.log);
wrk.postMessage({
  type: "check",
  params: {
    seed: "129012903223",
    platform: {
      label: "Java 1.20",
      cb3World: {
        edition: "Java",
        javaVersion: 10200,
        config: {},
      },
    },
    tileSize: 8,
    tileScale: 0.25,
    biomeFilter: false,
    dimension: "overworld",
    pois: ["dungeon", "shipwreck", "cave", "ravine"],
    showBiomes: false,
    biomeHeight: "worldSurface",
    showHeights: false,
  },
  tile: {
    x: -32,
    z: -16,
    xL: 8,
    zL: 8,
    scale: 0.25,
  },
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
sleep(500000)