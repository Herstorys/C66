import { popupTemplate } from '@/utils/commonTemplate';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import LayerList from '@arcgis/core/widgets/LayerList.js';
import webConfig from '@/webConfig';
import { getOnlyTypeFaccility } from './commonFunction';
import Graphic from '@arcgis/core/Graphic';
import * as promiseUtils from '@arcgis/core/core/promiseUtils';

/**
 * 将后端获取的数据处理为可以加入到FeatureLayer中的数据
 * @param {Array} datas 要往FeatureLayer中添加的数据
 * @returns 返回FeatureLayer.applyEdits要添加的数据
 */
export function getDatas(datas) {
  let features = [];
  for (let item in datas) {
    const data = datas[item];
    const originalDate = new Date(data.time);
    const time = originalDate.getTime();

    const pData = new Graphic({
      attributes: {
        OBJECTID: data.id,
        classification: data.classification,
        evaluation: data.evaluation,
        address: data.address,
        time: time,
        pic_url_before: '/public/' + data.pic_url_before,
        pic_url_after: '/public/' + data.pic_url_after
      },
      geometry: { longitude: data.lon, latitude: data.lat, type: 'point' }
    });
    features.push(pData);
  }
  return features;
}

// function getData(data) {
//   return new Promise((resolve, reject) => {
//     if (data === null) {
//       reject(new Error('没有数据！'));
//       return;
//     }
//     const pData = {
//       attributes: {
//         objectId: data.id,
//         classification: data.classification,
//         evaluation: data.evaluation,
//         address: data.address,
//         time: data.time,
//         pic_url_before: '/public/' + data.pic_url_before,
//         pic_url_after: '/public/' + data.pic_url_after
//       },
//       geometry: { x: data.lon, y: data.lat, type: 'point' }
//     };
//     resolve(new Graphic(pData));
//   });
// }

/**
 * 获得一个空图层
 * @param {string} title 要获取类别的名字
 * @param {object} renderer 符号化的模板
 * @param {object} popupTemplate 弹出层的模板
 * @returns
 */
export function createLayer(title, renderer) {
  return new FeatureLayer({
    title: title,
    fields: [
      { name: 'OBJECTID', type: 'integer' },
      { name: 'classification', alias: '类别', type: 'string' },
      { name: 'evaluation', alias: '评分', type: 'double' },
      { name: 'address', alias: '地址', type: 'string' },
      { name: 'time', alias: '时间', type: 'date' },
      { name: 'pic_url_before', type: 'string' },
      { name: 'pic_url_after', type: 'string' }
    ],
    source: [],
    geometryType: 'point',
    spatialReference: {
      wkid: 4326
    },
    objectIdField: 'OBJECTID',
    renderer: renderer,
    popupTemplate: popupTemplate,
    outFields: ['*']
  });
}

/**
 * 获得一个类别的图层
 * @param {string} title 要获取类别的名字
 * @param {object} renderer 符号化的模板
 * @param {object} popupTemplate 弹出层的模板
 * @returns FeatureLayer
 */
export function featureLayer(title, renderer) {
  const facilityLayer = createLayer(title, renderer);
  const features = getOnlyTypeFaccility(title);
  features.then((result) => {
    facilityLayer.fullExtent = getExtent(result);
    facilityLayer
      .applyEdits({
        addFeatures: result
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return facilityLayer;
}

export function getExtent(graphics) {
  // 遍历点的坐标获取范围
  let xmin = Infinity;
  let ymin = Infinity;
  let xmax = -Infinity;
  let ymax = -Infinity;
  graphics.forEach((graphic) => {
    const geometry = graphic.geometry;

    if (geometry.type === 'point') {
      const x = geometry.x;
      const y = geometry.y;
      xmin = Math.min(xmin, x);
      ymin = Math.min(ymin, y);
      xmax = Math.max(xmax, x);
      ymax = Math.max(ymax, y);
    }
  });
  return {
    spatialReference: { wkid: 4326 }, // 适当设置坐标系
    xmin: xmin,
    ymin: ymin,
    xmax: xmax,
    ymax: ymax
  };
}

export function layerList(mapView, layer) {
  const layerList = new LayerList({
    view: mapView,
    listItemCreatedFunction: defineActions
  });

  async function defineActions(event) {
    const item = event.item;
    await item.layer.when();
    item.actionsSections = [
      [
        {
          title: '缩放到图层范围',
          className: 'esri-icon-zoom-out-fixed',
          id: 'full-extent'
        }
      ],
      [
        {
          title: '增加透明度',
          className: 'esri-icon-up',
          id: 'increase-opacity'
        },
        {
          title: '减小透明度',
          className: 'esri-icon-down',
          id: 'decrease-opacity'
        }
      ]
    ];
  }

  layerList.on('trigger-action', (event) => {
    const id = event.action.id;
    if (id === 'full-extent') {
      mapView.goTo(layer.fullExtent).catch((error) => {
        console.error(error);
      });
    } else if (id === 'increase-opacity') {
      if (layer.opacity < 1) {
        layer.opacity += 0.25;
      }
    } else if (id === 'decrease-opacity') {
      if (layer.opacity > 0) {
        layer.opacity -= 0.25;
      }
    }
  });
  mapView.ui.add(layerList, 'top-right');
  return layerList;
}

export function getFacilities() {
  return new FeatureLayer({
    title: '无障碍设施',
    url: webConfig.facilityLayer
  });
}
