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
}

function deleteRow(btn) {
    const row = btn.closest('tr');
    row.parentNode.removeChild(row);
    autoTinhTien();
    autoTinhDoanhThu();
    autoTinhQuy();
    updateSTT();
}

function updateSTT() {
    ['nguyenlieuTable','doanhthuTable','quyTable'].forEach(tableId => {
        const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
        Array.from(table.rows).forEach((row, idx) => {
            row.cells[0].innerText = idx + 1;
        });
    });
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
    autoTinhLoi();
}

function autoTinhDoanhThu() {
    let tienBan = 0;
    let tienLoi = 0;
    const table = document.getElementById('doanhthuTable').getElementsByTagName('tbody')[0];
    Array.from(table.rows).forEach(row => {
        const gia = Number(row.cells[3].querySelector('input').value);
        const tongBan = gia;
        row.cells[4].innerText = tongBan;
        tienBan += tongBan;
        const chiNguyenLieu = Number(row.cells[5].querySelector('input').value);
        const phiPhatSinh = Number(row.cells[6].querySelector('input').value);
        const thanhTienSauTru = tongBan - chiNguyenLieu - phiPhatSinh;
        row.cells[7].innerText = thanhTienSauTru;
        tienLoi += thanhTienSauTru;
    });
    document.getElementById('tienBan').innerText = tienBan;
    document.getElementById('tienLoi').innerText = tienLoi;
    autoTinhLoi();
}

function autoTinhQuy() {
    // Có thể bổ sung thống kê tổng quỹ đầu tư nếu cần
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
}

// Tự động tính khi thay đổi
window.addEventListener('input', function(e) {
    if (e.target.closest('#nguyenlieuTable')) autoTinhTien();
    if (e.target.closest('#doanhthuTable')) autoTinhDoanhThu();
});
