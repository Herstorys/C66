import { get_facilities, get_facility } from '@/api/facilities';
import { getDatas } from './layerConfig';
/**
 * 计算属性用于处理时间格式转换
 * @param {Date} time 时间
 * @returns 年/月/日 时:分:秒
 */
export function formattedTime(time) {
  const dateObj = new Date(time);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export async function getAllFacilities() {
  try {
    const response = await get_facilities();
    const datas = response.data;
    return getDatas(datas);
  } catch (error) {
    console.log(error);
    throw error; // 抛出错误，继续在调用方处理错误
  }
}

export async function getOnlyTypeFaccility(title) {
  try {
    const response = await get_facility(title);
    const datas = response.data;
    return getDatas(datas);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
