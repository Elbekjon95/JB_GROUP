/**
 * UZW (Universal Zaxira Web) - Asosiy Ilova Boshqaruvi
 */

// ===================================================================
// 1. UMUMIY INTERFEYS VA YORDAMCHI FUNKSIYALAR (UI HELPERS)
// ===================================================================

const UI = {
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      // Formalarni moslashtirish (dropdownlarni yangilash)
      if (modalId === 'addProductModal') {
        ProductsUI.populateDropdowns();
      }
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      const form = modal.querySelector('form');
      if (form) form.reset();
      
      // Yashirin ID larni tozalash
      const hiddenEditId = modal.querySelector('input[type="hidden"]');
      if (hiddenEditId) hiddenEditId.value = '';

      // Sarlavhani tiklash
      if (modalId === 'addProductModal') {
        document.getElementById('productModalTitle').textContent = 'Yangi Mahsulot Kiritish';
        document.getElementById('pSubmitBtn').textContent = 'Saqlash';
      } else if (modalId === 'addWarehouseModal') {
        document.getElementById('warehouseModalTitle').textContent = 'Yangi Omborxona Yaratish';
        document.getElementById('whSubmitBtn').textContent = 'Omborni yaratish';
      } else if (modalId === 'addTariffModal') {
        document.getElementById('tariffModalTitle').textContent = 'Yangi Saqlash Tarifini Kiritish';
        document.getElementById('trSubmitBtn').textContent = 'Tarifni saqlash';
      }
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  formatMoney(amount) {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0) + ' UZS';
  },

  formatNumber(val) {
    return new Intl.NumberFormat('uz-UZ').format(val || 0);
  }
};


// ===================================================================
// 2. AUTENTIFIKATSIYA INTERFEYSI (AUTH UI)
// ===================================================================

const AuthUI = {
  switchTab(tab) {
    const loginBtn = document.getElementById('tabLoginBtn');
    const registerBtn = document.getElementById('tabRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tab === 'login') {
      loginBtn.classList.add('active');
      registerBtn.classList.remove('active');
      loginForm.style.display = 'flex';
      registerForm.style.display = 'none';
    } else {
      registerBtn.classList.add('active');
      loginBtn.classList.remove('active');
      loginForm.style.display = 'none';
      registerForm.style.display = 'flex';
    }
  },

  fillDemo(email, password) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;
    UI.showToast('Demo ma\'lumotlar kiritildi, "Tizimga kirish" tugmasini bosing', 'info');
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = Auth.login(email, password);
    if (res.success) {
      UI.showToast(`Xush kelibsiz, ${res.user.fullName}!`, 'success');
      this.syncAuthView();
      Router.navigate('dashboard');
    } else {
      UI.showToast(res.message, 'danger');
    }
  },

  handleRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('regFullName').value;
    const company = document.getElementById('regCompany').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const res = Auth.register({ fullName, company, email, password });
    if (res.success) {
      UI.showToast('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 'success');
      this.syncAuthView();
      Router.navigate('dashboard');
    } else {
      UI.showToast(res.message, 'danger');
    }
  },

  syncAuthView() {
    const isAuth = Auth.isAuthenticated();
    const authScreen = document.getElementById('authScreen');
    const mainApp = document.getElementById('mainApp');

    if (isAuth) {
      authScreen.style.display = 'none';
      mainApp.style.display = 'flex';

      const user = Auth.getCurrentUser();
      if (user) {
        document.getElementById('userNameDisplay').textContent = user.fullName || user.email;
        document.getElementById('userRoleDisplay').textContent = user.role || 'Ombor Nazoratchisi';
        document.getElementById('userAvatar').textContent = (user.fullName || 'U').charAt(0).toUpperCase();
      }
    } else {
      authScreen.style.display = 'flex';
      mainApp.style.display = 'none';
    }
  }
};


// ===================================================================
// 3. SAHIFALAR NAVIGATSIYASI (ROUTER)
// ===================================================================

const Router = {
  currentView: 'dashboard',

  navigate(viewName) {
    this.currentView = viewName;

    // Barcha bo'limlarni yashirish
    document.querySelectorAll('.view-section').forEach(el => {
      el.style.display = 'none';
    });

    // Faol navigatsiya tugmasini belgilash
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
      el.classList.remove('active');
    });

    const activeNav = document.getElementById(`nav-${viewName}`);
    if (activeNav) activeNav.classList.add('active');

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) targetSection.style.display = 'block';

    // Yuqori sarlavhalarni yangilash
    const titleEl = document.getElementById('pageTitleText');
    const subtitleEl = document.getElementById('pageSubtitleText');

    switch (viewName) {
      case 'dashboard':
        titleEl.textContent = 'Boshqaruv paneli';
        subtitleEl.textContent = 'Omborlar va tovarlar holati to\'g\'risida umumiy ma\'lumot';
        DashboardUI.render();
        break;
      case 'warehouses':
        titleEl.textContent = 'Omborlar Boshqaruvi';
        subtitleEl.textContent = 'Yangi omborlar yaratish, sig\'imni monitoring qilish va nazorat';
        WarehousesUI.render();
        break;
      case 'products':
        titleEl.textContent = 'Mahsulotlar Katalogi';
        subtitleEl.textContent = 'Omborda saqlanayotgan barcha mahsulotlar ro\'yxati va qoldiqlar';
        ProductsUI.render();
        break;
      case 'tariffs':
        titleEl.textContent = 'Saqlash Tariflari';
        subtitleEl.textContent = 'Omborda tovarlarni saqlash tariflarini kiritish va tahrirlash';
        TariffsUI.render();
        break;
      case 'calculator':
        titleEl.textContent = 'Saqlash Xarajat Kalkulyatori';
        subtitleEl.textContent = 'Tariflar asosida saqlash summasini real vaqtda tezkor hisoblash';
        CalculatorUI.render();
        break;
    }

    // Mobil qurilmalarda sahifa tepasiga o'tish
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};


// ===================================================================
// 4. BOSHQARUV PANELI (DASHBOARD UI)
// ===================================================================

const DashboardUI = {
  render() {
    const warehouses = DataStore.getWarehouses();
    const products = DataStore.getProducts();
    const tariffs = DataStore.getTariffs();
    const logs = DataStore.getLogs();

    // 1. Statistika kartalari
    document.getElementById('statTotalWarehouses').textContent = warehouses.length;
    document.getElementById('statTotalProducts').textContent = products.length;

    // Umumiy sig'im hisobi
    let totalCap = 0;
    let occupiedCap = 0;
    warehouses.forEach(w => {
      totalCap += Number(w.totalCapacity || 0);
      occupiedCap += Number(w.occupiedCapacity || 0);
    });

    const usagePercent = totalCap > 0 ? Math.round((occupiedCap / totalCap) * 100) : 0;
    document.getElementById('statCapacityUsage').textContent = `${usagePercent}%`;
    document.getElementById('statCapacityText').textContent = `${UI.formatNumber(occupiedCap)} / ${UI.formatNumber(totalCap)} m³`;

    // Taxminiy kunlik saqlash daromadi/qiymati
    let dailyEst = 0;
    products.forEach(p => {
      const tariff = tariffs.find(t => t.id === p.tariffId);
      if (tariff) {
        if (tariff.billingPeriod === 'kunlik') {
          dailyEst += Number(tariff.pricePerUnit) * Number(p.quantity);
        } else {
          // oylik tarif bo'lsa kunlikka taqsimlash
          dailyEst += (Number(tariff.pricePerUnit) / 30) * Number(p.quantity);
        }
      }
    });
    document.getElementById('statEstimatedRevenue').textContent = UI.formatMoney(Math.round(dailyEst));

    // 2. So'nggi mahsulotlar jadvali (5 tagacha)
    const recentTable = document.getElementById('dashboardRecentProductsTable');
    if (products.length === 0) {
      recentTable.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">Hozircha mahsulotlar kiritilmagan</td></tr>`;
    } else {
      const topRecent = products.slice(0, 5);
      recentTable.innerHTML = topRecent.map(p => {
        const wh = warehouses.find(w => w.id === p.warehouseId);
        const tr = tariffs.find(t => t.id === p.tariffId);
        return `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td><code>${p.sku || 'SKU-yo\'q'}</code></td>
            <td>${wh ? wh.name : 'Noma\'lum ombor'}</td>
            <td><strong>${UI.formatNumber(p.quantity)}</strong> ${p.unit}</td>
            <td><span class="badge badge-blue">${tr ? tr.name : 'Standart'}</span></td>
            <td style="color: var(--text-muted);">${p.entryDate || '-'}</td>
          </tr>
        `;
      }).join('');
    }

    // 3. Omborlar holati ro'yxati
    const whListEl = document.getElementById('dashboardWarehousesList');
    if (warehouses.length === 0) {
      whListEl.innerHTML = `<div class="empty-state" style="padding: 16px;"><p>Ombor mavjud emas</p></div>`;
    } else {
      whListEl.innerHTML = warehouses.map(w => {
        const pct = w.totalCapacity > 0 ? Math.round((w.occupiedCapacity / w.totalCapacity) * 100) : 0;
        let fillClass = '';
        if (pct >= 85) fillClass = 'fill-danger';
        else if (pct >= 65) fillClass = 'fill-warning';

        return `
          <div style="padding: 10px; border: 1px solid var(--border-light); border-radius: var(--radius-md); background: #fafcff;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 4px;">
              <span>${w.name}</span>
              <span>${pct}%</span>
            </div>
            <div class="progress-track" style="margin-bottom: 6px;">
              <div class="progress-fill ${fillClass}" style="width: ${pct}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted);">
              <span>${w.type}</span>
              <span>${UI.formatNumber(w.occupiedCapacity)} / ${UI.formatNumber(w.totalCapacity)} m³</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // 4. Harakatlar jurnali
    const logsEl = document.getElementById('dashboardLogsList');
    if (logs.length === 0) {
      logsEl.innerHTML = `<div style="font-size: 12px; color: var(--text-muted); text-align: center;">Harakatlar yo'q</div>`;
    } else {
      logsEl.innerHTML = logs.slice(0, 4).map(l => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-sm); background: var(--bg-subtle); font-size: 12px;">
          <div>
            <div style="font-weight: 700; color: var(--text-main);">${l.action}: <span style="font-weight: 500;">${l.item}</span></div>
            <div style="color: var(--text-muted); font-size: 11px;">${l.warehouse} • ${l.user}</div>
          </div>
          <span style="color: var(--primary); font-weight: 600; font-size: 11px;">${l.time}</span>
        </div>
      `).join('');
    }
  }
};


// ===================================================================
// 5. OMBORLAR BO'LIMI (WAREHOUSES UI)
// ===================================================================

const WarehousesUI = {
  render() {
    const warehouses = DataStore.getWarehouses();
    const products = DataStore.getProducts();
    const searchVal = (document.getElementById('warehouseSearchInput')?.value || '').toLowerCase().trim();
    const grid = document.getElementById('warehousesGrid');

    let filtered = warehouses;
    if (searchVal) {
      filtered = warehouses.filter(w => 
        w.name.toLowerCase().includes(searchVal) ||
        (w.city && w.city.toLowerCase().includes(searchVal)) ||
        (w.type && w.type.toLowerCase().includes(searchVal))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          </div>
          <h4>Mos ombor topilmadi</h4>
          <p>Yangi omborxona kiritishingiz yoki qidiruv so'zini o'zgartirishingiz mumkin.</p>
          <button class="btn-primary" onclick="UI.openModal('addWarehouseModal')">Yangi ombor yaratish</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(w => {
      // Ombordagi tovarlar sonini aniqlash
      const whProducts = products.filter(p => p.warehouseId === w.id);
      const pct = w.totalCapacity > 0 ? Math.round((w.occupiedCapacity / w.totalCapacity) * 100) : 0;

      let fillClass = '';
      let badgeHtml = '<span class="badge badge-green">Faol</span>';
      if (pct >= 90) {
        fillClass = 'fill-danger';
        badgeHtml = '<span class="badge badge-red">To\'lgan</span>';
      } else if (pct >= 70) {
        fillClass = 'fill-warning';
        badgeHtml = '<span class="badge badge-yellow">Bandlik yuqori</span>';
      }

      return `
        <div class="warehouse-card">
          <div class="warehouse-card-top">
            <div class="warehouse-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            ${badgeHtml}
          </div>

          <h3 class="warehouse-title">${w.name}</h3>
          <div class="warehouse-location">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${w.city || 'Manzil ko\'rsatilmagan'}
          </div>

          <div class="warehouse-capacity-bar">
            <div class="capacity-label">
              <span>Bandlik hajmi</span>
              <span>${pct}% (${UI.formatNumber(w.occupiedCapacity)} / ${UI.formatNumber(w.totalCapacity)} m³)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${fillClass}" style="width: ${pct}%"></div>
            </div>
          </div>

          <div class="warehouse-details-list">
            <div class="warehouse-detail-row">
              <span>Ombor turi:</span>
              <strong>${w.type || 'Standart'}</strong>
            </div>
            <div class="warehouse-detail-row">
              <span>Mahsulot turlari:</span>
              <strong>${whProducts.length} xil mahsulot</strong>
            </div>
            <div class="warehouse-detail-row">
              <span>Mas'ul shaxs:</span>
              <strong>${w.manager || 'Tayinlanmagan'}</strong>
            </div>
            <div class="warehouse-detail-row">
              <span>Aloqa:</span>
              <strong>${w.phone || '-'}</strong>
            </div>
          </div>

          <div class="warehouse-card-actions">
            <button class="btn-secondary" style="flex: 1;" onclick="WarehousesUI.openEdit('${w.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              Tahrirlash
            </button>
            <button class="btn-danger-outline" onclick="WarehousesUI.delete('${w.id}')" title="Omborni o'chirish">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  handleSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('editWarehouseId').value;
    const name = document.getElementById('whName').value.trim();
    const city = document.getElementById('whCity').value.trim();
    const type = document.getElementById('whType').value;
    const capacity = Number(document.getElementById('whCapacity').value);
    const manager = document.getElementById('whManager').value.trim();
    const phone = document.getElementById('whPhone').value.trim();

    if (!name || !city || isNaN(capacity) || capacity <= 0) {
      UI.showToast('Iltimos, ombor nomi, manzili va sig\'imini to\'g\'ri kiriting!', 'danger');
      return;
    }

    if (editId) {
      DataStore.updateWarehouse(editId, {
        name,
        city,
        type,
        totalCapacity: capacity,
        manager,
        phone
      });
      UI.showToast('Ombor muvaffaqiyatli yangilandi!', 'success');
    } else {
      DataStore.addWarehouse({
        name,
        city,
        type,
        totalCapacity: capacity,
        occupiedCapacity: 0,
        manager,
        phone,
        status: 'Faol'
      });
      UI.showToast('Yangi ombor yaratildi!', 'success');
    }

    UI.closeModal('addWarehouseModal');
    this.render();
    DashboardUI.render();
  },

  openEdit(id) {
    const warehouse = DataStore.getWarehouses().find(w => w.id === id);
    if (!warehouse) return;

    document.getElementById('editWarehouseId').value = warehouse.id;
    document.getElementById('whName').value = warehouse.name;
    document.getElementById('whCity').value = warehouse.city || '';
    document.getElementById('whType').value = warehouse.type || 'Standart Quruq Ombor';
    document.getElementById('whCapacity').value = warehouse.totalCapacity;
    document.getElementById('whManager').value = warehouse.manager || '';
    document.getElementById('whPhone').value = warehouse.phone || '';

    document.getElementById('warehouseModalTitle').textContent = 'Omborni Tahrirlash';
    document.getElementById('whSubmitBtn').textContent = 'O\'zgarishlarni saqlash';

    UI.openModal('addWarehouseModal');
  },

  delete(id) {
    const warehouse = DataStore.getWarehouses().find(w => w.id === id);
    if (!warehouse) return;

    if (confirm(`Haqiqatan ham "${warehouse.name}" omborini o'chirmoqchimisiz?`)) {
      DataStore.deleteWarehouse(id);
      UI.showToast('Ombor o\'chirildi', 'info');
      this.render();
      DashboardUI.render();
    }
  }
};


// ===================================================================
// 6. MAHSULOTLAR BO'LIMI (PRODUCTS UI)
// ===================================================================

const ProductsUI = {
  populateDropdowns() {
    const warehouses = DataStore.getWarehouses();
    const tariffs = DataStore.getTariffs();

    // Omborlar selecti
    const whSelect = document.getElementById('pWarehouse');
    if (whSelect) {
      if (warehouses.length === 0) {
        whSelect.innerHTML = `<option value="">Omborlar mavjud emas (avval ombor yarating)</option>`;
      } else {
        whSelect.innerHTML = warehouses.map(w => `<option value="${w.id}">${w.name} (${w.city || ''})</option>`).join('');
      }
    }

    // Saqlash tariflari selecti
    const trSelect = document.getElementById('pTariff');
    if (trSelect) {
      if (tariffs.length === 0) {
        trSelect.innerHTML = `<option value="">Tariflar mavjud emas</option>`;
      } else {
        trSelect.innerHTML = tariffs.map(t => `
          <option value="${t.id}">${t.name} - ${UI.formatMoney(t.pricePerUnit)} / ${t.billingPeriod}</option>
        `).join('');
      }
    }

    // Filtrlash ombor selecti
    const filterSelect = document.getElementById('productFilterWarehouse');
    if (filterSelect) {
      const currentVal = filterSelect.value;
      filterSelect.innerHTML = `<option value="">Barcha omborlar</option>` + 
        warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
      filterSelect.value = currentVal;
    }
  },

  render() {
    this.populateDropdowns();

    const products = DataStore.getProducts();
    const warehouses = DataStore.getWarehouses();
    const tariffs = DataStore.getTariffs();

    const searchVal = (document.getElementById('productSearchInput')?.value || '').toLowerCase().trim();
    const selectedWh = document.getElementById('productFilterWarehouse')?.value || '';

    let filtered = products;

    if (selectedWh) {
      filtered = filtered.filter(p => p.warehouseId === selectedWh);
    }

    if (searchVal) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchVal) ||
        (p.sku && p.sku.toLowerCase().includes(searchVal)) ||
        (p.category && p.category.toLowerCase().includes(searchVal))
      );
    }

    const tbody = document.getElementById('productsTableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              </div>
              <h4>Mahsulotlar topilmadi</h4>
              <p>Omborga yangi tovar yoki mahsulot kiritishingiz mumkin.</p>
              <button class="btn-primary" onclick="UI.openModal('addProductModal')">Mahsulot kiritish</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const wh = warehouses.find(w => w.id === p.warehouseId);
      const tr = tariffs.find(t => t.id === p.tariffId);

      let statusBadge = '<span class="badge badge-green">Yetarli</span>';
      if (p.quantity <= (p.minStock || 10)) {
        statusBadge = '<span class="badge badge-red">Kam qoldi</span>';
      }

      return `
        <tr>
          <td>
            <strong>${p.name}</strong>
            ${p.notes ? `<div style="font-size: 11px; color: var(--text-muted);">${p.notes}</div>` : ''}
          </td>
          <td><code>${p.sku || 'SKU-yo\'q'}</code></td>
          <td><span class="badge badge-blue">${p.category || 'Boshqa'}</span></td>
          <td>
            <strong>${wh ? wh.name : 'Noma\'lum ombor'}</strong>
            <div style="font-size: 11px; color: var(--text-muted);">${wh ? wh.city : ''}</div>
          </td>
          <td>
            <strong style="font-size: 14px; color: var(--primary);">${UI.formatNumber(p.quantity)}</strong> ${p.unit}
          </td>
          <td>
            ${tr ? `
              <div style="font-weight: 700;">${tr.name}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${UI.formatMoney(tr.pricePerUnit)} / ${tr.billingPeriod}</div>
            ` : '<span style="color: var(--text-muted);">Biriktirilmagan</span>'}
          </td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn-outline-blue" onclick="ProductsUI.openEdit('${p.id}')" title="Tahrirlash">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button class="btn-danger-outline" onclick="ProductsUI.delete('${p.id}')" title="O'chirish">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  handleSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('editProductId').value;
    const name = document.getElementById('pName').value.trim();
    const sku = document.getElementById('pSku').value.trim();
    const category = document.getElementById('pCategory').value;
    const warehouseId = document.getElementById('pWarehouse').value;
    const quantity = Number(document.getElementById('pQuantity').value);
    const unit = document.getElementById('pUnit').value;
    const tariffId = document.getElementById('pTariff').value;
    const notes = document.getElementById('pNotes').value.trim();

    if (!name || isNaN(quantity) || quantity <= 0) {
      UI.showToast('Iltimos, mahsulot nomi va miqdorini to\'g\'ri kiriting!', 'danger');
      return;
    }

    if (editId) {
      DataStore.updateProduct(editId, {
        name,
        sku,
        category,
        warehouseId,
        quantity,
        unit,
        tariffId,
        notes
      });
      UI.showToast('Mahsulot ma\'lumotlari yangilandi!', 'success');
    } else {
      DataStore.addProduct({
        name,
        sku: sku || 'UZ-SKU-' + Math.floor(1000 + Math.random() * 9000),
        category,
        warehouseId,
        quantity,
        unit,
        tariffId,
        notes,
        minStock: Math.max(10, Math.round(quantity * 0.1))
      });
      UI.showToast('Yangi mahsulot omborga kiritildi!', 'success');
    }

    UI.closeModal('addProductModal');
    this.render();
    DashboardUI.render();
  },

  openEdit(id) {
    const product = DataStore.getProducts().find(p => p.id === id);
    if (!product) return;

    this.populateDropdowns();

    document.getElementById('editProductId').value = product.id;
    document.getElementById('pName').value = product.name;
    document.getElementById('pSku').value = product.sku || '';
    document.getElementById('pCategory').value = product.category || 'Oziq-ovqat';
    document.getElementById('pWarehouse').value = product.warehouseId;
    document.getElementById('pQuantity').value = product.quantity;
    document.getElementById('pUnit').value = product.unit || 'dona';
    document.getElementById('pTariff').value = product.tariffId;
    document.getElementById('pNotes').value = product.notes || '';

    document.getElementById('productModalTitle').textContent = 'Mahsulotni Tahrirlash';
    document.getElementById('pSubmitBtn').textContent = 'O\'zgarishlarni saqlash';

    UI.openModal('addProductModal');
  },

  delete(id) {
    const product = DataStore.getProducts().find(p => p.id === id);
    if (!product) return;

    if (confirm(`Haqiqatan ham "${product.name}" mahsulotini o'chirmoqchimisiz?`)) {
      DataStore.deleteProduct(id);
      UI.showToast('Mahsulot o\'chirildi', 'info');
      this.render();
      DashboardUI.render();
    }
  }
};


// ===================================================================
// 7. SAQLASH TARIFLARI BO'LIMI (TARIFFS UI)
// ===================================================================

const TariffsUI = {
  render() {
    const tariffs = DataStore.getTariffs();
    const grid = document.getElementById('tariffsGrid');

    if (tariffs.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h4>Tariflar mavjud emas</h4>
          <p>Mahsulotlarni omborda saqlash uchun yangi tarif yarating.</p>
          <button class="btn-primary" onclick="UI.openModal('addTariffModal')">Tarif yaratish</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = tariffs.map(t => {
      const featuresList = (t.features || []).map(f => `
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ${f}
        </li>
      `).join('');

      return `
        <div class="tariff-card ${t.isPopular ? 'featured' : ''}">
          ${t.isPopular ? '<span class="tariff-badge">Tavsiya etiladi</span>' : ''}
          <div class="tariff-name">${t.name}</div>
          <div class="tariff-desc">${t.description || 'Omborda xavfsiz va kafolatlangan saqlash tarifi.'}</div>
          <div class="tariff-price">
            ${UI.formatMoney(t.pricePerUnit)}
            <span>/ ${t.billingPeriod} (${t.unitType || 'birlik'})</span>
          </div>

          <ul class="tariff-features">
            ${featuresList || '<li>Standart ombor sharoiti</li>'}
          </ul>

          <div style="display: flex; gap: 8px; margin-top: auto;">
            <button class="btn-secondary" style="flex: 1;" onclick="TariffsUI.openEdit('${t.id}')">
              Tahrirlash
            </button>
            <button class="btn-danger-outline" onclick="TariffsUI.delete('${t.id}')" title="Tarifni o'chirish">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  handleSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('editTariffId').value;
    const name = document.getElementById('trName').value.trim();
    const price = Number(document.getElementById('trPrice').value);
    const billingPeriod = document.getElementById('trPeriod').value;
    const unitType = document.getElementById('trUnitType').value;
    const description = document.getElementById('trDescription').value.trim();
    const featuresRaw = document.getElementById('trFeatures').value.trim();

    if (!name || isNaN(price) || price <= 0) {
      UI.showToast('Iltimos, tarif nomi va narxini to\'g\'ri kiriting!', 'danger');
      return;
    }

    const features = featuresRaw ? featuresRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

    if (editId) {
      DataStore.updateTariff(editId, {
        name,
        pricePerUnit: price,
        billingPeriod,
        unitType,
        description,
        features
      });
      UI.showToast('Saqlash tarifi yangilandi!', 'success');
    } else {
      DataStore.addTariff({
        name,
        pricePerUnit: price,
        billingPeriod,
        unitType,
        description,
        features,
        currency: 'UZS',
        isPopular: false
      });
      UI.showToast('Yangi saqlash tarifi kiritildi!', 'success');
    }

    UI.closeModal('addTariffModal');
    this.render();
    ProductsUI.populateDropdowns();
    CalculatorUI.render();
  },

  openEdit(id) {
    const tariff = DataStore.getTariffs().find(t => t.id === id);
    if (!tariff) return;

    document.getElementById('editTariffId').value = tariff.id;
    document.getElementById('trName').value = tariff.name;
    document.getElementById('trPrice').value = tariff.pricePerUnit;
    document.getElementById('trPeriod').value = tariff.billingPeriod || 'kunlik';
    document.getElementById('trUnitType').value = tariff.unitType || 'pallet';
    document.getElementById('trDescription').value = tariff.description || '';
    document.getElementById('trFeatures').value = (tariff.features || []).join('\n');

    document.getElementById('tariffModalTitle').textContent = 'Tarifni Tahrirlash';
    document.getElementById('trSubmitBtn').textContent = 'O\'zgarishlarni saqlash';

    UI.openModal('addTariffModal');
  },

  delete(id) {
    const tariff = DataStore.getTariffs().find(t => t.id === id);
    if (!tariff) return;

    if (confirm(`Haqiqatan ham "${tariff.name}" tarifini o'chirmoqchimisiz?`)) {
      DataStore.deleteTariff(id);
      UI.showToast('Tarif o\'chirildi', 'info');
      this.render();
      ProductsUI.populateDropdowns();
      CalculatorUI.render();
    }
  }
};


// ===================================================================
// 8. SAQLASH KALKULYATORI (CALCULATOR UI)
// ===================================================================

const CalculatorUI = {
  render() {
    const tariffs = DataStore.getTariffs();
    const select = document.getElementById('calcTariffSelect');
    if (!select) return;

    select.innerHTML = tariffs.map(t => `
      <option value="${t.id}">${t.name} (${UI.formatMoney(t.pricePerUnit)} / ${t.billingPeriod})</option>
    `).join('');

    this.calculate();
  },

  calculate() {
    const tariffId = document.getElementById('calcTariffSelect')?.value;
    const qty = Number(document.getElementById('calcQuantity')?.value || 1);
    const duration = Number(document.getElementById('calcDuration')?.value || 1);

    const tariffs = DataStore.getTariffs();
    const tariff = tariffs.find(t => t.id === tariffId);

    if (!tariff) {
      document.getElementById('calcResultDisplay').textContent = '0 UZS';
      return;
    }

    let total = 0;
    if (tariff.billingPeriod === 'kunlik') {
      total = tariff.pricePerUnit * qty * duration;
    } else {
      // Oylik tarif
      const months = duration / 30;
      total = tariff.pricePerUnit * qty * months;
    }

    document.getElementById('calcResultDisplay').textContent = UI.formatMoney(Math.round(total));
  }
};


// ===================================================================
// 9. ILOVA BOSHLANISHI (INITIALIZATION)
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Bugungi sanani ko'rsatish
  const dateEl = document.getElementById('currentDateDisplay');
  if (dateEl) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
    dateEl.textContent = now.toLocaleDateString('uz-UZ', options);
  }

  // Avtorizatsiya tekshiruvi
  AuthUI.syncAuthView();

  if (Auth.isAuthenticated()) {
    Router.navigate('dashboard');
  }
});
