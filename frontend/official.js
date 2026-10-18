requireRole("official");

document.getElementById("welcome").textContent = "Namaste, " + getUser().name;

async function apiCall(url, method, body) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(API_URL + url, options);
  const data = await response.json();
  return { ok: response.ok, data: data };
}

async function loadComplaints() {
  const result = await apiCall("/complaints/department", "GET");
  const tbody = document.getElementById("list");
  tbody.innerHTML = "";

  result.data.forEach(function (c) {
    const statuses = ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"];
    const priorities = ["Low", "Medium", "High"];

    const statusOptions = statuses
      .map((s) => `<option ${s === c.status ? "selected" : ""}>${s}</option>`)
      .join("");
    const priorityOptions = priorities
      .map((p) => `<option ${p === c.priority ? "selected" : ""}>${p}</option>`)
      .join("");

    tbody.innerHTML += `
      <tr>
        <td>${c.trackingId}</td>
        <td>${c.citizen ? c.citizen.name : "-"}</td>
        <td>${c.title}</td>
        <td>${c.location}</td>
        <td><select id="status-${c._id}">${statusOptions}</select></td>
        <td><select id="priority-${c._id}">${priorityOptions}</select></td>
        <td><input type="text" id="remarks-${c._id}" value="${c.remarks || ""}"></td>
        <td><button onclick="updateComplaint('${c._id}')">Save</button></td>
      </tr>`;
  });
}

async function updateComplaint(id) {
  const body = {
    status: document.getElementById("status-" + id).value,
    priority: document.getElementById("priority-" + id).value,
    remarks: document.getElementById("remarks-" + id).value,
  };
  const result = await apiCall("/complaints/" + id, "PUT", body);
  alert(result.data.message);
  loadComplaints();
}

loadComplaints();