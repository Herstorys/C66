import { defineStore } from 'pinia';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import webConfig from '@/webConfig';
import { popupTemplate } from '@/utils/commonTemplate';

export const useLayerStore = defineStore('layer', {
  state: () => ({
    layer: new FeatureLayer({
      title: '无障碍设施',
      url: webConfig.facilityLayer,
      popupTemplate: popupTemplate,
      outFields: ['*']
    })
  }),
  actions: {
    addFeature(features) {
      this.layer
        .applyEdits({
          addFeatures: features
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
});
