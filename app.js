// ==========================================
// SIJA Kelas XI - LocalStorage Ledger Engine
// ==========================================

// Seleksi elemen DOM utama
const studentForm = document.getElementById('studentForm');
const namaInput = document.getElementById('nama');
const kelasInput = document.getElementById('kelas');
const studentTableBody = document.getElementById('studentTableBody');
const clearAllBtn = document.getElementById('clearAllBtn');
const recordCountEl = document.getElementById('recordCount');

// Inisialisasi array data dari localStorage (jika ada) atau buat array kosong
let students = JSON.parse(localStorage.getItem('sija_students')) || [];

// Fungsi untuk merender data ke dalam tabel secara dinamis
function renderTable() {
    studentTableBody.innerHTML = '';

    if (students.length === 0) {
        studentTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">Belum ada data tersimpan di LocalStorage.</td>
            </tr>
        `;
        recordCountEl.textContent = '0 Entri';
        return;
    }

    recordCountEl.textContent = `${students.length} Entri`;

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td style="font-family: var(--font-mono); color: var(--text-secondary);">${index + 1}</td>
            <td style="font-weight: 500;">${escapeHtml(student.nama)}</td>
            <td style="font-family: var(--font-mono); color: var(--accent-gold);">${escapeHtml(student.kelas)}</td>
            <td style="text-align: right;">
                <button class="btn-danger" onclick="deleteStudent(${index})">Hapus</button>
            </td>
        `;
        
        studentTableBody.appendChild(row);
    });
}

// Event listener saat form disubmit (Simpan Data)
studentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const namaVal = namaInput.value.trim();
    const kelasVal = kelasInput.value.trim();

    if (!namaVal || !kelasVal) return;

    // Objek data siswa baru
    const newStudent = {
        nama: namaVal,
        kelas: kelasVal
    };

    // Menerapkan metode .push() untuk menambah data siswa ke dalam array
    students.push(newStudent);

    // Menyimpan secara permanen menggunakan localStorage.setItem() dipadukan dengan JSON.stringify()
    localStorage.setItem('sija_students', JSON.stringify(students));

    // Reset nilai form input
    namaInput.value = '';
    kelasInput.value = '';
    namaInput.focus();

    // Render ulang tabel secara dinamis
    renderTable();
});

// Fungsi untuk menghapus satu data spesifik menggunakan metode .splice()
function deleteStudent(index) {
    // Menghapus 1 elemen pada indeks spesifik menggunakan .splice()
    students.splice(index, 1);

    // Memperbarui localStorage setelah penghapusan
    localStorage.setItem('sija_students', JSON.stringify(students));

    // Render ulang tabel
    renderTable();
}

// Event listener untuk tombol Hapus Semua Data
clearAllBtn.addEventListener('click', function() {
    if (students.length === 0) return;

    if (confirm('Apakah Anda yakin ingin menghapus seluruh data siswa dari penyimpanan browser?')) {
        // Membersihkan seluruh memori penyimpanan menggunakan localStorage.removeItem()
        localStorage.removeItem('sija_students');

        // Kosongkan array in-memory
        students = [];

        // Render ulang tabel
        renderTable();
    }
});

// Fungsi utilitas pencegahan XSS sederhana
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(function(s) {
            return "&#" + s.charCodeAt(0) + ";";
        });
}

// Inisialisasi render saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
