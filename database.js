function saveUserData(userId) {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();

  // Validate required fields
  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }
  
  if (!email.includes("@")) {
    throw new Error("Please enter a valid email address");
  }

  // Prepare user data
  const userData = {
    username: username,
    fullName: document.getElementById("fullname").value.trim(),
    email: email,
    form: document.getElementById("form").value,
    gender: document.querySelector("input[name='gender']:checked").value,
    isZerakiUser: document.getElementById("zeraki-check").checked,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    lastUpdated: firebase.database.ServerValue.TIMESTAMP
  };

  // Conditionally add Zeraki credentials
  if (userData.isZerakiUser) {
    userData.zerakiUsername = document.getElementById("zeraki-username").value.trim();
    userData.zerakiPassword = document.getElementById("zeraki-password").value;
    
    if (!userData.zerakiUsername || !userData.zerakiPassword) {
      throw new Error("Please enter your Zeraki credentials");
    }
  }

  // First check if username is available
  return database.ref(`usernames/${username}`).once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        throw new Error('Username already taken');
      }
      
      // Save all data in a batch
      const updates = {};
      updates[`users/${userId}`] = userData;
      updates[`usernames/${username}`] = userId;
      updates[`user_emails/${email.replace('.', ',')}`] = userId;
      
      return database.ref().update(updates);
    })
    .then(() => {
      console.log("User data saved successfully");
      return userData;
    });
}

// Function to get current user's data
function getCurrentUserData() {
  const user = auth.currentUser;
  if (!user) return Promise.reject("No user logged in");
  
  return database.ref(`users/${user.uid}`).once('value')
    .then((snapshot) => snapshot.val());
}
