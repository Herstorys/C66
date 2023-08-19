export const popupTemplate = {
  title: '{classification}',
  content: [
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'OBJECTID',
          label: 'ID'
        },
        {
          fieldName: 'classification',
          label: '类别'
        },
        {
          fieldName: 'evaluation',
          label: '评分'
        },
        {
          fieldName: 'address',
          label: '地址'
        },
        {
          fieldName: 'time',
          label: '上传时间'
        }
      ]
    },
    {
      type: 'media',
      mediaInfos: [
        {
          title: '<b>{classification}</b>',
          type: 'image',
          caption: '原始的{classification}',
          value: {
            sourceURL: '{pic_url_before}'
          }
        },
        {
          title: '<b>{classification}</b>',
          type: 'image',
          caption: '识别后的{classification}',
          value: {
            sourceURL: '{pic_url_after}'
          }
        }
      ]
    }
  ]
};

export const picRenderer = {
  type: 'simple',
  symbol: {
    type: 'picture-marker',
    url: '/facilities.png'
  }
};

export function renderer(url) {
  return {
    type: 'simple',
    symbol: {
      type: 'picture-marker',
      url: url
    }
  };
}

export const textSymbol = {
  type: 'text',
  color: '#7A003C',
  text: '\ue61d',
  font: {
    size: 24,
    family: 'CalciteWebCoreIcons'
  }
};

export const heatmapRenderer = {
  type: 'heatmap',
  radius: 30,
  colorStops: [
    { color: [133, 193, 200, 0], ratio: 0 },
    { color: [133, 193, 200, 0], ratio: 0.01 },
    { color: [133, 193, 200, 255], ratio: 0.01 },
    { color: [133, 193, 200, 255], ratio: 0.01 },
    { color: [144, 161, 190, 255], ratio: 0.0925 },
    { color: [156, 129, 132, 255], ratio: 0.175 },
    { color: [167, 97, 170, 255], ratio: 0.2575 },
    { color: [175, 73, 128, 255], ratio: 0.34 },
    { color: [184, 48, 85, 255], ratio: 0.4225 },
    { color: [192, 24, 42, 255], ratio: 0.505 },
    { color: [200, 0, 0, 255], ratio: 0.5875 },
    { color: [211, 51, 0, 255], ratio: 0.67 },
    { color: [222, 102, 0, 255], ratio: 0.7525 },
    { color: [233, 153, 0, 255], ratio: 0.835 },
    { color: [244, 204, 0, 255], ratio: 0.9175 },
    { color: [255, 255, 0, 255], ratio: 1 }
  ],
  title: '无障碍设施热力图符号',
  maxDensity: 0.09,
  minDensity: 0
};

export const uniqueRenderer = {
  type: 'unique-value',
  legendOptions: {
    title: '无障碍设施'
  },
  field: 'classification',
  uniqueValueInfos: [
    {
      value: '无障碍电梯',
      label: '无障碍电梯',
      symbol: {
        type: 'picture-marker',
        url: '/无障碍电梯.png'
      }
    },
    {
      value: '无障碍坡道',
      label: '无障碍坡道',
      symbol: {
        type: 'picture-marker',
        url: '/无障碍坡道.png'
      }
    },
    {
      value: '无障碍楼梯',
      label: '无障碍楼梯',
      symbol: {
        type: 'picture-marker',
        url: '/无障碍楼梯.png'
      }
    },
    {
      value: '无障碍厕所',
      label: '无障碍厕所',
      symbol: {
        type: 'picture-marker',
        url: '/无障碍厕所.png'
      }
    },
    {
      value: '无障碍停车位',
      label: '无障碍停车位',
      symbol: {
        type: 'picture-marker',
        url: '/无障碍停车位.png'
      }
    },
    {
      value: '缘石坡道',
      label: '缘石坡道',
      symbol: {
        type: 'picture-marker',
        url: '/缘石坡道.png'
      }
    },
    {
      value: '盲道',
      label: '盲道',
      symbol: {
        type: 'picture-marker',
        url: '/盲道.png'
      }
    }
  ]
};
