import { popupTemplate } from '@/utils/commonTemplate';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import LayerList from '@arcgis/core/widgets/LayerList.js';
import webConfig from '@/webConfig';

/**
 * 将后端获取的数据处理为可以加入到FeatureLayer中的数据
 * @param {Array} datas 要往FeatureLayer中添加的数据
 * @returns 返回FeatureLayer.applyEdits要添加的数据
 */
export function getDatas(datas) {
  let features = [];
  for (let item in datas) {
    const data = datas[item];
    const pData = {
      attributes: {
        objectId: data.id,
        classification: data.classification,
        evaluation: data.evaluation,
        address: data.address,
        time: data.time,
        pic_url_before: '/public/' + data.pic_url_before,
        pic_url_after: '/public/' + data.pic_url_after
      },
      geometry: { x: data.lon, y: data.lat, type: 'point' }
    };
    features.push(pData);
  }
  return features;
}
/**
 * 获得一个空图层
 * @param {string} title 要获取类别的名字
 * @param {object} picRenderer 符号化的模板
 * @param {object} popupTemplate 弹出层的模板
 * @returns
 */
export function layer(title, picRenderer) {
  return new FeatureLayer({
    title: title,
    fields: [
      { name: 'objectId', type: 'integer' },
      { name: 'classification', type: 'string' },
      { name: 'evaluation', type: 'double' },
      { name: 'address', type: 'string' },
      { name: 'time', type: 'date' },
      { name: 'pic_url_before', type: 'string' },
      { name: 'pic_url_after', type: 'string' }
    ],
    source: [],
    geometryType: 'point',
    spatialReference: { wkid: 3857 },
    objectIdField: 'objectId',
    renderer: picRenderer,
    popupTemplate: popupTemplate,
    timeInfo: {
      startField: 'time',
      endField: 'time'
    },
    outFields: ['*']
  });
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
      console.log(layer);
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
