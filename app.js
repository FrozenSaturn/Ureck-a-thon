// import { getFirestore,doc,getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoNoQzyt0dQoGHWkyL-o6Q07OM7nsIn-w",
  authDomain: "women-empowerment-c3961.firebaseapp.com",
  databaseURL: "https://women-empowerment-c3961-default-rtdb.firebaseio.com",
  projectId: "women-empowerment-c3961",
  storageBucket: "women-empowerment-c3961.appspot.com",
  messagingSenderId: "1024096943752",
  appId: "1:1024096943752:web:4cd08021689b855809a93d",
  measurementId: "G-M2LY0ZR3GG",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function submitPost() {
  var name = document.getElementById("name").value;
  var company = document.getElementById("company").value;
  var branch = document.getElementById("branch").value;
  var year = document.getElementById("year").value;
  var postContent = document.getElementById("postContent").value;

  db.collection("posts")
    .add({
      name: name,
      company: company,
      branch: branch,
      year: year,
      content: postContent,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      clearForm(); // Clear input after submission
      fetchPosts(); // Refresh the posts displayed
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("company").value = "";
  document.getElementById("branch").value = "";
  document.getElementById("year").value = "";
  document.getElementById("postContent").value = "";
  document.getElementById("video").value = ""; // Clear the file input
}

function populateBranches() {
  var companySelect = document.getElementById("company");
  var branchSelect = document.getElementById("branch");

  branchSelect.innerHTML =
    '<option value="" selected disabled>Select Branch</option>';

  var selectedCompany = companySelect.value;

  // Populate branch dropdown based on the selected company
  if (selectedCompany === "Company A") {
    // Hardcoded branch options for Company A
    var branches = ["Branch A", "Branch B", "Branch C"];
  } else if (selectedCompany === "Company B") {
    // Hardcoded branch options for Company B
    var branches = ["Branch X", "Branch Y", "Branch Z"];
  } else {
    var branches = []; // Default to empty array if no company selected
  }

  // Add options to branch dropdown
  branches.forEach(function (branch) {
    var option = document.createElement("option");
    option.text = branch;
    option.value = branch;
    branchSelect.add(option);
  });
}

// Event listener for company dropdown change
document.getElementById("company").addEventListener("change", populateBranches);

// Initial population of branches based on the selected company
populateBranches();

function fetchAndDisplayPosts() {
  var postsContainer = document.getElementById("posts");

  // Clear any existing posts
  postsContainer.innerHTML = "";

  // Fetch posts from Firestore
  db.collection("posts")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var post = doc.data();
        var postHTML = `
              <div class="post">
                <div class="post-content">
                  <h2>${post.name} - ${post.year}</h2>
                  <p><strong>Company:</strong> ${post.company}</p>
                  <p><strong>Branch:</strong> ${post.branch}</p>
                  <p><strong>Experience:</strong> ${post.content}</p>
                </div>
              </div>
          `;
        postsContainer.innerHTML += postHTML;
      });
    });
}

document.getElementById("searchBox").addEventListener("keyup", function () {
  const searchText = this.value.toLowerCase();
  filterPostsByCompany(searchText);
});

function filterPostsByCompany(searchText) {
  var postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = ""; // Clear existing posts

  db.collection("posts")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var post = doc.data();
        if (post.company.toLowerCase().includes(searchText)) {
          // Check if the company name includes the search text
          var postHTML = `
          <div class="post">
              <div class="post-info">
                  <h2>${post.name} - ${post.year}</h2>
                  <p><strong>Company:</strong> ${post.company}</p>
                  <p><strong>Branch:</strong> ${post.branch}</p>
                  <p><strong>Experience:</strong> ${post.content}</p>
              </div>
              <div class="post-image">
                  <img src="${post.imageUrl}" alt="Post image">
              </div>
          </div>
        `;
          postsContainer.innerHTML += postHTML;
        }
      });
    });
}

