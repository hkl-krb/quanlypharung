import { 
  db, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
} from '../firebase';
import { INITIAL_DEFORESTATION_DATA_2026, INITIAL_DEFORESTATION_DATA_2025 } from '../data/initialData';
import { DEMO_USERS } from '../data/usersData';

const INCIDENTS_COLLECTION = 'incidents';
const USERS_COLLECTION = 'users';
const ALL_INITIAL_DATA = [...INITIAL_DEFORESTATION_DATA_2026, ...INITIAL_DEFORESTATION_DATA_2025];

/**
 * Tự động đồng bộ dữ liệu Vụ việc vi phạm với Firebase Cloud Firestore thời gian thực (Realtime)
 * @param {Function} onDataUpdate - Callback nhận dữ liệu cập nhật mới nhất
 * @returns {Function} Unsubscribe function
 */
export function subscribeToIncidents(onDataUpdate) {
  const colRef = collection(db, INCIDENTS_COLLECTION);

  return onSnapshot(colRef, async (snapshot) => {
    // Nếu Firestore trống (lần khởi tạo đầu tiên), tự động nạp 194 vụ việc gốc (2025 & 2026) lên Cloud
    if (snapshot.empty) {
      console.log('🔥 Cloud Firestore chưa có dữ liệu, đang khởi tạo 194 vụ việc gốc...');
      await seedInitialIncidents(ALL_INITIAL_DATA);
      return;
    }

    const items = [];
    snapshot.forEach((docSnap) => {
      items.push({ ...docSnap.data(), docId: docSnap.id });
    });

    // Sắp xếp dữ liệu theo năm giảm dần, sau đó theo STT tăng dần
    items.sort((a, b) => {
      if ((b.nam || 2026) !== (a.nam || 2026)) {
        return (b.nam || 2026) - (a.nam || 2026);
      }
      return (a.stt || 0) - (b.stt || 0);
    });

    onDataUpdate(items);
  }, (error) => {
    console.warn('⚠️ Không thể kết nối Firestore (Có thể offline). Sử dụng bộ nhớ tạm.', error);
  });
}

/**
 * Thêm mới hoặc Cập nhật một vụ việc lên Firebase Cloud Firestore
 */
export async function saveIncidentToFirebase(itemData) {
  try {
    const docId = String(itemData.id || Date.now());
    const docRef = doc(db, INCIDENTS_COLLECTION, docId);
    
    // Loại bỏ undefined values trước khi lưu lên Firestore
    const cleanData = JSON.parse(JSON.stringify(itemData));
    await setDoc(docRef, { ...cleanData, id: itemData.id || Number(docId) }, { merge: true });
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu vụ việc lên Firebase:', error);
    throw error;
  }
}

/**
 * Xóa vụ việc khỏi Firebase Cloud Firestore
 */
export async function deleteIncidentFromFirebase(id) {
  try {
    const docRef = doc(db, INCIDENTS_COLLECTION, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa vụ việc trên Firebase:', error);
    throw error;
  }
}

/**
 * Nạp toàn bộ dữ liệu ban đầu lên Firestore bằng Batch Operations
 */
export async function seedInitialIncidents(initialList) {
  try {
    const colRef = collection(db, INCIDENTS_COLLECTION);
    const existing = await getDocs(colRef);

    // Xóa dữ liệu cũ nếu có
    const deleteBatch = writeBatch(db);
    existing.forEach((docSnap) => {
      deleteBatch.delete(docSnap.ref);
    });
    if (!existing.empty) {
      await deleteBatch.commit();
    }

    // Ghi mảng dữ liệu mới theo từng đợt batch (tối đa 500 docs/batch)
    const chunkSize = 400;
    for (let i = 0; i < initialList.length; i += chunkSize) {
      const chunk = initialList.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach((item) => {
        const docId = String(item.id || `stt_${item.nam || 2026}_${item.stt}`);
        const docRef = doc(db, INCIDENTS_COLLECTION, docId);
        const cleanData = JSON.parse(JSON.stringify(item));
        batch.set(docRef, { ...cleanData, id: item.id || Number(docId) });
      });
      await batch.commit();
    }

    console.log(`✅ Đã đẩy thành công ${initialList.length} vụ việc lên Firebase Cloud Firestore!`);
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu lên Firebase:', error);
  }
}

/**
 * Đăng ký lắng nghe danh sách Thành viên / Người dùng thời gian thực
 */
export function subscribeToUsers(onUsersUpdate) {
  const colRef = collection(db, USERS_COLLECTION);

  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      await seedInitialUsers(DEMO_USERS);
      return;
    }

    const users = [];
    snapshot.forEach((docSnap) => {
      users.push({ ...docSnap.data(), docId: docSnap.id });
    });

    users.sort((a, b) => (a.id || 0) - (b.id || 0));
    onUsersUpdate(users);
  }, (error) => {
    console.warn('⚠️ Lỗi kết nối Users Firestore', error);
  });
}

/**
 * Nạp danh sách tài khoản ban đầu
 */
export async function seedInitialUsers(usersList) {
  try {
    const batch = writeBatch(db);
    usersList.forEach((user) => {
      const docRef = doc(db, USERS_COLLECTION, String(user.id));
      const cleanUser = JSON.parse(JSON.stringify(user));
      batch.set(docRef, cleanUser);
    });
    await batch.commit();
  } catch (error) {
    console.error('Lỗi khi seed tài khoản lên Firebase:', error);
  }
}

/**
 * Lưu/Sửa thông tin tài khoản lên Firestore
 */
export async function saveUserToFirebase(userData) {
  try {
    const docId = String(userData.id || Date.now());
    const docRef = doc(db, USERS_COLLECTION, docId);
    const cleanUser = JSON.parse(JSON.stringify(userData));
    await setDoc(docRef, { ...cleanUser, id: userData.id || Number(docId) }, { merge: true });
    return true;
  } catch (error) {
    console.error('Lỗi lưu user lên Firebase:', error);
    throw error;
  }
}

/**
 * Xóa tài khoản khỏi Firestore
 */
export async function deleteUserFromFirebase(userId) {
  try {
    const docRef = doc(db, USERS_COLLECTION, String(userId));
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Lỗi xóa user trên Firebase:', error);
    throw error;
  }
}
