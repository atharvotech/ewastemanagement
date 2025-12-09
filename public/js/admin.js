(async function(){
  const token = localStorage.getItem('authToken');
  if (!token) { window.location = '/login'; return; }

  const usersList = document.getElementById('usersList');
  const ordersList = document.getElementById('ordersList');
  const logoutBtn = document.getElementById('logoutBtn');

  // verify server-side that the user is admin (don't rely solely on localStorage)
  let currentUser = null;
  try {
    const p = await fetch('/api/auth/profile', { headers: { 'Authorization': 'Bearer ' + token } });
    if (!p.ok) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location = '/login';
      return;
    }
    const pd = await p.json();
    currentUser = pd.user;
    // update stored copy
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    if (!currentUser.isAdmin) {
      document.body.innerHTML = '<div style="padding:40px; text-align:center;">Access denied. You must be an admin.</div>';
      return;
    }
  } catch (err) {
    console.error('Failed to verify admin', err);
    localStorage.removeItem('authToken');
    window.location = '/login';
    return;
  }

  logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location = '/login';
  });

  // Tabs
  document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.menu-item').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
      document.getElementById(tab + '-tab').classList.add('active');
    });
  });

  async function fetchUsers() {
    const res = await fetch('/api/auth/admin/users', { headers: { 'Authorization': 'Bearer ' + token } });
    if (!res.ok) {
      usersList.innerHTML = '<div class="details">Failed to load users</div>';
      return;
    }
    const data = await res.json();
    renderUsers(data.users || []);
  }

  function renderUsers(users) {
    if (!users.length) { usersList.innerHTML = '<div class="details">No users found</div>'; return; }
    usersList.innerHTML = '';
    users.forEach(u=>{
      const row = document.createElement('div'); row.className='user-row';
      row.innerHTML = `
        <div>
          <div><strong>${u.fullName || '—'}</strong> <span class="details">${u.email}</span></div>
          <div class="details">${u.phone || ''} ${u.city ? '• '+u.city : ''}</div>
        </div>
        <div class="user-actions">
          <button class="btn" data-email="${u.email}" data-id="${u._id}" data-action="promote">Promote</button>
          <button class="btn danger" data-id="${u._id}" data-action="delete">Delete</button>
        </div>
      `;
      usersList.appendChild(row);
    });
    usersList.querySelectorAll('button[data-action]').forEach(btn=>{
      btn.addEventListener('click', async (e)=>{
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const email = btn.dataset.email;
        if (action === 'promote') {
          if (!confirm('Promote '+email+' to admin?')) return;
          const r = await fetch('/api/auth/admin/users/'+id+'/promote', { method:'PUT', headers:{ 'Authorization':'Bearer '+token, 'Content-Type':'application/json' } });
          if (r.ok) { alert('Promoted'); fetchUsers(); } else { alert('Failed'); }
        } else if (action === 'delete') {
          if (!confirm('Delete this user?')) return;
          const r = await fetch('/api/auth/admin/users/'+id, { method:'DELETE', headers:{ 'Authorization':'Bearer '+token } });
          if (r.ok) { alert('Deleted'); fetchUsers(); } else { alert('Failed'); }
        }
      });
    });
  }

  async function fetchOrders() {
    const res = await fetch('/api/auth/admin/orders', { headers: { 'Authorization': 'Bearer ' + token } });
    if (!res.ok) { ordersList.innerHTML = '<div class="details">Failed to load orders</div>'; return; }
    const data = await res.json(); renderOrders(data.orders || []);
  }

  function renderOrders(orders) {
    if (!orders.length) { ordersList.innerHTML = '<div class="details">No orders found</div>'; return; }
    ordersList.innerHTML = '';
    orders.forEach(o=>{
      const row = document.createElement('div'); row.className='order-row';
      row.innerHTML = `
        <div style="min-width:300px;">
          <div><strong>${o.orderId || '—'}</strong> <span class="details">${o.wasteType} • ${o.quantity} ${o.unit}</span></div>
          <div class="details">Owner: ${o.owner?.email || o.ownerId || '—'}</div>
        </div>
        <div class="details">${o.status}</div>
        <div class="order-actions">
          <button class="btn primary" data-id="${o.orderId || ''}" data-action="update">Next</button>
          <button class="btn danger" data-id="${o.orderId || ''}" data-action="delete">Delete</button>
        </div>
      `;
      ordersList.appendChild(row);
    });

    ordersList.querySelectorAll('button[data-action]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id = btn.dataset.id; const action = btn.dataset.action;
        if (!id) { alert('Missing order id'); return; }
        if (action === 'update') {
          const r = await fetch('/api/auth/admin/orders/'+encodeURIComponent(id), { method:'PUT', headers:{ 'Authorization':'Bearer '+token, 'Content-Type':'application/json' }, body: JSON.stringify({ status: 'completed' }) });
          if (r.ok) { alert('Updated'); fetchOrders(); } else { alert('Failed'); }
        } else if (action === 'delete') {
          if (!confirm('Delete this order?')) return;
          const r = await fetch('/api/auth/admin/orders/'+encodeURIComponent(id), { method:'DELETE', headers:{ 'Authorization':'Bearer '+token } });
          if (r.ok) { alert('Deleted'); fetchOrders(); } else { alert('Failed'); }
        }
      });
    });
  }

  fetchUsers(); fetchOrders();
})();
