// --- Navigasi Tab ---
function switchTab(tabId) {
    // Sembunyikan semua konten tab
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Tampilkan tab yang dipilih
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Ubah status tombol aktif di sidebar
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Cari dan aktifkan tombol yang sesuai
    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Resize canvas jika berpindah ke tab papan coret
    if (tabId === 'papancoret') {
        setTimeout(resizeCanvas, 100);
    }
}

// --- Mode Fullscreen IFP ---
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Gagal mengaktifkan mode Layar Penuh: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// --- Akordion Struktur Teks ---
function toggleAcc(element) {
    element.classList.toggle('active');
}

// --- KUIS INTERAKTIF DATA & LOGIKA ---
const quizData = [
    {
        question: "1. Teks cerita fantasi tergolong ke dalam jenis teks...",
        options: ["A. Prosedur", "B. Narasi", "C. Eksplanasi", "D. Laporan"],
        answer: 1
    },
    {
        question: "2. Bagian struktur cerita fantasi yang mengenalkan tokoh, latar, dan alur disebut...",
        options: ["A. Orientasi", "B. Komplikasi", "C. Resolusi", "D. Koda"],
        answer: 0
    },
    {
        question: "3. Salah satu ciri khas keunikan cerita fantasi adalah...",
        options: [
            "A. Berdasarkan fakta ilmiah",
            "B. Menggunakan bahasa formal saja",
            "C. Terdapat keajaiban atau hal mistis/supernatural",
            "D. Tidak memiliki jalan cerita"
        ],
        answer: 2
    },
    {
        question: "4. Bagian cerita yang menggambarkan penyelesaian dari masalah yang dihadapi tokoh adalah...",
        options: ["A. Orientasi", "B. Klimaks", "C. Komplikasi", "D. Resolusi"],
        answer: 3
    }
];

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function loadQuestion() {
    answered = false;
    const currentQuiz = quizData[currentQuestionIndex];
    document.getElementById('question-text').innerText = currentQuiz.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    document.getElementById('quiz-feedback').innerText = '';

    currentQuiz.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, selectedBtn) {
    if (answered) return;
    answered = true;

    const correctIndex = quizData[currentQuestionIndex].answer;
    const allButtons = document.querySelectorAll('.option-btn');

    if (selectedIndex === correctIndex) {
        selectedBtn.classList.add('correct');
        document.getElementById('quiz-feedback').innerText = " Jawaban Benar!";
        document.getElementById('quiz-feedback').style.color = "#10b981";
        score += 25;
        document.getElementById('score').innerText = score;
    } else {
        selectedBtn.classList.add('wrong');
        allButtons[correctIndex].classList.add('correct');
        document.getElementById('quiz-feedback').innerText = " Jawaban Kurang Tepat!";
        document.getElementById('quiz-feedback').style.color = "#ef4444";
    }
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        document.getElementById('question-box').innerHTML = `<h3> Kuis Selesai!</h3><p style="font-size:1.2rem; margin-top:10px;">Total Skor Anda: <strong>${score}</strong> / 100</p>`;
        document.getElementById('options-container').innerHTML = '';
        document.getElementById('quiz-feedback').innerText = '';
    }
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').innerText = score;
    
    // Kembalikan struktur awal question-box
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.querySelector('#question-box').innerHTML = `
        <h3 id="question-text"></h3>
        <div id="options-container" class="options-grid"></div>
    `;
    loadQuestion();
}

// Inisialisasi Kuis saat pertama dimuat
loadQuestion();

// --- LOGIKA PAPAN CORET (CANVAS TOUCH/STYLUS FOR IFP) ---
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Event Penentut Titik Sentuh/Kursor
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function startDrawing(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault(); // Mencegah scrolling saat mencoret di IFP
    const pos = getPos(e);
    
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    ctx.lineWidth = document.getElementById('brushSize').value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Mouse Events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Touch Events (Khusus Layar Sentuh / IFP / Stylus)
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);