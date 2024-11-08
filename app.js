let students = [];
let studentFees = {};

// Add a new student
function addStudent() {
  const name = document.getElementById("student-name").value;
  const studentClass = document.getElementById("student-class").value;
  
  if (name && studentClass) {
    const newStudent = { id: Date.now(), name, class: studentClass, fees: Array(12).fill(false) };
    students.push(newStudent);
    renderStudents();
    closeAddStudentModal();
  } else {
    alert('Please enter student name and class');
  }
}

// Open the add student modal
function openAddStudentModal() {
  document.getElementById("add-student-modal").style.display = "block";
}

// Close the add student modal
function closeAddStudentModal() {
  document.getElementById("add-student-modal").style.display = "none";
}

// Render student list
function renderStudents() {
  const studentList = document.getElementById("students");
  studentList.innerHTML = '';
  students.forEach(student => {
    const li = document.createElement('li');
    li.textContent = `${student.name} (Class: ${student.class})`;
    studentList.appendChild(li);
  });
}

// Load student fees
function loadStudentFees() {
  const selectedStudentId = document.getElementById("student").value;
  const selectedStudent = students.find(student => student.id == selectedStudentId);
  const feeStatus = document.getElementById("fee-status");
  feeStatus.innerHTML = '';
  
  selectedStudent.fees.forEach((paid, month) => {
    const monthDiv = document.createElement('div');
    monthDiv.textContent = `Month ${month + 1}: ${paid ? 'Paid' : 'Not Paid'}`;
    const payButton = document.createElement('button');
    payButton.textContent = paid ? 'Unmark' : 'Mark Paid';
    payButton.onclick = () => toggleFeePayment(selectedStudent.id, month);
    monthDiv.appendChild(payButton);
    feeStatus.appendChild(monthDiv);
  });
}

// Toggle payment status
function toggleFeePayment(studentId, month) {
  const student = students.find(student => student.id == studentId);
  student.fees[month] = !student.fees[month];
  loadStudentFees();
  updateAnalytics();
}

// Update analytics
function updateAnalytics() {
  let totalReceived = 0;
  let totalDue = 0;
  
  students.forEach(student => {
    const paidMonths = student.fees.filter(fee => fee).length;
    totalReceived += paidMonths * 600;
    totalDue += (12 - paidMonths) * 600;
  });
  
  document.getElementById('total-received').textContent = `${totalReceived} BDT`;
  document.getElementById('total-due').textContent = `${totalDue} BDT`;
}
