const giftContainer = document.getElementById('giftContainer');
const shuffleBtn = document.getElementById('shuffleBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const resetBtn = document.getElementById('resetBtn');
const saveDataBtn = document.getElementById('saveDataBtn');
const loadDataBtn = document.getElementById('loadDataBtn');

const numberOfGiftBags = 10;
const maxContentLength = 150; // Giới hạn ký tự
let giftBags = []; // Mảng để lưu trữ các phần tử túi mù
let currentGiftContents = []; // Mảng lưu trữ nội dung hiện tại của các túi mù

// Hàm tạo túi mù
function createGiftBag(index) {
    const giftBag = document.createElement('div');
    giftBag.classList.add('gift-bag');
    
    // Gán màu sắc: 5 hồng bên trên, 5 đen bên dưới
    if (index < 5) {
        giftBag.classList.add('pink');
    } else {
        giftBag.classList.add('black');
    }

    const label = document.createElement('span');
    label.classList.add('label');
    label.textContent = `Túi Mù ${index + 1}`;

    // Đã đổi từ input sang textarea
    const textarea = document.createElement('textarea'); 
    textarea.placeholder = 'Ghi điều ước (tối đa 150 ký tự)...';
    textarea.maxLength = maxContentLength; // Giới hạn ký tự
    textarea.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên giftBag
    });

    const content = document.createElement('div');
    content.classList.add('content');

    giftBag.appendChild(label);
    giftBag.appendChild(textarea); // Thêm textarea vào túi mù
    giftBag.appendChild(content);

    // Xử lý sự kiện click để mở túi mù
    giftBag.addEventListener('click', () => {
        // Chỉ mở túi nếu đã trộn và túi đó chưa được mở
        if (giftBag.classList.contains('shuffled') && !giftBag.classList.contains('open')) {
            // Ẩn tất cả các túi khác và phóng to túi được chọn
            giftBags.forEach(bag => {
                if (bag !== giftBag) {
                    bag.classList.add('hidden');
                }
            });
            giftBag.classList.add('open');
            // HIỂN THỊ NỘI DUNG TỪ DATASET LÊN PHẦN TỬ CONTENT
            content.textContent = giftBag.dataset.actualContent || 'Trống không!'; 
            // Đảm bảo nội dung hiển thị ngay khi túi được mở
            content.style.display = 'flex'; 

            // Hiển thị nút "Chơi Tiếp", ẩn nút trộn và đặt lại
            playAgainBtn.style.display = 'block';
            shuffleBtn.style.display = 'none';
            resetBtn.style.display = 'none';
            saveDataBtn.style.display = 'none'; // Ẩn nút lưu
            loadDataBtn.style.display = 'none'; // Ẩn nút tải
        } else if (!giftBag.classList.contains('shuffled')) {
            alert('Hãy trộn túi mù trước khi mở!');
        }
    });

    return giftBag;
}

// Khởi tạo các túi mù
function initializeGiftBags() {
    giftContainer.innerHTML = ''; // Xóa các túi mù cũ
    giftBags = [];
    currentGiftContents = []; // Reset nội dung
    for (let i = 0; i < numberOfGiftBags; i++) {
        const giftBag = createGiftBag(i);
        giftBags.push(giftBag);
        giftContainer.appendChild(giftBag);
        // Khởi tạo nội dung trống cho mỗi túi
        currentGiftContents.push('');
    }
    // Thiết lập trạng thái ban đầu của các nút
    shuffleBtn.disabled = false;
    shuffleBtn.style.display = 'block';
    playAgainBtn.style.display = 'none';
    resetBtn.style.display = 'block';
    saveDataBtn.style.display = 'block';
    loadDataBtn.style.display = 'block';
}

// Hàm trộn ngẫu nhiên mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí
    }
}

// Xử lý nút trộn
shuffleBtn.addEventListener('click', () => {
    // Cập nhật currentGiftContents từ các textarea trước khi trộn
    giftBags.forEach((bag, index) => {
        currentGiftContents[index] = bag.querySelector('textarea').value; 
    });
    
    shuffleArray(currentGiftContents); // Trộn ngẫu nhiên nội dung

    // Gán nội dung đã trộn vào dataset của từng túi và cập nhật trạng thái
    giftBags.forEach((bag, index) => {
        bag.dataset.actualContent = currentGiftContents[index]; // Lưu nội dung đã trộn vào dataset
        bag.classList.add('shuffled'); // Đánh dấu túi đã được trộn
        bag.classList.remove('open', 'hidden'); // Đảm bảo túi đang đóng và không bị ẩn
        bag.querySelector('textarea').readOnly = true; // Khóa textarea
        bag.querySelector('textarea').style.display = 'none'; // Ẩn textarea
        bag.querySelector('span.label').style.display = 'none'; // Ẩn label

        // Đảm bảo nội dung chữ bên trong cũng bị ẩn trước khi mở
        bag.querySelector('.content').style.display = 'none'; 
    });

    shuffleBtn.disabled = true; // Vô hiệu hóa nút trộn sau khi đã trộn
    saveDataBtn.style.display = 'none';
    loadDataBtn.style.display = 'none';
});

// Xử lý nút "Chơi Tiếp"
playAgainBtn.addEventListener('click', () => {
    // Đặt lại trạng thái tất cả các túi về ban đầu (chưa mở, chưa ẩn)
    giftBags.forEach(bag => {
        bag.classList.remove('open', 'hidden');
        bag.querySelector('.content').style.display = 'none'; // Đảm bảo nội dung ẩn đi
    });

    // Trộn lại các túi mù dựa trên nội dung đã có trong currentGiftContents
    shuffleArray(currentGiftContents); // Trộn lại nội dung

    giftBags.forEach((bag, index) => {
        bag.dataset.actualContent = currentGiftContents[index]; // Gán lại nội dung đã trộn vào dataset
        bag.classList.remove('open', 'hidden'); // Đảm bảo túi đang đóng và không ẩn
        bag.querySelector('.content').style.display = 'none'; // Ẩn nội dung
        // Giữ nguyên trạng thái shuffled và readOnly
        // textarea và label vẫn ẩn
    });

    playAgainBtn.style.display = 'none';
    resetBtn.style.display = 'block'; 
    saveDataBtn.style.display = 'none';
    loadDataBtn.style.display = 'none'; 
});


// Xử lý nút đặt lại
resetBtn.addEventListener('click', () => {
    initializeGiftBags(); // Khởi tạo lại tất cả túi mù
    giftBags.forEach(bag => {
        bag.classList.remove('shuffled', 'open', 'hidden'); // Xóa tất cả trạng thái
        bag.querySelector('textarea').readOnly = false; // Cho phép chỉnh sửa lại
        bag.querySelector('textarea').style.display = 'block'; // Hiện textarea
        bag.querySelector('textarea').value = ''; // Xóa nội dung textarea
        bag.querySelector('span.label').style.display = 'block'; // Hiện label
        bag.querySelector('.content').style.display = 'none'; // Ẩn nội dung đã mở
        bag.dataset.actualContent = ''; // Xóa nội dung đã lưu
    });
    shuffleBtn.disabled = false; // Bật lại nút trộn
    shuffleBtn.style.display = 'block'; // Hiện nút trộn
    playAgainBtn.style.display = 'none'; // Ẩn nút chơi tiếp
    saveDataBtn.style.display = 'block';
    loadDataBtn.style.display = 'block';
});

// Xử lý nút Lưu Dữ Liệu
saveDataBtn.addEventListener('click', () => {
    // Lấy nội dung từ tất cả các textarea (trạng thái chưa trộn)
    const dataToSave = giftBags.map(bag => bag.querySelector('textarea').value); 
    // Lưu vào Local Storage
    localStorage.setItem('mysteryBlindBagData', JSON.stringify(dataToSave));
    alert('Dữ liệu đã được lưu!');
});

// Xử lý nút Tải Dữ Liệu
loadDataBtn.addEventListener('click', () => {
    const savedData = localStorage.getItem('mysteryBlindBagData');
    if (savedData) {
        currentGiftContents = JSON.parse(savedData);
        // Đặt lại trò chơi và gán nội dung đã tải vào các ô textarea
        initializeGiftBags(); // Khởi tạo lại các túi để reset trạng thái
        giftBags.forEach((bag, index) => {
            if (currentGiftContents[index] !== undefined) {
                bag.querySelector('textarea').value = currentGiftContents[index]; 
            }
        });
        alert('Dữ liệu đã được tải!');
    } else {
        alert('Không có dữ liệu nào được lưu!');
    }
});

// Khởi tạo lần đầu khi tải trang
initializeGiftBags();
