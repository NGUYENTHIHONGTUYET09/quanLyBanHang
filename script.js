function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
}

function addRow(tableId) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const rowCount = table.rows.length;
    let row;
    if (tableId === 'nguyenlieuTable') {
        row = `<tr>
            <td>${rowCount + 1}</td>
            <td><input type="text" placeholder="Tên nguyên liệu"></td>
            <td><input type="number" min="0" value="0" onchange="autoTinhTien(this)"></td>
            <td><input type="number" min="0" value="0" onchange="autoTinhTien(this)"></td>
            <td class="tongTien">0</td>
            <td><input type="text" placeholder="Ghi chú"></td>
            <td><button onclick="deleteRow(this)">Xóa</button></td>
        </tr>`;
    } else if (tableId === 'doanhthuTable') {
        row = `<tr>
            <td>${rowCount + 1}</td>
            <td><input type="date"></td>
            <td><input type="text" placeholder="Mặt hàng"></td>
            <td><input type="number" min="0" value="0" onchange="autoTinhDoanhThu(this)"></td>
            <td><input type="number" min="0" value="0" onchange="autoTinhDoanhThu(this)"></td>
            <td class="tongBan">0</td>
            <td><input type="number" min="0" value="0" onchange="autoTinhDoanhThu(this)"></td>
            <td><input type="number" min="0" value="0" onchange="autoTinhDoanhThu(this)"></td>
            <td class="thanhTienSauTru">0</td>
            <td><button onclick="deleteRow(this)">Xóa</button></td>
        </tr>`;
    } else if (tableId === 'quyTable') {
        row = `<tr>
            <td>${rowCount + 1}</td>
            <td><input type="text" placeholder="Tên người góp"></td>
            <td><input type="number" min="0" value="0" onchange="autoTinhQuy()"></td>
            <td><button onclick="deleteRow(this)">Xóa</button></td>
        </tr>`;
    }
    table.insertAdjacentHTML('beforeend', row);
    saveData();
}

function deleteRow(btn) {
    const row = btn.closest('tr');
    row.parentNode.removeChild(row);
    autoTinhTien();
    autoTinhDoanhThu();
    autoTinhQuy();
    updateSTT();
    saveData();
}

function updateSTT() {
    ['nguyenlieuTable','doanhthuTable','quyTable'].forEach(tableId => {
        const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
        Array.from(table.rows).forEach((row, idx) => {
            row.cells[0].innerText = idx + 1;
        });
    });
    autoTinhTien();
    autoTinhDoanhThu();
    autoTinhQuy();
}

function autoTinhTien() {
    let chiNguyenLieu = 0;
    const table = document.getElementById('nguyenlieuTable').getElementsByTagName('tbody')[0];
    Array.from(table.rows).forEach(row => {
        const soLuong = Number(row.cells[2].querySelector('input').value);
        const thanhTien = Number(row.cells[3].querySelector('input').value);
        const tongTien = soLuong * thanhTien;
        row.cells[4].innerText = tongTien;
        chiNguyenLieu += tongTien;
    });
    document.getElementById('chiNguyenLieu').innerText = chiNguyenLieu;
    if(document.getElementById('tongTienNguyenLieu')) document.getElementById('tongTienNguyenLieu').innerText = chiNguyenLieu;
    autoTinhLoi();
    autoTinhQuy();
    saveData();
}

function autoTinhDoanhThu() {
    let tienBan = 0;
    let tienLoi = 0;
    const table = document.getElementById('doanhthuTable').getElementsByTagName('tbody')[0];
    Array.from(table.rows).forEach(row => {
        const gia = Number(row.cells[3].querySelector('input').value);
        const soLuong = Number(row.cells[4].querySelector('input').value);
        const tongBan = gia * soLuong;
        row.cells[5].innerText = tongBan;
        tienBan += tongBan;
        const chiNguyenLieu = Number(row.cells[6].querySelector('input').value);
        const phiPhatSinh = Number(row.cells[7].querySelector('input').value);
        const thanhTienSauTru = tongBan - chiNguyenLieu - phiPhatSinh;
        row.cells[8].innerText = thanhTienSauTru;
        tienLoi += thanhTienSauTru;
    });
    document.getElementById('tienBan').innerText = tienBan;
    document.getElementById('tienLoi').innerText = tienLoi;
    if(document.getElementById('tongTienBanDuoc')) document.getElementById('tongTienBanDuoc').innerText = tienBan;
    autoTinhLoi();
    autoTinhQuy();
    saveData();
}

function autoTinhQuy() {
    // Tính tổng tiền quỹ đầu tư
    let tongQuy = 0;
    const table = document.getElementById('quyTable').getElementsByTagName('tbody')[0];
    Array.from(table.rows).forEach(row => {
        const soTien = Number(row.cells[2].querySelector('input').value);
        tongQuy += soTien;
    });
    if(document.getElementById('tongQuyDauTu')) document.getElementById('tongQuyDauTu').innerText = tongQuy;
    if(document.getElementById('tienGoc')) document.getElementById('tienGoc').innerText = tongQuy;
    if(document.getElementById('tongQuyFooter')) document.getElementById('tongQuyFooter').innerText = tongQuy;
    // Tính tiền còn lại (cả gốc lẫn lãi)
    const tienLoi = Number(document.getElementById('tienLoi').innerText);
    const tienConLai = tongQuy + tienLoi;
    if(document.getElementById('tienConLai')) document.getElementById('tienConLai').innerText = tienConLai;
    saveData();
}

function autoTinhLoi() {
    // Tính lại tiền lời tổng thể
    const tienLoi = Number(document.getElementById('tienLoi').innerText);
    document.getElementById('tienLoi').innerText = tienLoi;
}

function tinhLuong() {
    const tienLoi = Number(document.getElementById('tienLoi').innerText);
    const soNhanVien = Number(document.getElementById('soNhanVien').value);
    if (soNhanVien > 0) {
        const luong = Math.floor(tienLoi / soNhanVien);
        document.getElementById('luongNhanVien').innerText = `Lương mỗi nhân viên: ${luong}`;
    } else {
        document.getElementById('luongNhanVien').innerText = '';
    }
    saveData();
}

// Tự động tính khi thay đổi
window.addEventListener('input', function(e) {
    if (e.target.closest('#nguyenlieuTable')) autoTinhTien();
    if (e.target.closest('#doanhthuTable')) autoTinhDoanhThu();
});

// Lưu dữ liệu vào localStorage
function saveData() {
    // Nguyên liệu
    const nguyenlieu = [];
    document.querySelectorAll('#nguyenlieuTable tbody tr').forEach(row => {
        nguyenlieu.push({
            ten: row.cells[1].querySelector('input').value,
            soLuong: row.cells[2].querySelector('input').value,
            thanhTien: row.cells[3].querySelector('input').value,
            ghiChu: row.cells[5].querySelector('input').value
        });
    });
    // Doanh thu
    const doanhthu = [];
    document.querySelectorAll('#doanhthuTable tbody tr').forEach(row => {
        doanhthu.push({
            ngay: row.cells[1].querySelector('input').value,
            matHang: row.cells[2].querySelector('input').value,
            gia: row.cells[3].querySelector('input').value,
            soLuong: row.cells[4].querySelector('input').value,
            chiPhiNguyenLieu: row.cells[6].querySelector('input').value,
            phiPhatSinh: row.cells[7].querySelector('input').value
        });
    });
    // Quỹ đầu tư
    const quy = [];
    document.querySelectorAll('#quyTable tbody tr').forEach(row => {
        quy.push({
            tenNguoi: row.cells[1].querySelector('input').value,
            soTien: row.cells[2].querySelector('input').value
        });
    });
    // Số nhân viên
    const soNhanVien = document.getElementById('soNhanVien').value;
    localStorage.setItem('nguyenlieu', JSON.stringify(nguyenlieu));
    localStorage.setItem('doanhthu', JSON.stringify(doanhthu));
    localStorage.setItem('quy', JSON.stringify(quy));
    localStorage.setItem('soNhanVien', soNhanVien);
}

// Khôi phục dữ liệu từ localStorage khi load trang
window.addEventListener('DOMContentLoaded', function() {
    // Nguyên liệu
    const nguyenlieu = JSON.parse(localStorage.getItem('nguyenlieu') || '[]');
    nguyenlieu.forEach(item => {
        addRow('nguyenlieuTable');
        const table = document.getElementById('nguyenlieuTable').getElementsByTagName('tbody')[0];
        const row = table.rows[table.rows.length - 1];
        row.cells[1].querySelector('input').value = item.ten;
        row.cells[2].querySelector('input').value = item.soLuong;
        row.cells[3].querySelector('input').value = item.thanhTien;
        row.cells[5].querySelector('input').value = item.ghiChu;
    });
    // Doanh thu
    const doanhthu = JSON.parse(localStorage.getItem('doanhthu') || '[]');
    doanhthu.forEach(item => {
        addRow('doanhthuTable');
        const table = document.getElementById('doanhthuTable').getElementsByTagName('tbody')[0];
        const row = table.rows[table.rows.length - 1];
        row.cells[1].querySelector('input').value = item.ngay;
        row.cells[2].querySelector('input').value = item.matHang;
        row.cells[3].querySelector('input').value = item.gia;
        row.cells[4].querySelector('input').value = item.soLuong;
        row.cells[6].querySelector('input').value = item.chiPhiNguyenLieu;
        row.cells[7].querySelector('input').value = item.phiPhatSinh;
    });
    // Quỹ đầu tư
    const quy = JSON.parse(localStorage.getItem('quy') || '[]');
    quy.forEach(item => {
        addRow('quyTable');
        const table = document.getElementById('quyTable').getElementsByTagName('tbody')[0];
        const row = table.rows[table.rows.length - 1];
        row.cells[1].querySelector('input').value = item.tenNguoi;
        row.cells[2].querySelector('input').value = item.soTien;
    });
    // Số nhân viên
    const soNhanVien = localStorage.getItem('soNhanVien');
    if (soNhanVien) document.getElementById('soNhanVien').value = soNhanVien;
    // Tính lại các bảng
    autoTinhTien();
    autoTinhDoanhThu();
    autoTinhQuy();
    tinhLuong();
});

// Hàm autoAll cho nút Auto
function autoAll() {
    autoTinhTien();
    autoTinhDoanhThu();
    autoTinhQuy();
    tinhLuong();
}
 
