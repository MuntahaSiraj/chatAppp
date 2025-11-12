 import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword ,  onAuthStateChanged ,  GoogleAuthProvider,  signInWithPopup,signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCE00Iq-vCIz19uuD_CsB5S9TeJs9MKLgM",
  authDomain: "real-time-database-8ca56.firebaseapp.com",
  projectId: "real-time-database-8ca56",
  storageBucket: "real-time-database-8ca56.firebasestorage.app",
  messagingSenderId: "395187705387",
  appId: "1:395187705387:web:c47ff0c77a3b963d6afc6e",
  measurementId: "G-48E6KVHVV4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
  document.getElementById('signup')?.addEventListener('click', ()=>{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(()=>{
        alert('SignUp Successful!');
        window.location.href = 'user.html';
      })
      .catch((error)=>{
        alert(error.message);
      });
  });

  document.getElementById('login')?.addEventListener('click', ()=>{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
      .then(()=>{
        alert('Login Successful!');
        window.location.href = 'user.html';
      })
      .catch((error)=>{
        alert(error.message);
      });
  });

  document.getElementById('google-btn')?.addEventListener('click', ()=>{
    signInWithPopup(auth, provider)
      .then(()=>{
        alert('Login Successfully');
        window.location.href = 'user.html';
      })
      .catch((error)=>{
        alert(error.message);
      });
  });
} else if (window.location.pathname === "/user.html") {
  document.getElementById('user-btn')?.addEventListener('click', ()=>{
    window.location.href = 'chat.html';
  });
} else if (window.location.pathname === "/chat.html") {
  document.getElementById('logout')?.addEventListener('click', ()=>{
    signOut(auth)
      .then(()=>{
        alert('Logout Successfully');
        window.location.href = 'index.html';
      })
      .catch((error)=>{
        alert(error.message);
      });
  });
}


window.googleSignIn = function () {
  signInWithPopup(auth, provider)
    .then(() => {
      alert("Google login successful!");
      window.location.href = "popup.html";
    })
    .catch((error) => alert(error.message));
};


window.enterChat = function () {
  const username = document.getElementById("popupUsername").value.trim();
  if (!username) return alert("Please enter a username");

  localStorage.setItem("username", username);
  window.location.href = "chatApp.html";
};


window.sendMessage = function () {
  const message = document.getElementById("message").value.trim();
  const username = localStorage.getItem("username");
  if (message === "") return;

  push(ref(db, "messages"), { username, message })
    .then(() => (document.getElementById("message").value = ""))
    .catch((error) => alert("Error sending message: " + error.message));
};


function deleteMessage(messageId, messageElement) {
  remove(ref(db, `messages/${messageId}`))
    .then(() => messageElement.remove())
    .catch((error) => alert("Error deleting message: " + error.message));
}


function editMessage(messageId, messageElement, oldText) {
  const newText = prompt("Edit your message:", oldText);
  if (newText && newText.trim() !== "") {
    update(ref(db, `messages/${messageId}`), { message: newText })
      .then(() => {
        messageElement.querySelector(".message-text").textContent = newText;
      })
      .catch((error) => alert("Error updating message: " + error.message));
  }
}


window.logout = function () {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("username");
      window.location.href = "index.html";
    })
    .catch((error) => alert("Error logging out: " + error.message));
};


window.onload = function () {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return;

  const currentUsername = localStorage.getItem("username");

  onChildAdded(ref(db, "messages"), (snapshot) => {
    const data = snapshot.val();
    const messageId = snapshot.key;

    const container = document.createElement("div");
    container.classList.add("message-container");
    container.classList.add(data.username === currentUsername ? "sent" : "received");

    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const letterCircle = document.createElement("div");
    letterCircle.classList.add("letter-circle");
    letterCircle.textContent = data.username.charAt(0).toUpperCase();

    const textWrapper = document.createElement("div");
    const name = document.createElement("div");
    name.classList.add("username");
    name.textContent = data.username;

    const msg = document.createElement("div");
    msg.classList.add("message-text");
    msg.textContent = data.message;

    textWrapper.appendChild(name);
    textWrapper.appendChild(msg);
    wrapper.appendChild(letterCircle);
    wrapper.appendChild(textWrapper);

   
   if (data.username === currentUsername) {
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-container");

  
  const editBtn = document.createElement("span");
  editBtn.textContent = "✏️"; 
  editBtn.classList.add("edit-icon");
  editBtn.title = "Edit message";
  editBtn.addEventListener("click", () =>
    editMessage(messageId, container, data.message)
  );

 
  const delBtn = document.createElement("span");
  delBtn.textContent = "🗑️"; 
  delBtn.classList.add("delete-icon");
  delBtn.title = "Delete message";
  delBtn.addEventListener("click", () => {
    if (confirm("Delete this message?")) deleteMessage(messageId, container);
  });

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(delBtn);
  wrapper.appendChild(btnContainer);
}


    container.appendChild(wrapper);
    chatBox.appendChild(container);
    chatBox.scrollTop = chatBox.scrollHeight;
  });

 
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    let isDark = false;
    themeToggleBtn.addEventListener("click", () => {
      document.body.style.backgroundColor = isDark ? "white" : "black";
      document.body.style.color = isDark ? "black" : "white";
      isDark = !isDark;
    });
  }
};