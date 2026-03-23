// Handles interactive map data for cleaned areas
// Each area is a GeoJSON feature with user info and timestamp

// Add a cleaned area (GeoJSON feature)
function addCleanedArea(feature, userId) {
  return window.firebaseFirestore.collection('cleaned_areas').add({
    feature,
    userId: userId || null,
    timestamp: new Date()
  });
}

// List all cleaned areas
function listCleanedAreas() {
  return window.firebaseFirestore.collection('cleaned_areas')
    .orderBy('timestamp', 'desc')
    .get()
    .then(snapshot => snapshot.docs.map(doc => doc.data()));
}

window.addCleanedArea = addCleanedArea;
window.listCleanedAreas = listCleanedAreas;
