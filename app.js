const api = '/api/jobs';

async function fetchJobs() {
  const res = await fetch(api);
  const data = await res.json();
  return data;
}

function rowHtml(job) {
  return `<tr data-id="${job.id}">
    <td>${job.id}</td>
    <td>${job.ref_no || ''}</td>
    <td>${job.client_name || ''}</td>
    <td>${job.date_received || ''}</td>
    <td>${job.allocated_to || ''}</td>
    <td>${job.status || ''}</td>
    <td>${job.remarks || ''}</td>
    <td>
      <button class="btn btn-edit" onclick="editJob(${job.id})">Edit</button>
      <button class="btn btn-delete" onclick="deleteJob(${job.id})">Delete</button>
    </td>
  </tr>`;
}

async function loadAndRender() {
  const jobs = await fetchJobs();
  const tbody = document.querySelector('#jobs-table tbody');
  tbody.innerHTML = jobs.map(rowHtml).join('');
}

document.getElementById('job-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    ref_no: document.getElementById('ref_no').value,
    client_name: document.getElementById('client_name').value,
    date_received: document.getElementById('date_received').value,
    allocated_to: document.getElementById('allocated_to').value,
    status: document.getElementById('status').value,
    remarks: document.getElementById('remarks').value
  };
  await fetch(api, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
  e.target.reset();
  loadAndRender();
});

document.getElementById('refresh').addEventListener('click', loadAndRender);

async function deleteJob(id) {
  if (!confirm('Delete job #' + id + '?')) return;
  await fetch(api + '/' + id, { method: 'DELETE' });
  loadAndRender();
}

async function editJob(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const cells = row.querySelectorAll('td');
  const ref_no = prompt('Ref No', cells[1].innerText) || cells[1].innerText;
  const client_name = prompt('Client Name', cells[2].innerText) || cells[2].innerText;
  const date_received = prompt('Date Received (YYYY-MM-DD)', cells[3].innerText) || cells[3].innerText;
  const allocated_to = prompt('Allocated To', cells[4].innerText) || cells[4].innerText;
  const status = prompt('Status (Pending/In Progress/Completed)', cells[5].innerText) || cells[5].innerText;
  const remarks = prompt('Remarks', cells[6].innerText) || cells[6].innerText;

  const payload = { ref_no, client_name, date_received, allocated_to, status, remarks };
  await fetch(api + '/' + id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  loadAndRender();
}

// initial load
loadAndRender();
