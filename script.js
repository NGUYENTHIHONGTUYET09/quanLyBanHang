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
    // Hiển thị chi tiết thống kê từng loại (luôn hiện kể cả khi giá trị là 0)
    if (document.getElementById('thongkeChiTiet')) {
        document.getElementById('thongkeChiTiet').innerHTML =
            `<ul style='margin:0;padding-left:18px;'>`
            + `<li>Nguyên liệu chính: <b>${chiNguyenLieuChinh || 0}</b></li>`
            + `<li>Bao bì: <b>${chiBaoBi || 0}</b></li>`
            + `<li>Phát sinh: <b>${chiPhatSinh || 0}</b></li>`
            + `<li>Tổng cộng: <b>${(chiNguyenLieuChinh + chiBaoBi + chiPhatSinh) || 0}</b></li>`
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
    let tienConLai = tienGoc + tienLoi - tongTienNguyenLieu;
    const soNhanVien = Number(document.getElementById('soNhanVien').value);
    if (isNaN(tienConLai)) tienConLai = 0;
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
    if (soNhanVien > 0 && tienConLai > 0) {
        luong = Math.floor(tienConLai / soNhanVien);
        congThuc = `<span style='color:#007bff;'>(Tiền còn lại / Số nhân viên) = ${tienConLai} / ${soNhanVien} = ${luong}</span>`;
    } else {
        luong = 0;
        congThuc = `<span style='color:#007bff;'>(Tiền còn lại / Số nhân viên) = ${tienConLai} / ${soNhanVien} = 0</span>`;
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
    try {
        const nguyenlieu = JSON.parse(localStorage.getItem('nguyenlieu') || '[]');
        if (Array.isArray(nguyenlieu) && nguyenlieu.length > 0) {
            nguyenlieu.forEach(item => {
                addRow('nguyenlieuTable', true);
                const table = document.getElementById('nguyenlieuTable').getElementsByTagName('tbody')[0];
                const row = table.rows[table.rows.length - 1];
                row.cells[1].querySelector('input').value = item.ten || '';
                row.cells[2].querySelector('input').value = item.soLuong || 0;
                row.cells[3].querySelector('input').value = item.thanhTien || 0;
                row.cells[5].querySelector('input').value = item.ghiChu || '';
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
    } catch (e) { }
    // Khôi phục dữ liệu doanh thu
    try {
        const doanhthu = JSON.parse(localStorage.getItem('doanhthu') || '[]');
        if (Array.isArray(doanhthu) && doanhthu.length > 0) {
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
    } catch (e) { }
    // Khôi phục dữ liệu quỹ đầu tư
    try {
        const quy = JSON.parse(localStorage.getItem('quy') || '[]');
        if (Array.isArray(quy) && quy.length > 0) {
            quy.forEach(item => {
                addRow('quyTable', true);
                const table = document.getElementById('quyTable').getElementsByTagName('tbody')[0];
                const row = table.rows[table.rows.length - 1];
                row.cells[1].querySelector('input').value = item.tenNguoi || '';
                row.cells[2].querySelector('input').value = item.soTien || 0;
            });
        }
    } catch (e) { }
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

// Xuất dữ liệu ra file JSON
function exportData() {
    function getDateTimeString() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }
    const data = {
        nguyenlieu: JSON.parse(localStorage.getItem('nguyenlieu') || '[]'),
        doanhthu: JSON.parse(localStorage.getItem('doanhthu') || '[]'),
        quy: JSON.parse(localStorage.getItem('quy') || '[]'),
        soNhanVien: localStorage.getItem('soNhanVien') || 1,
        ngay_gio_xuat: getDateTimeString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    let defaultName = 'du_lieu_quan_ly.json';
    let fileName = prompt('Nhập tên file dữ liệu muốn lưu:', defaultName);
    if (!fileName) fileName = defaultName;
    if (!fileName.toLowerCase().endsWith('.json')) fileName += '.json';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Nhập dữ liệu từ file JSON
document.getElementById('importFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
        try {
            const data = JSON.parse(evt.target.result);
            if (data.nguyenlieu) localStorage.setItem('nguyenlieu', JSON.stringify(data.nguyenlieu));
            if (data.doanhthu) localStorage.setItem('doanhthu', JSON.stringify(data.doanhthu));
            if (data.quy) localStorage.setItem('quy', JSON.stringify(data.quy));
            if (data.soNhanVien) localStorage.setItem('soNhanVien', data.soNhanVien);
            alert('Đã nhập dữ liệu thành công! Trang sẽ tự động reload.');
            location.reload();
        } catch (err) {
            alert('File không hợp lệ hoặc bị lỗi!');
        }
    };
    reader.readAsText(file);
});

// In PDF 3 trang: Danh mục nguyên liệu, Doanh thu, Tính toán chi phí
function inPDF() {
    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
        str = str.replace(/\u02C6|\u0306|\u031B/g, "");
        return str;
    }
    function getDateTimeString() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // Ngày giờ xuất phiếu
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(220, 53, 69);
    doc.text(removeVietnameseTones('Ngay gio xuat phieu: ') + getDateTimeString(), 14, 12);
    // Trang 1: Danh muc nguyen lieu
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 116, 166);
    doc.text(removeVietnameseTones('DANH MUC NGUYEN LIEU'), 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica');
    const table1 = document.getElementById('nguyenlieuTable');
    if (table1) {
        const headers = Array.from(table1.querySelectorAll('thead th')).map(th => removeVietnameseTones(th.innerText));
        const rows = Array.from(table1.querySelectorAll('tbody tr')).map(row =>
            Array.from(row.cells).map(cell => removeVietnameseTones(cell.innerText || (cell.querySelector('input,select') ? cell.querySelector('input,select').value : '')))
        );
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 25,
            theme: 'grid',
            headStyles: { fillColor: [40, 116, 166], textColor: 255, fontStyle: 'bold', halign: 'center', font: 'helvetica' },
            bodyStyles: { halign: 'center', font: 'helvetica' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 10, right: 10 },
            styles: { font: 'helvetica', fontSize: 10 },
        });
    }
    // Trang 2: Doanh thu
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(231, 76, 60);
    doc.text(removeVietnameseTones('DOANH THU'), 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica');
    const table2 = document.getElementById('doanhthuTable');
    if (table2) {
        const headers = Array.from(table2.querySelectorAll('thead th')).map(th => removeVietnameseTones(th.innerText));
        const rows = Array.from(table2.querySelectorAll('tbody tr')).map(row =>
            Array.from(row.cells).map(cell => removeVietnameseTones(cell.innerText || (cell.querySelector('input,select') ? cell.querySelector('input,select').value : '')))
        );
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 25,
            theme: 'grid',
            headStyles: { fillColor: [231, 76, 60], textColor: 255, fontStyle: 'bold', halign: 'center', font: 'helvetica' },
            bodyStyles: { halign: 'center', font: 'helvetica' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 10, right: 10 },
            styles: { font: 'helvetica', fontSize: 10 },
        });
    }
    // Trang 3: Tinh toan chi phi
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(39, 174, 96);
    doc.text(removeVietnameseTones('TINH TOAN CHI PHI'), 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica');
    const table3 = document.getElementById('quyTable');
    if (table3) {
        const headers = Array.from(table3.querySelectorAll('thead th')).map(th => removeVietnameseTones(th.innerText));
        const rows = Array.from(table3.querySelectorAll('tbody tr')).map(row =>
            Array.from(row.cells).map(cell => removeVietnameseTones(cell.innerText || (cell.querySelector('input,select') ? cell.querySelector('input,select').value : '')))
        );
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 25,
            theme: 'grid',
            headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold', halign: 'center', font: 'helvetica' },
            bodyStyles: { halign: 'center', font: 'helvetica' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 10, right: 10 },
            styles: { font: 'helvetica', fontSize: 10 },
        });
    }
    // Thong ke
    let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 100;
    doc.setFontSize(15);
    doc.setTextColor(52, 73, 94);
    doc.setFont('helvetica', 'bold');
    doc.text(removeVietnameseTones('Thong ke'), 14, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(44, 62, 80);
    const thongke = [
        removeVietnameseTones(`- Tien da chi mua nguyen lieu: ${(document.getElementById('chiNguyenLieu')?.innerText || '')}`),
        removeVietnameseTones(`- Chi phi phat sinh: ${(document.getElementById('thongkePhatSinh')?.innerText || '')}`),
        removeVietnameseTones(`- Tien da ban: ${(document.getElementById('tienBan')?.innerText || '')}`),
        removeVietnameseTones(`- Tien loi sau khi tru chi phi: ${(document.getElementById('tienLoi')?.innerText || '')}`),
        removeVietnameseTones(`- Tong quy dau tu: ${(document.getElementById('tongQuyDauTu')?.innerText || '')}`),
        removeVietnameseTones(`- Tien goc: ${(document.getElementById('tienGoc')?.innerText || '')}`),
        removeVietnameseTones(`- Tien con lai (goc + lai): ${(document.getElementById('tienConLai')?.innerText || '')}`)
    ];
    thongke.forEach(line => {
        doc.text(line, 16, y, { maxWidth: 180 });
        y += 10;
    });
    // Bang luong nhan vien
    y += 10;
    doc.setFontSize(15);
    doc.setTextColor(52, 152, 219);
    doc.setFont('helvetica', 'bold');
    doc.text(removeVietnameseTones('Bang tinh luong nhan vien'), 14, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(44, 62, 80);
    // Lấy nội dung bảng lương và chuyển thành từng dòng
    const luongDiv = document.getElementById('luongNhanVien');
    if (luongDiv) {
        // Chuyển HTML sang text từng dòng
        let temp = document.createElement('div');
        temp.innerHTML = luongDiv.innerHTML;
        let textLines = [];
        temp.querySelectorAll('tr').forEach(tr => {
            let tds = Array.from(tr.querySelectorAll('td')).map(td => removeVietnameseTones(td.innerText.replace(/\s+/g, ' ').trim()));
            textLines.push(tds.join('    '));
        });
        textLines.forEach(line => {
            doc.text(line, 16, y, { maxWidth: 180 });
            y += 10;
        });
    }
    // Hỏi tên file
    let defaultName = 'Thong_ke_quan_ly.pdf';
    let fileName = prompt('Nhap ten file PDF muon luu:', defaultName);
    if (!fileName) fileName = defaultName;
    if (!fileName.toLowerCase().endsWith('.pdf')) fileName += '.pdf';
    doc.save(fileName);
}

