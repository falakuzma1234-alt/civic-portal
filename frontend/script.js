const API_URL = "http://localhost:5000/api";

async function loadDepartments() {
  const response = await fetch(API_URL + "/departments");
  const departments = await response.json();

 const list = document.getElementById("deptList");

departments.forEach(function (dept) {
  list.innerHTML += `<li>${dept.name}</li>`;
});
}

loadDepartments();