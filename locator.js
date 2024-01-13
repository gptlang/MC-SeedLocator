const EventEmitter = require("node:events");
const { superComplexWasm } = require("./superComplexWasm.js");
globalThis.emitter = new EventEmitter();

var jsonStableStringify = (function () {
  var a = function (a, d) {
      d || (d = {}), "function" == typeof d && (d = { cmp: d });
      var e = d.space || "";
      "number" == typeof e && (e = Array(e + 1).join(" "));
      var f = "boolean" == typeof d.cycles ? d.cycles : !1,
        g =
          d.replacer ||
          function (a, b) {
            return b;
          },
        h =
          d.cmp &&
          (function (a) {
            return function (b) {
              return function (c, d) {
                var e = { key: c, value: b[c] },
                  f = { key: d, value: b[d] };
                return a(e, f);
              };
            };
          })(d.cmp),
        i = [];
      return (function j(a, d, k, l) {
        var m = e ? "\n" + new Array(l + 1).join(e) : "",
          n = e ? ": " : ":";
        if (
          (k && k.toJSON && "function" == typeof k.toJSON && (k = k.toJSON()),
          (k = g.call(a, d, k)),
          void 0 !== k)
        ) {
          if ("object" != typeof k || null === k) return JSON.stringify(k);
          if (b(k)) {
            for (var o = [], p = 0; p < k.length; p++) {
              var q = j(k, p, k[p], l + 1) || JSON.stringify(null);
              o.push(m + e + q);
            }
            return "[" + o.join(",") + m + "]";
          }
          if (-1 !== i.indexOf(k)) {
            if (f) return JSON.stringify("__cycle__");
            throw new TypeError("Converting circular structure to JSON");
          }
          i.push(k);
          for (var r = c(k).sort(h && h(k)), o = [], p = 0; p < r.length; p++) {
            var d = r[p],
              s = j(k, d, k[d], l + 1);
            if (s) {
              var t = JSON.stringify(d) + n + s;
              o.push(m + e + t);
            }
          }
          return i.splice(i.indexOf(k), 1), "{" + o.join(",") + m + "}";
        }
      })({ "": a }, "", a, 0);
    },
    b =
      Array.isArray ||
      function (a) {
        return "[object Array]" === {}.toString.call(a);
      },
    c =
      Object.keys ||
      function (a) {
        var b =
            Object.prototype.hasOwnProperty ||
            function () {
              return !0;
            },
          c = [];
        for (var d in a) b.call(a, d) && c.push(d);
        return c;
      };
  return a;
})();
function c(a, b, c) {
  if (a.getNoiseBiomeAreaAtHeightType) {
    var d = c.tileScale;
    if (!c.showBiomes) return null;
    if (b.sizeX % d !== 0 || b.sizeZ % d !== 0)
      throw new Error(
        "Invalid biome scale : " + d + " for size " + b.sizeX + "*" + b.sizeZ
      );
    var e = c.biomeHeight || "worldSurface",
      f = a.getNoiseBiomeAreaAtHeightType(
        4 * b.x,
        4 * b.z,
        b.sizeX / d,
        b.sizeZ / d,
        4 * d,
        e
      ),
      g =
        c.showHeights && "worldSurface" === e
          ? a.getApproxSurfaceArea(
              4 * b.x,
              4 * b.z,
              b.sizeX / d,
              b.sizeZ / d,
              4 * d,
              "oceanFloor"
            ).buffer
          : void 0;
    return { biomes: f.buffer, heights: g, scale: d };
  }
  if (!c.showBiomes) return null;
  for (
    var h = a.getInts(4 * b.x, 4 * b.z, 4 * b.sizeX, 4 * b.sizeZ, 63),
      i = new ArrayBuffer(b.sizeX * b.sizeZ),
      j = new Uint8Array(i),
      k = 0,
      l = 0;
    l < 4 * b.sizeZ;
    l += 4
  )
    for (var m = 0; m < 4 * b.sizeX; m += 4) {
      var n = (l * b.sizeX * 4 + m, h[(l + 2) * b.sizeX * 4 + (m + 2)]);
      (j[k] = n), k++;
    }
  return { biomes: i, scale: 1 };
}
CB3SharedTaskManager = {
  create: function (a) {
    var b = {};
    return (
      globalThis.emitter.addListener("message", function (c) {
        if ("sharedTaskResult" === c.type) {
          var d = c.key;
          if (!b[d]) return;
          b[d].onResult(c.data.result), delete b[d];
        } else if ("sharedTaskPerform" === c.type) {
          var d = c.key;
          if (!b[d]) return;
          b[d]
            .performTask()
            .then(function (c) {
              globalThis.emitter.emit("message", {
                type: "sharedTaskPerformResult",
                key: d,
                result: c,
              }),
                b[d].onResult(c),
                delete b[d];
            })
            .catch(function (a) {
              throw a;
            });
        }
      }),
      {
        handleTask: function (c, d) {
          if (b[c]) throw new Error("task already exists");
          return new Promise(function (e) {
            (b[c] = {
              onResult: e,
              performTask: d,
            }),
              globalThis.emitter.emit("message", {
                type: "sharedTaskGet",
                key: c,
              });
          });
        },
      }
    );
  },
};
let CB3Libs = superComplexWasm();

var g = null,
  h = null,
  i = null;
j = CB3SharedTaskManager.create(globalThis);
function a(b, c) {
  if ("object" == typeof b && null != b && "object" == typeof c && null != c) {
    var d = [0, 0];
    for (var e in b) d[0]++;
    for (var e in c) d[1]++;
    if (d[0] - d[1] !== 0) return !1;
    for (var e in b) if (!(e in c && a(b[e], c[e]))) return !1;
    for (var e in c) if (!(e in b && a(c[e], b[e]))) return !1;
    return !0;
  }
  return b === c;
}
function finder(c) {
  if (!a(i, c)) {
    var d = Object.assign({}, c.platform.cb3World, {
      seed: CB3Libs.Long.fromString(c.seed),
    });
    h &&
      (h[CB3Libs.Dimension.Overworld] && h[CB3Libs.Dimension.Overworld].free(),
      h[CB3Libs.Dimension.Nether] && h[CB3Libs.Dimension.Nether].free(),
      h[CB3Libs.Dimension.End] && h[CB3Libs.Dimension.End].free(),
      (h = null)),
      g && (g.free(), (g = null)),
      (h = {}),
      (h[CB3Libs.Dimension.Overworld] = CB3Libs.createBiomeProvider(d)),
      (h[CB3Libs.Dimension.Nether] = new CB3Libs.BiomeProviderNether(d)),
      (h[CB3Libs.Dimension.End] = new CB3Libs.BiomeProviderEnd(d));
    var e = superComplexWasm(jsonStableStringify(d));
    (g = CB3Libs.createPoiFinder(d, h, {
      sharedTask: function (a, b) {
        return j.handleTask(e + "--" + a, b);
      },
    })),
      (i = c);
  }
}
function getResults(a) {
  var b = a.tile,
    f = a.params;
  finder({
    seed: f.seed,
    platform: f.platform,
  });
  var i = {
    x: b.x,
    z: b.z,
    sizeX: b.xL,
    sizeZ: b.zL,
  };
  return g(i, f.pois).then(function (a) {
    var b = null,
      e = h[f.dimension];
      
    return (
      f.dimension === CB3Libs.Dimension.Overworld
        ? (b = c(e, i, f))
        : f.dimension === CB3Libs.Dimension.Nether
        ? (b = d(e, i, f))
        : f.dimension === CB3Libs.Dimension.End && (b = d(e, i, f)),
      {
        biomes: b ? b.biomes : null,
        biomeScale: b ? b.scale : 1,
        heights: b ? b.heights : null,
        biomeFilter: f.biomeFilter,
        poiResults: a,
      }
    );
  });
}

function getSupportedPPois(platform) {
  let c = CB3Libs.getSupportedPois(platform.cb3World);
  return {
    type: "getSupportedPois",
    supportedPois: c,
    platform: platform,
  };
}
// console.log(
//   getSupportedPPois({
//     label: "Java 1.20",
//     cb3World: {
//       edition: "Java",
//       javaVersion: 10200,
//       config: {},
//     },
//   })
// );

globalThis.emitter.addListener("message", (result) => {
  if (result.type == "sharedTaskGet") {
    globalThis.emitter.emit("message", {
      key: result.key,
      type: "sharedTaskPerform",
    });
  } 
});
/**
 *  Finds the closest structure to a given point
 * @constructor
 * @param {[number, number]} coords - The x and z of the point
 * @param {[number, number][]} features - The features to search
 */
function findClosest(coords, features){
  let closest = null
  let closestDistance = null
  features.forEach((feature) => {
    let distance = Math.sqrt(Math.pow(coords[0] - feature.x, 2) + Math.pow(coords[1] - feature.z, 2))
    if (!closest || distance < closestDistance) {
      closest = feature
      closestDistance = distance
    }
  })
  return closest
  
}
/**
 *  Gets structures in a given area
 * @constructor
 * @param {string} seed - The world seed
 * @param {[number, number]} coords - The x and z of the middle of the area
 * @param {string[]} pois - The structures to search for
 * @param {object} optionals - Optional parameters
 */
async function getAreaResult(seed, coords, pois, optionals) {
  let params = {
    tileSize: 16,
    searchWidth: 8,
    edition: "Java",
    javaVersion: 10200,
    tileScale: 0.25,
    dimension: "overworld",
    biomeHeight: "worldSurface",
  }
  if (optionals) {
    params = {...params, ...optionals}
  }
  [x, z] = coords
  // Make the x and z center of the search area by subtracting half the search width
  // Make sure it's still an integer
  x -= Math.round(params.searchWidth * params.tileSize / 2)
  z -= Math.round(params.searchWidth * params.tileSize / 2)
  let request = {
    type: "check",
    params: {
      seed: seed,
      platform: {
        cb3World: {
          edition: params.edition,
          javaVersion: params.javaVersion,
          config: {},
        },
      },
      tileSize: params.tileSize,
      tileScale: params.tileScale,
      biomeFilter: false,
      dimension: params.dimension,
      pois: pois,
      showBiomes: true,
      biomeHeight: params.biomeHeight,
      showHeights: true,
    },
    tile: {
      x: x,
      z: z,
      xL: params.tileSize,
      zL: params.tileSize,
      scale: params.tileScale,
    },
  }
  let allResults = []
  let strongholdResult = null
  if (pois.includes('stronghold')) {
    // Create promise for stronghold
    strongholdResult = new Promise((resolve) => {
    globalThis.emitter.addListener("message", (result) => {
      if (result.type === "sharedTaskPerformResult"){
        resolve(result.result)
      }
    })
  })
  }
  for (let h = 0; h < params.searchWidth; h++) {
    for (let v = 0; v < params.searchWidth; v++) {
      let result = (await getResults(request))

      for (const key in result.poiResults) {
        if (result.poiResults.hasOwnProperty(key)) {
          const value = result.poiResults[key];
          if (value.length > 0) {
            value[0][0] *= params.tileScale
            value[0][1] *= params.tileScale
            allResults.push({
              type: key,
              x: value[0][0],
              z: value[0][1],
              metadata: value[0][2]
              
            })
          }
        }
      }
      
      request.tile.z += params.tileSize
    }
    request.tile.x += params.tileSize
  }
 
  // Wait for stronghold promise to resolve
  if (strongholdResult) {
    strongholdResult = await strongholdResult
    let closestStronghold = findClosest(coords, strongholdResult)
    allResults.push({
      type: "stronghold",
      x: closestStronghold[0] * params.tileSize,
      z: closestStronghold[1] * params.tileSize,
      metadata: {}
    })
  }
  return allResults
}
getAreaResult("4684276156830303372", [0, 0], [
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
]).then(console.log)