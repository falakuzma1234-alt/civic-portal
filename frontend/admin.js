requireRole("admin");

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

async function loadStats() {
  const result = await apiCall("/admin/stats", "GET");
  const s = result.data;

  document.getElementById("stats").innerHTML = `
    <div class="stat-card"><h2>${s.total}</h2><p>Total</p></div>
    <div class="stat-card"><h2>${s.pending}</h2><p>Pending</p></div>
    <div class="stat-card"><h2>${s.inProgress}</h2><p>In Progress</p></div>
    <div class="stat-card"><h2>${s.resolved}</h2><p>Resolved</p></div>
    <div class="stat-card"><h2>${s.avgDays}</h2><p>Avg Resolution (days)</p></div>`;

  const deptBox = document.getElementById("deptStats");
  deptBox.innerHTML = "";
  s.byDepartment.forEach(function (d) {
    deptBox.innerHTML += `<p>${d._id}: <b>${d.count}</b></p>`;
  });
}

let officials = [];

async function loadComplaints() {
  const offResult = await apiCall("/admin/officials", "GET");
  officials = offResult.data;

  const result = await apiCall("/admin/complaints", "GET");
  const tbody = document.getElementById("list");
  tbody.innerHTML = "";

  result.data.forEach(function (c) {
    const options = officials
      .map((o) => `<option value="${o._id}">${o.name} (${o.department})</option>`)
      .join("");

    tbody.innerHTML += `
      <tr>
        <td>${c.trackingId}</td>
        <td>${c.department}</td>
        <td>${c.title}</td>
        <td><span class="badge ${c.status.replace(" ", "")}">${c.status}</span></td>
        <td>${c.assignedTo ? c.assignedTo.name : "-"}</td>
        <td>
          <select id="off-${c._id}">${options}</select>
          <button onclick="assign('${c._id}')">Assign</button>
        </td>
      </tr>`;
  });
}

async function assign(id) {
  const officialId = document.getElementById("off-" + id).value;
  const result = await apiCall("/admin/assign/" + id, "PUT", { officialId: officialId });
  alert(result.data.message);
  loadStats();
  loadComplaints();
}

loadStats();
loadComplaints();