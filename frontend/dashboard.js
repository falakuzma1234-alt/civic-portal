requireRole("citizen");

document.getElementById("welcome").textContent = "Namaste, " + getUser().name;

// Server ko token ke saath request bhejne ka helper
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

// Meri complaints table mein dikhao
async function loadMyComplaints() {
  const result = await apiCall("/complaints/my", "GET");
  const tbody = document.getElementById("myList");
  tbody.innerHTML = "";

  result.data.forEach(function (c) {
    tbody.innerHTML += `
      <tr>
        <td>${c.trackingId}</td>
        <td>${c.department}</td>
        <td>${c.title}</td>
        <td><span class="badge ${c.status.replace(" ", "")}">${c.status}</span></td>
        <td>${c.remarks || "-"}</td>
      </tr>`;
  });
}

// Complaint submit
document.getElementById("complaintForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const body = {
    department: document.getElementById("department").value,
    complaintType: document.getElementById("complaintType").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    location: document.getElementById("location").value,
  };

  const result = await apiCall("/complaints", "POST", body);

  if (result.ok) {
    alert("Complaint submit ho gayi! Tracking ID: " + result.data.trackingId);
    e.target.reset();
    loadMyComplaints();
  } else {
    alert(result.data.message);
  }
});

// Tracking ID se search
document.getElementById("trackBtn").addEventListener("click", async function () {
  const id = document.getElementById("trackInput").value.trim();
  const box = document.getElementById("trackResult");

  const result = await apiCall("/complaints/track/" + id, "GET");

  if (result.ok) {
    const c = result.data;
    box.innerHTML = `<p><b>${c.title}</b><br>Status: <span class="badge ${c.status.replace(" ", "")}">${c.status}</span><br>Priority: ${c.priority}<br>Remarks: ${c.remarks || "-"}</p>`;
  } else {
    box.innerHTML = `<p style="color:red">${result.data.message}</p>`;
  }
});

loadMyComplaints();