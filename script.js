function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    localStorage.setItem('lastTab', tabId);
}

function addRow(tableId) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const rowCount = table.rows.length;
    let row;
    // Thêm tham số isRestore để phân biệt khi khôi phục dữ liệu
    let isRestore = arguments.length > 1 ? arguments[1] : false;
    if (tableId === 'nguyenlieuTable') {
        const danhMuc = document.getElementById('optionDanhMuc').value || document.getElementById('optionDanhMuc').options[0].text;
        const danhMucOptions = Array.from(document.getElementById('optionDanhMuc').options).map(opt => `<option${opt.text === danhMuc ? ' selected' : ''}>${opt.text}</option>`).join('');
        row = `<tr data-danhmuc="${danhMuc}">
            <td>${rowCount + 1}</td>
            <td><input type="text" placeholder="Tên nguyên liệu"></td>
            <td><input type="number" min="0" value="0" onchange="autoTinhTien(this)"></td>
            <td><input type="number" min="0" value="0" onchange="autoTinhTien(this)"></td>
            <td class="tongTien">0</td>
            <td><input type="text" placeholder="Ghi chú"></td>
            <td><button onclick="deleteRow(this)">Xóa</button></td>
            <td><select class="danhmuc-row" onchange="changeDanhMucRow(this)">${danhMucOptions}</select></td>
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
    if (!isRestore) saveData();
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
    ['nguyenlieuTable', 'doanhthuTable', 'quyTable'].forEach(tableId => {
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
    let chiNguyenLieuChinh = 0;
    let chiBaoBi = 0;
    let chiPhatSinh = 0;
    const table = document.getElementById('nguyenlieuTable').getElementsByTagName('tbody')[0];
    const selectedDanhMuc = document.getElementById('optionDanhMuc') ? document.getElementById('optionDanhMuc').value : 'Tất cả';
    Array.from(table.rows).forEach(row => {
        const soLuong = Number(row.cells[2].querySelector('input').value);
        const thanhTien = Number(row.cells[3].querySelector('input').value);
        const tongTien = soLuong * thanhTien;
        row.cells[4].innerText = tongTien;
        const danhMuc = row.cells[7].querySelector('.danhmuc-row').value;
        if (danhMuc === 'Nguyên liệu chính') chiNguyenLieuChinh += tongTien;
        else if (danhMuc === 'Bao bì') chiBaoBi += tongTien;
        else if (danhMuc === 'Phát sinh') chiPhatSinh += tongTien;
        // Tính tổng tiền của các dòng đang hiển thị (sau khi lọc)
        if (row.style.display !== 'none') {
            chiNguyenLieu += tongTien;
        }
    });
    // Hiển thị tổng tiền theo danh mục lọc
    const tongTienNguyenLieuEl = document.getElementById('tongTienNguyenLieu');
    const chiNguyenLieuEl = document.getElementById('chiNguyenLieu');
    // Tổng tiền nguyên liệu là tổng của các dòng đang hiển thị
    if (tongTienNguyenLieuEl) tongTienNguyenLieuEl.innerText = chiNguyenLieu;
    if (chiNguyenLieuEl) chiNguyenLieuEl.innerText = chiNguyenLieu;
    // Hiển thị chi tiết thống kê từng loại
    if (document.getElementById('thongkeChiTiet')) {
        document.getElementById('thongkeChiTiet').innerHTML =
            `<ul style='margin:0;padding-left:18px;'>`
            + `<li>Nguyên liệu chính: <b>${chiNguyenLieuChinh}</b></li>`
            + `<li>Bao bì: <b>${chiBaoBi}</b></li>`
            + `<li>Phát sinh: <b>${chiPhatSinh}</b></li>`
            + `<li>Tổng cộng: <b>${chiNguyenLieuChinh + chiBaoBi + chiPhatSinh}</b></li>`
            + `</ul>`;
    }
    autoTinhLoi();
    autoTinhQuy();
    saveData();
}

function autoTinhDoanhThu() {
    let tienBan = 0;
    let tienLoi = 0;
    let tongPhatSinh = 0;
    const table = document.getElementById('doanhthuTable').getElementsByTagName('tbody')[0];
    Array.from(table.rows).forEach(row => {
        const gia = Number(row.cells[3].querySelector('input').value);
        const soLuong = Number(row.cells[4].querySelector('input').value);
        const tongBan = gia * soLuong;
        row.cells[5].innerText = tongBan;
        tienBan += tongBan;
        const chiNguyenLieu = Number(row.cells[6].querySelector('input').value);
        const phiPhatSinh = Number(row.cells[7].querySelector('input').value);
        tongPhatSinh += phiPhatSinh;
        const thanhTienSauTru = tongBan - chiNguyenLieu - phiPhatSinh;
        row.cells[8].innerText = thanhTienSauTru;
        tienLoi += thanhTienSauTru;
    });
    document.getElementById('tienBan').innerText = tienBan;
    document.getElementById('tienLoi').innerText = tienLoi;
    if (document.getElementById('tongTienBanDuoc')) document.getElementById('tongTienBanDuoc').innerText = tienBan;
    // Hiển thị thống kê chi phí phát sinh
    if (document.getElementById('thongkePhatSinh')) {
        document.getElementById('thongkePhatSinh').innerText = tongPhatSinh;
    }
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
    if (document.getElementById('tongQuyDauTu')) document.getElementById('tongQuyDauTu').innerText = tongQuy;
    if (document.getElementById('tienGoc')) document.getElementById('tienGoc').innerText = tongQuy;
    if (document.getElementById('tongQuyFooter')) document.getElementById('tongQuyFooter').innerText = tongQuy;
    // Tính tiền còn lại (cả gốc lẫn lãi)
    const tienLoi = Number(document.getElementById('tienLoi').innerText);
    const tienConLai = tongQuy + tienLoi;
    if (document.getElementById('tienConLai')) document.getElementById('tienConLai').innerText = tienConLai;
    saveData();
}

function autoTinhLoi() {
    // Tính lại tiền lời tổng thể
    const tienLoi = Number(document.getElementById('tienLoi').innerText);
    document.getElementById('tienLoi').innerText = tienLoi;
}

function tinhLuong() {
    const tienGoc = Number(document.getElementById('tienGoc').innerText);
    const tienLoi = Number(document.getElementById('tienLoi').innerText);
    const tongTienNguyenLieu = Number(document.getElementById('tongTienNguyenLieu') ? document.getElementById('tongTienNguyenLieu').innerText : 0);
    const tienConLai = tienGoc + tienLoi - tongTienNguyenLieu;
    const soNhanVien = Number(document.getElementById('soNhanVien').value);
    let html = `<table border='1' cellpadding='8' style='margin-top:12px;border-collapse:collapse;width:420px;text-align:center;background:#fff;border-radius:8px;box-shadow:0 2px 8px #eee;'>`;
    html += `<thead style='background:#f5f5f5;'><tr><th colspan='2' style='font-size:18px;'>Bảng tính lương nhân viên</th></tr></thead>`;
    html += `<tbody>`;
    html += `<tr><td style='width:60%;text-align:left;'><b>Tiền gốc</b><br><span style='color:#007bff;'>(Tổng quỹ đầu tư)</span></td><td>${tienGoc}</td></tr>`;
    html += `<tr><td style='text-align:left;'><b>Tiền lời</b><br><span style='color:#007bff;'>(Tổng doanh thu - Tổng chi phí)</span></td><td>${tienLoi}</td></tr>`;
    html += `<tr><td style='text-align:left;'><b>Tổng tiền nguyên liệu</b><br><span style='color:#007bff;'>(Tổng chi phí nguyên liệu)</span></td><td>${tongTienNguyenLieu}</td></tr>`;
    html += `<tr><td style='text-align:left;'><b>Tổng tiền còn lại</b><br><span style='color:#007bff;'>(Tiền gốc + Tiền lời - Tổng tiền nguyên liệu) = ${tienGoc} + ${tienLoi} - ${tongTienNguyenLieu} = ${tienConLai}</span></td><td>${tienConLai}</td></tr>`;
    html += `<tr><td style='text-align:left;'><b>Số lượng nhân viên</b><br><span style='color:#007bff;'>(Nhập số nhân viên để chia lương)</span></td><td>${soNhanVien}</td></tr>`;
    let luong = 0;
    let congThuc = '';
    if (soNhanVien > 0) {
        luong = Math.floor(tienConLai / soNhanVien);
        congThuc = `<span style='color:#007bff;'>(Tiền còn lại / Số nhân viên) = ${tienConLai} / ${soNhanVien} = ${luong}</span>`;
    } else {
        congThuc = `<span style='color:#007bff;'>(Tiền còn lại / Số nhân viên) = ${tienConLai} / 0 = 0</span>`;
    }
    html += `<tr style='background:#f9f9f9;'><td style='text-align:left;'><b>Lương mỗi nhân viên</b><br>${congThuc}</td><td style='font-weight:bold;color:#28a745;'>${luong}</td></tr>`;
    html += `</tbody></table>`;
    document.getElementById('luongNhanVien').innerHTML = html;
    saveData();
}

// Tự động tính khi thay đổi
window.addEventListener('input', function (e) {
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
            ghiChu: row.cells[5].querySelector('input').value,
            danhMuc: row.getAttribute('data-danhmuc') || row.cells[7].querySelector('.danhmuc-row').value
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
window.addEventListener('DOMContentLoaded', function () {
    // Khôi phục dữ liệu nguyên liệu
    const nguyenlieu = JSON.parse(localStorage.getItem('nguyenlieu') || '[]');
    if (nguyenlieu.length > 0) {
        nguyenlieu.forEach(item => {
            addRow('nguyenlieuTable', true);
            const table = document.getElementById('nguyenlieuTable').getElementsByTagName('tbody')[0];
            const row = table.rows[table.rows.length - 1];
            row.cells[1].querySelector('input').value = item.ten;
            row.cells[2].querySelector('input').value = item.soLuong;
            row.cells[3].querySelector('input').value = item.thanhTien;
            row.cells[5].querySelector('input').value = item.ghiChu;
            if (item.danhMuc) {
                row.setAttribute('data-danhmuc', item.danhMuc);
                const select = row.cells[7].querySelector('.danhmuc-row');
                if (select) {
                    Array.from(select.options).forEach(opt => {
                        opt.selected = (opt.text === item.danhMuc);
                    });
                }
            }
        });
    }
    // Khôi phục dữ liệu doanh thu
    const doanhthu = JSON.parse(localStorage.getItem('doanhthu') || '[]');
    if (doanhthu.length > 0) {
        doanhthu.forEach(item => {
            addRow('doanhthuTable', true);
            const table = document.getElementById('doanhthuTable').getElementsByTagName('tbody')[0];
            const row = table.rows[table.rows.length - 1];
            row.cells[1].querySelector('input').value = item.ngay || '';
            row.cells[2].querySelector('input').value = item.matHang || '';
            row.cells[3].querySelector('input').value = item.gia || 0;
            row.cells[4].querySelector('input').value = item.soLuong || 0;
            row.cells[6].querySelector('input').value = item.chiPhiNguyenLieu || 0;
            row.cells[7].querySelector('input').value = item.phiPhatSinh || 0;
            // Tính lại tổng tiền bán được
            const gia = Number(row.cells[3].querySelector('input').value);
            const soLuong = Number(row.cells[4].querySelector('input').value);
            const tongBan = gia * soLuong;
            row.cells[5].innerText = tongBan;
            // Tính lại thành tiền sau khi trừ chi phí
            const chiNguyenLieu = Number(row.cells[6].querySelector('input').value);
            const phiPhatSinh = Number(row.cells[7].querySelector('input').value);
            const thanhTienSauTru = tongBan - chiNguyenLieu - phiPhatSinh;
            row.cells[8].innerText = thanhTienSauTru;
        });
    }
    // Khôi phục dữ liệu quỹ đầu tư
    const quy = JSON.parse(localStorage.getItem('quy') || '[]');
    if (quy.length > 0) {
        quy.forEach(item => {
            addRow('quyTable', true);
            const table = document.getElementById('quyTable').getElementsByTagName('tbody')[0];
            const row = table.rows[table.rows.length - 1];
            row.cells[1].querySelector('input').value = item.tenNguoi || '';
            row.cells[2].querySelector('input').value = item.soTien || 0;
        });
    }
    // Số nhân viên
    const soNhanVien = localStorage.getItem('soNhanVien');
    if (soNhanVien) document.getElementById('soNhanVien').value = soNhanVien;
    // Giữ nguyên tab đang xem khi reload
    let lastTab = localStorage.getItem('lastTab');
    if (!lastTab) lastTab = 'danhmuc';
    setTimeout(function () { showTab(lastTab); }, 0);
    // Tính lại các bảng
    setTimeout(function () {
        autoTinhTien();
        autoTinhDoanhThu();
        autoTinhQuy();
        tinhLuong();
    }, 0);
});

// Hàm autoAll cho nút Auto
function autoAll() {
    autoTinhTien();
    autoTinhDoanhThu();
    autoTinhQuy();
    tinhLuong();
}

// Lọc nguyên liệu theo danh mục đã chọn
if (document.getElementById('optionDanhMuc')) {
    document.getElementById('optionDanhMuc').addEventListener('change', function () {
        const selected = this.value || this.options[this.selectedIndex].text;
        const rows = document.querySelectorAll('#nguyenlieuTable tbody tr');
        // Nếu chọn "Tất cả" thì hiển thị tất cả
        if (selected === "Tất cả") {
            rows.forEach(row => {
                row.style.display = '';
            });
        } else {
            rows.forEach(row => {
                // Lấy giá trị từ select trong dòng
                const rowDanhMuc = row.cells[7].querySelector('.danhmuc-row').value;
                if (rowDanhMuc === selected) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    });
}

// Cho phép thay đổi danh mục từng dòng
function changeDanhMucRow(select) {
    const row = select.closest('tr');
    row.setAttribute('data-danhmuc', select.value);
    saveData();
}

