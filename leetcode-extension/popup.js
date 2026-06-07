/* =========================
   🧠 1. API LAYER
========================= */

const API_BASE = "https://tracker-backend-4m55.onrender.com/api";

const showpage = (pageId) => {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });

  document.getElementById(pageId).style.display = "block";

  if(pageId === "login"){
    document.getElementById("loginForm")?.reset();
  }
};

async function apiRequest({ method, endpoint, data, token }) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (method !== "GET") {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}/${endpoint}`, options);

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

async function getProblemDueToday() {
  const token = await getToken();

  return apiRequest({
    method: "GET",
    endpoint: "problems/due-today",
    token
  });
}

async function login(username, password) {
  return apiRequest({
    method: "POST",
    endpoint: "auth/login",
    data: { username, password }
  });
}

async function signUp(username, password) {
  return apiRequest({
    method: "POST",
    endpoint: "auth/register",
    data: { username, password }
  });
}

async function saveProblem(data) {
  const token = await getToken();

  return apiRequest({
    method: "POST",
    endpoint: "problems/add",
    data,
    token
  });
}


/* =========================
   🌐 2. EXTENSION LAYER
========================= */

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

function getProblemData(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      { action: "GET_PROBLEM_DATA" },
      (response) => {
        if (chrome.runtime.lastError) {
          reject("Extension not loaded. Refresh page");
        } else if (!response) {
          reject("No data received");
        } else {
          resolve(response);
        }
      }
    );
  });
}

function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["token"], (result) => {
      resolve(result.token);
    });
  });
}

/* =========================
   🎨 3. UI LAYER
========================= */

const UI = {
  output: document.getElementById("output"),
  success: document.getElementById("success"),
  login: document.getElementById("login"),
  loading: document.getElementById("loading"),
  app: document.getElementById("app"),
  title: document.getElementById("title"),
  container: document.getElementById("problem-container"),
  label: document.getElementById("label-review"),

  showMessage(el, msg, color = "black", useHtml = false) {
    if (useHtml) {
      el.innerHTML = msg;
    } else {
      el.innerText = msg;
    }

    el.style.color = color;
  },

  renderProblems(problems) {
    this.container.innerHTML = "";

    if (!problems || problems.length === 0) {
      this.label.style.display = "none";
      this.container.innerText = "No problems due today";
      return;
    }

    this.label.style.display = "block";

    problems.forEach(pb => {
      const li = document.createElement("li");
      li.classList.add("problem");

      const title = document.createElement("span");
      title.innerText = pb.title;

      const btn = document.createElement("button");
      btn.innerText = "Open";

      btn.onclick = () => {
        chrome.tabs.create({ url: "https://tracker-frontend-81q6.onrender.com/due-today" });
      };

      li.append(title, btn);

      this.container.appendChild(li);
    });
  }
};


/* =========================
   🧠 4. CONTROLLER
========================= */

let currentData = null;

document.addEventListener("DOMContentLoaded", async () => {
  showLoading();

  try {
    const tab = await getActiveTab();

    validateTab(tab);

    
    const token = await getToken();

    if (!token) {
      showLogin();
      return;
    }

    const isValid = await validateToken(token);

    if (isValid) {
      await showApp();
    } else {
      chrome.storage.local.remove("token");
      showLogin();
    }
    

  } catch (error) {
    UI.showMessage(UI.output, error.message || error, "red", true);
    showpage("output");
  }
});

async function validateToken(token) {
  try {
    await apiRequest({
      method: "GET",
      endpoint: "auth/me",
      token
    });

    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
}

function showLoading() {
  UI.showMessage(UI.loading, "Loading...");
  showpage("loading");
}

function showLogin() {
  showpage("login");
}

async function showApp() {
  try {
    const tab = await getActiveTab();

    currentData = await getProblemData(tab.id);

    UI.title.innerText = currentData.title || "No title found";

    showpage("app");

    await loadDueProblems();

  } catch (err) {
    UI.showMessage(UI.output, err.message || err, "red", true);
    showpage("output");
  }
}

function validateTab(tab) {

  if (!tab.url.includes("leetcode.com")) {
    throw new Error(
      `Not a LeetCode page. Open <a href="https://leetcode.com" target="_blank">LeetCode</a>`
    );
  }

  if (tab.url.includes("leetcode.com/problemset/")) {
    throw new Error("Select a specific problem.");
  }

  if (!tab.url.includes("leetcode.com/problems/")) {
    throw new Error(
      `Not a problem page. Open <a href="https://leetcode.com/problemset/" target="_blank">Problems</a>`
    );
  }
}

async function loadDueProblems() {
  UI.container.innerHTML = "Loading...";

  try {
    const data = await getProblemDueToday();

    UI.renderProblems(data?.data);

  } catch (err) {
    UI.container.innerText = "Failed to fetch problems";
  }
}


/* =========================
   💾 5. EVENTS
========================= */

document.getElementById("saveBtn").addEventListener("click", async () => {

  if (!currentData) {
    UI.showMessage(UI.output, "No data to send", "red");
    return;
  }

  try {
    await saveProblem(currentData);

    UI.showMessage(
      UI.success,
      "Problem saved successfully",
      "green"
    );

  } catch (err) {
    UI.showMessage(UI.success, err.message, "red");
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {

  e.preventDefault();

  const msg = document.getElementById("login-msg");

  const usernameInput = document.getElementById("login-username");

  const passwordInput = document.getElementById("login-password");

  try {
    const username = usernameInput.value;

    const password = passwordInput.value;

    const res = await login(username, password);

    await chrome.storage.local.set({
      token: res.data
    });

    await showApp();

  } catch (error) {

    msg.innerText = "Username or Password is incorrect";

    msg.style.color = "red";

    msg.style.marginTop = "10px";

    usernameInput.value = "";

    passwordInput.value = "";
  }
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {

  e.preventDefault();

  const msg = document.getElementById("signup-msg");

  const usernameInput = document.getElementById("signup-username");

  const passwordInput = document.getElementById("signup-password");

  try {

    const username = usernameInput.value;

    const password = passwordInput.value;

    await signUp(username, password);

    msg.innerText = "Register successfully";

    msg.style.color = "green";

    msg.style.marginTop = "10px";

    usernameInput.value = "";

    passwordInput.value = "";

  } catch (error) {

    msg.innerText = error.message;

    msg.style.color = "red";

    msg.style.marginTop = "10px";
  }
});

document.getElementById("goto-signup").addEventListener("click", (e) => {
  e.preventDefault();
  showpage("signup");
});

document.getElementById("goto-login").addEventListener("click", (e) => {
  e.preventDefault();
  showpage("login");
});

document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.storage.local.remove("token");
  showLogin();
})