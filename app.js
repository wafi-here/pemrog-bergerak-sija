const studentForm = document.getElementById('studentForm');
const namaInput = document.getElementById('nama');
const kelasInput = document.getElementById('kelas');
const studentTableBody = document.getElementById('studentTableBody');
const clearAllBtn = document.getElementById('clearAllBtn');
const recordCountEl = document.getElementById('recordCount');

let students = JSON.parse(localStorage.getItem('sija_students')) || [];

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

studentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const namaVal = namaInput.value.trim();
    const kelasVal = kelasInput.value.trim();

    if (!namaVal || !kelasVal) return;

    const newStudent = {
        nama: namaVal,
        kelas: kelasVal
    };

    students.push(newStudent);

    localStorage.setItem('sija_students', JSON.stringify(students));

    namaInput.value = '';
    kelasInput.value = '';
    namaInput.focus();

    renderTable();
});

function deleteStudent(index) {
    students.splice(index, 1);

    localStorage.setItem('sija_students', JSON.stringify(students));

    renderTable();
}

clearAllBtn.addEventListener('click', function() {
    if (students.length === 0) return;

    if (confirm('Apakah Anda yakin ingin menghapus seluruh data siswa dari penyimpanan browser?')) {
        localStorage.removeItem('sija_students');
        students = [];
        renderTable();
    }
});

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(function(s) {
            return "&#" + s.charCodeAt(0) + ";";
        });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
