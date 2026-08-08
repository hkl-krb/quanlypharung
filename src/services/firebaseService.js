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
 * @param {Function} onError - Callback nhận lỗi kết nối / quyền truy cập
 * @returns {Function} Unsubscribe function
 */
export function subscribeToIncidents(onDataUpdate, onError) {
  const colRef = collection(db, INCIDENTS_COLLECTION);

  return onSnapshot(colRef, async (snapshot) => {
    // Nếu Firestore trống, nạp toàn bộ 194 vụ việc gốc lên Cloud
    if (snapshot.empty) {
      console.log('🔥 Cloud Firestore chưa có dữ liệu, đang nạp 194 vụ việc gốc...');
      try {
        await seedInitialIncidents(ALL_INITIAL_DATA);
      } catch (err) {
        console.error('Không thể nạp dữ liệu ban đầu lên Firestore (kiểm tra Firestore Rules):', err);
        if (onError) onError(err);
      }
      return;
    }

    const items = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({ ...data, docId: docSnap.id, id: data.id || docSnap.id });
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
    console.warn('⚠️ Lỗi kết nối Firestore Rules / Offline:', error);
    if (onError) onError(error);
  });
}

/**
 * Thêm mới hoặc Cập nhật một vụ việc lên Firebase Cloud Firestore
 */
export async function saveIncidentToFirebase(itemData) {
  try {
    const docId = String(itemData.docId || itemData.id || Date.now());
    const docRef = doc(db, INCIDENTS_COLLECTION, docId);
    
    // Loại bỏ undefined values trước khi lưu lên Firestore
    const cleanData = JSON.parse(JSON.stringify(itemData));
    delete cleanData.docId;
    
    await setDoc(docRef, { ...cleanData, id: itemData.id || docId }, { merge: true });
    console.log(`🔥 Đã lưu thành công vụ việc ID ${docId} lên Firebase Cloud Firestore!`);
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu vụ việc lên Firebase:', error);
    throw error;
  }
}

/**
 * Xóa vụ việc khỏi Firebase Cloud Firestore
 */
export async function deleteIncidentFromFirebase(id, docId) {
  try {
    const targetId = String(docId || id);
    const docRef = doc(db, INCIDENTS_COLLECTION, targetId);
    await deleteDoc(docRef);
    console.log(`🔥 Đã xóa thành công vụ việc ID ${targetId} khỏi Cloud Firestore!`);
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

    // Xóa dữ liệu cũ theo từng đợt batch
    const existingDocs = existing.docs;
    for (let i = 0; i < existingDocs.length; i += 400) {
      const batch = writeBatch(db);
      existingDocs.slice(i, i + 400).forEach((docSnap) => batch.delete(docSnap.ref));
      await batch.commit();
    }

    // Ghi mảng dữ liệu mới theo từng đợt batch
    for (let i = 0; i < initialList.length; i += 400) {
      const chunk = initialList.slice(i, i + 400);
      const batch = writeBatch(db);
      chunk.forEach((item) => {
        const docId = String(item.docId || item.id || `stt_${item.nam || 2026}_${item.stt}`);
        const docRef = doc(db, INCIDENTS_COLLECTION, docId);
        const cleanData = JSON.parse(JSON.stringify(item));
        delete cleanData.docId;
        batch.set(docRef, { ...cleanData, id: item.id || docId });
      });
      await batch.commit();
    }

    console.log(`✅ Đã đồng bộ thành công ${initialList.length} vụ việc lên Firebase Cloud Firestore!`);
    return true;
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu lên Firebase:', error);
    throw error;
  }
}

/**
 * Đăng ký lắng nghe danh sách Thành viên / Người dùng thời gian thực
 */
export function subscribeToUsers(onUsersUpdate, onError) {
  const colRef = collection(db, USERS_COLLECTION);

  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      try {
        await seedInitialUsers(DEMO_USERS);
      } catch (err) {
        console.error('Lỗi khởi tạo người dùng:', err);
      }
      return;
    }

    const users = [];
    snapshot.forEach((docSnap) => {
      const uData = docSnap.data();
      users.push({ ...uData, docId: docSnap.id, id: uData.id || docSnap.id });
    });

    users.sort((a, b) => (a.id || 0) - (b.id || 0));
    onUsersUpdate(users);
  }, (error) => {
    console.warn('⚠️ Lỗi kết nối Users Firestore', error);
    if (onError) onError(error);
  });
}

/**
 * Nạp danh sách tài khoản ban đầu
 */
export async function seedInitialUsers(usersList) {
  try {
    const colRef = collection(db, USERS_COLLECTION);
    const existing = await getDocs(colRef);

    const batch = writeBatch(db);
    existing.forEach((docSnap) => batch.delete(docSnap.ref));
    if (!existing.empty) {
      await batch.commit();
    }

    const userBatch = writeBatch(db);
    usersList.forEach((user) => {
      const docId = String(user.docId || user.id || user.username);
      const docRef = doc(db, USERS_COLLECTION, docId);
      const cleanUser = JSON.parse(JSON.stringify(user));
      delete cleanUser.docId;
      userBatch.set(docRef, cleanUser);
    });
    await userBatch.commit();
    console.log('✅ Đã đồng bộ danh sách tài khoản lên Cloud Firestore!');
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu người dùng lên Firestore:', error);
    throw error;
  }
}

/**
 * Lưu 1 tài khoản lên Firestore
 */
export async function saveUserToFirebase(userData) {
  try {
    const docId = String(userData.docId || userData.id || userData.username);
    const docRef = doc(db, USERS_COLLECTION, docId);
    const cleanUser = JSON.parse(JSON.stringify(userData));
    delete cleanUser.docId;
    await setDoc(docRef, cleanUser, { merge: true });
    return true;
  } catch (error) {
    console.error('Lỗi khi cập nhật tài khoản lên Firebase:', error);
    throw error;
  }
}

/**
 * Xóa 1 tài khoản khỏi Firestore
 */
export async function deleteUserFromFirebase(userId) {
  try {
    const docRef = doc(db, USERS_COLLECTION, String(userId));
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa tài khoản khỏi Firebase:', error);
    throw error;
  }
}
