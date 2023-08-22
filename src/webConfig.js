export default {
  whiteListApi: ['/home', '/login'], //不需要验证的页面
  baseURL: 'http://127.0.0.1:666',
  picURL: 'http://localhost',
  routeUrl: 'https://localhost:6443/arcgis/rest/services/Map/NAServer/Route', //路径服务
  // routeFeaLayer: "https://localhost:6443/arcgis/rest/services/gz_road1/MapServer/0",//路网图层
  apiKey:
    'AAPKfa54aaed182d4a659d9e7f9ceb9cd368dRuPGakrRT2YdELm20nCBu9AN-GV-4IN-0zbAPhEIAdrkVvedspmIeiIHhNgHnBj',
  facilityLayer:
    'https://services9.arcgis.com/AyAb69B4O9fTpWkb/arcgis/rest/services/c66_facility/FeatureServer',
  regionUrl:
    'https://services9.arcgis.com/AyAb69B4O9fTpWkb/arcgis/rest/services/RegionAnalysis/FeatureServer'
};
