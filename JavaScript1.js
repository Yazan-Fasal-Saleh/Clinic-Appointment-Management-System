let appointments = [];

const form = document.getElementById("appointmentForm");
const body = document.getElementById("appointmentsBody");
const searchInput = document.getElementById("searchInput");
const todayCount = document.getElementById("todayCount");
const weekCount = document.getElementById("weekCount");

// إضافة موعد
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const appt = {
        id: Date.now(),
        name: patientName.value,
        phone: phone.value,
        department: department.value,
        date: date.value,
        time: time.value
    };

appointments.push(appt);
render();
form.reset();
});

// عرض المواعيد
function render() {
    body.innerHTML = "";

    const filtered = appointments.filter(a =>
        a.name.includes(searchInput.value)
    );

    filtered.forEach(a => {
        const row = document.createElement("tr");

    row.innerHTML = `
        <td>${a.name}</td>
        <td>${a.phone}</td>
        <td style="color:${getColor(a.department)}">${a.department}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>
            <button class="btn-secondary" onclick="edit(${a.id})">تعديل</button>
            <button class="btn-danger" onclick="del(${a.id})">حذف</button>
        </td>
        `;

    body.appendChild(row);
});

updateStats();
}

// ألوان التخصصات
function getColor(dep) {
    return {
        "باطنية": "#007bff",
        "أسنان": "#e67e22",
        "أطفال": "#27ae60",
        "جلدية": "#8e44ad"
    }[dep];
}

// حذف موعد
function del(id) {
    appointments = appointments.filter(a => a.id !== id);
    render();
}

// تعديل موعد
function edit(id) {
    const a = appointments.find(x => x.id === id);
    patientName.value = a.name;
    phone.value = a.phone;
    department.value = a.department;
    date.value = a.date;
    time.value = a.time;

    del(id);
}

// بحث فوري
searchInput.addEventListener("input", render);

// إحصائيات
function updateStats() {
    const today = new Date().toISOString().split("T")[0];

    todayCount.textContent = appointments.filter(a => a.date === today).length;

    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() + 6));

    weekCount.textContent = appointments.filter(a => {
        const d = new Date(a.date);
    return d >= weekStart && d <= weekEnd;
}).length;
}

// تصدير Excel
function exportExcel() {
    let csv = "اسم المريض,الجوال,التخصص,التاريخ,الوقت\n";

    appointments.forEach(a => {
        csv += `${a.name},${a.phone},${a.department},${a.date},${a.time}\n`;
});

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "appointments.csv";
link.click();
}

// الوضع الليلي
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};
