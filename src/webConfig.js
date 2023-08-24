export default {
  whiteListApi: ['/home', '/login'], //不需要验证的页面
  baseURL: 'http://127.0.0.1:666',
  picURL: 'http://localhost',
  routeUrl: 'https://localhost:6443/arcgis/rest/services/Map/NAServer/Route', //路径服务
  // routeFeaLayer: "https://localhost:6443/arcgis/rest/services/gz_road1/MapServer/0",//路网图层
  regionUrl:
    'https://localhost:6443/arcgis/rest/services/zg_nk_Map/MapServer/6',
  zg_nk_Url: 'https://localhost:6443/arcgis/rest/services/zg_nk_Map/MapServer/0'
};
