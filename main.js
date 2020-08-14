const registerForm = document.getElementById("register-form");
const logout = document.getElementById("logout");
const loginForm = document.getElementById("login-form");
const postList = document.getElementById("posts");

const loggedOutCheck = document.querySelectorAll(".loggedOut");
const loggedInCheck = document.querySelectorAll(".loggedIn");

const loginCheck = (user) => {
  if (user) {
    loggedInCheck.forEach((link) => (link.style.display = "block"));
    loggedOutCheck.forEach((link) => (link.style.display = "none"));
  } else {
    loggedInCheck.forEach((link) => (link.style.display = "none"));
    loggedOutCheck.forEach((link) => (link.style.display = "block"));
  }
};

//---------------> Register Actions
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      //clear the form
      registerForm.reset(),
        //close modal
        $("#registerModal").modal("hide");
      console.log("signup");
    });
});

//------>>Login Actions
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    //clear the form
    loginForm.reset(),
      //close modal
      $("#loginModal").modal("hide");
    console.log("User Login");
  });
});

//--------->logout Actions
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("User Logout");
  });
});

//-----> Google Login Method
const googleLogin = document.getElementById("googleLogin");

//------> Google Login Function
googleLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      //clear the form
      loginForm.reset(),
        //close modal
        $("#loginModal").modal("hide");
      console.log("Google auth succesfull");
    })
    .catch((err) => {
      console.log(err);
    });
});

//----> Facebook Login Method

const facebookLogin = document.getElementById("facebookLogin");

//-----> Facebook Login Function

facebookLogin.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("facebook login clicked");
  const provider = new firebase.auth.FacebookAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      console.log(result);
      console.log("facebook call");
    })
    .catch((err) => {
      console.log(err);
    });
});

//--------->Get Posts
const setupPosts = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const post = doc.data();
      //console.log(post);
      const li = `
            <li class="list-group-item list-group-item-action">
            <h5>${post.title}</h5>
            <p>${post.description}</p>
            </li>
            `;
      html += li;
    });
    postList.innerHTML = html;
  } else {
    postList.innerHTML = `<h3 class="text-center">Login to see posts</h3>`;
  }
};

//------> Events

//---->List auth changes
auth.onAuthStateChanged((user) => {
  if (user) {
    fs.collection("posts")
      .get()
      .then((snapshot) => {
        setupPosts(snapshot.docs);
        loginCheck(user);
      });
  } else {
    setupPosts([]);
    loginCheck(user);
  }
});
