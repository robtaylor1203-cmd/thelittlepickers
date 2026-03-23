// Handles image uploads to Firebase Storage and saves metadata to Firestore
// Used for Wall of Fame photos, art, and profile pictures

// Uploads a file to a given storage path and saves metadata to Firestore
function uploadImage(file, type, userId, extraData = {}) {
  const storageRef = window.firebaseStorage.ref();
  const filePath = `${type}/${userId || 'anonymous'}_${Date.now()}_${file.name}`;
  const fileRef = storageRef.child(filePath);
  return fileRef.put(file).then(snapshot => {
    return snapshot.ref.getDownloadURL();
  }).then(url => {
    // Save metadata to Firestore
    return window.firebaseFirestore.collection(type).add({
      url,
      userId: userId || null,
      uploaded: new Date(),
      ...extraData
    });
  });
}

// List images for a given type (e.g., 'gallery', 'art')
function listImages(type, limit = 20) {
  return window.firebaseFirestore.collection(type)
    .orderBy('uploaded', 'desc')
    .limit(limit)
    .get()
    .then(snapshot => snapshot.docs.map(doc => doc.data()));
}

window.uploadImage = uploadImage;
window.listImages = listImages;
