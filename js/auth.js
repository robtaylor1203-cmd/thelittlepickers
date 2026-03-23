// Handles user authentication (sign up, sign in, sign out)
// UI integration for login/profile will be added to the HTML later

// Sign up with email and password
function signUp(email, password, displayName) {
  return window.firebaseAuth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.updateProfile({ displayName });
    });
}

// Sign in with email and password
function signIn(email, password) {
  return window.firebaseAuth.signInWithEmailAndPassword(email, password);
}

// Sign out
function signOut() {
  return window.firebaseAuth.signOut();
}

// Listen for auth state changes
window.firebaseAuth.onAuthStateChanged(function(user) {
  // TODO: Update UI for logged-in/logged-out state
  if (user) {
    console.log('User signed in:', user.displayName || user.email);
  } else {
    console.log('User signed out');
  }
});

// Expose functions globally for now
window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
