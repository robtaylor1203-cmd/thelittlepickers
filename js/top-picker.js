// Randomly select a top picker from users who have uploaded or contributed
function getRandomTopPicker() {
  return window.firebaseFirestore.collection('users').get()
    .then(snapshot => {
      const users = snapshot.docs.map(doc => doc.data());
      if (users.length === 0) return null;
      const idx = Math.floor(Math.random() * users.length);
      return users[idx];
    });
}
window.getRandomTopPicker = getRandomTopPicker;
