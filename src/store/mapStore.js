// store.js
import { defineStore } from 'pinia';
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer.js';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer.js';
import Home from '@arcgis/core/widgets/Home.js';

const chineseBasemap = new TileLayer({
  url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
  title: '中文底图'
});
const tiledLayer = new WebTileLayer({
  urlTemplate:
    'http://{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=d78a106210e0de1d150387915a260a7b',
  subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
});

const tiledLayer_poi = new WebTileLayer({
  urlTemplate:
    'http://{subDomain}.tianditu.gov.cn/DataServer?T=cva_w&x={col}&y={row}&l={level}&tk=d78a106210e0de1d150387915a260a7b',
  subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
});

// const basemap = new Basemap({
//   baseLayers: [chineseBasemap],
//   id: "basemap",
//   title: "ChineseBasemap",
// });

export const useMapStore = defineStore('mapStore', {
  state: () => ({
    map: null,
    mapView: null
  }),

  actions: {
    initializeMap() {
      // 在此处初始化 Map 和 MapView
      const map = new Map({
        basemap: 'topo-vector'
        // {
        //   baseLayers: [tiledLayer, tiledLayer_poi]
        // }
        // layers: [],
      });
      const mapView = new MapView({
        map,
        center: [114.763, 25.793],
        zoom: 12,
        scale: 200000
      });
      const home = new Home({
        view: mapView
      });

      mapView.ui.remove('attribution');
      mapView.ui.move('zoom', 'bottom-left');
      mapView.ui.add(home, 'bottom-left');

      this.map = map;
      this.mapView = mapView;
    }
  }
});
