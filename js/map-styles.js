// Minimal raster basemap styles for MapLibre.
// Uses CARTO public tiles, keyless.

const CARTO_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/about-carto/">CARTO</a>';

export function lightRasterStyle() {
  return {
    version: 8,
    sources: {
      carto: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: CARTO_ATTR
      }
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#F5F2EB" } },
      { id: "carto", type: "raster", source: "carto", paint: { "raster-opacity": 0.7, "raster-saturation": -0.6, "raster-contrast": 0.05 } }
    ]
  };
}

export function darkRasterStyle() {
  return {
    version: 8,
    sources: {
      carto: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
          "https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: CARTO_ATTR
      },
      cartolabels: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"
        ],
        tileSize: 256
      }
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#121013" } },
      { id: "carto", type: "raster", source: "carto", paint: { "raster-opacity": 0.75 } },
      { id: "cartolabels", type: "raster", source: "cartolabels", paint: { "raster-opacity": 0.85 } }
    ]
  };
}
