import proj4 from 'proj4';

// VN-2000 Đắk Lắk 3° (Kinh tuyến trục L0 = 108°30' = 108.5°, k0 = 0.9999, False Easting = 500.000m, False Northing = 0m)
// Ellipsoid WGS84 với 7 thông số dịch chuyển hệ tọa độ quốc gia VN-2000 -> WGS84
const VN2000_DAKLAK_PROJ = '+proj=tmerc +lat_0=0 +lon_0=108.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.9041,-39.3033,-111.4503,-0.00928836,0.00975456,-0.011743,0.0000011497 +units=m +no_defs';
const WGS84_PROJ = 'EPSG:4326';

/**
 * Chuyển đổi tọa độ VN-2000 tỉnh Đắk Lắk (X: Easting, Y: Northing) sang WGS 84 (EPSG:4326 - Lat, Lng)
 * @param {number|string} x - Tọa độ X (Đông giả / Easting, VD: 582120)
 * @param {number|string} y - Tọa độ Y (Bắc giả / Northing, VD: 1385400)
 * @returns {{lat: number, lng: number, formatted: string} | null}
 */
export function convertVN2000ToWGS84(x, y) {
  let easting = parseFloat(x);
  let northing = parseFloat(y);

  if (isNaN(easting) || isNaN(northing) || easting === 0 || northing === 0) {
    return null;
  }

  // Tự động đảo trục nếu người dùng nhập ngược X (Northing ~ 1.3M) và Y (Easting ~ 580K)
  if (easting > northing && easting > 1000000 && northing < 1000000) {
    const temp = easting;
    easting = northing;
    northing = temp;
  }

  try {
    // proj4 trả về mảng [longitude, latitude]
    const [lng, lat] = proj4(VN2000_DAKLAK_PROJ, WGS84_PROJ, [easting, northing]);

    // Kiểm tra phạm vi tọa độ hợp lệ thuộc khu vực Đắk Lắk / Tây Nguyên (Lat: 11.5 - 13.5°N, Lng: 107.5 - 110.0°E)
    if (lat >= 10 && lat <= 15 && lng >= 105 && lng <= 112) {
      const latNum = Number(lat.toFixed(6));
      const lngNum = Number(lng.toFixed(6));
      return {
        lat: latNum,
        lng: lngNum,
        formatted: `${latNum}° N, ${lngNum}° E`
      };
    }
  } catch (error) {
    console.error('Lỗi chuyển đổi tọa độ VN-2000 sang WGS84:', error);
  }

  return null;
}

/**
 * Lấy tọa độ hiển thị WGS84 (Lat, Lng) cho bản ghi vi phạm.
 * Ưu tiên chuyển đổi từ VN-2000 (X, Y) nếu có, hoặc dùng WGS84 sẵn có.
 */
export function getWGS84Location(item) {
  if (!item) return null;

  // 1. Thử chuyển đổi từ VN-2000 (viTriX, viTriY)
  if (item.viTriX && item.viTriY) {
    const converted = convertVN2000ToWGS84(item.viTriX, item.viTriY);
    if (converted) return converted;
  }

  // 2. Nếu đã có sẵn lat/lng hợp lệ
  if (item.lat && item.lng) {
    return {
      lat: Number(item.lat),
      lng: Number(item.lng),
      formatted: `${Number(item.lat).toFixed(6)}° N, ${Number(item.lng).toFixed(6)}° E`
    };
  }

  return null;
}
