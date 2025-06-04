const giftContainer = document.getElementById('giftContainer');
const shuffleBtn = document.getElementById('shuffleBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const resetBtn = document.getElementById('resetBtn');
const numberOfGiftBags = 10;
const maxContentLength = 150; // Giới hạn ký tự
let giftBags = []; // Mảng để lưu trữ các phần tử túi quà
let currentGiftContents = []; // Mảng lưu trữ nội dung hiện tại của các túi

// Hàm tạo túi quà
function createGiftBag(index) {
    const giftBag = document.createElement('div');
    giftBag.classList.add('gift-bag');
    // Gán màu sắc xen kẽ
    if (index % 2 === 0) {
        giftBag.classList.add('pink');
    } else {
        giftBag.classList.add('black');
    }

    const label = document.createElement('span');
    label.classList.add('label');
    label.textContent = `Túi Quà ${index + 1}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ghi điều ước (tối đa 150 ký tự)...';
    input.maxLength = maxContentLength; // Giới hạn ký tự
    input.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên giftBag
    });

    const content = document.createElement('div');
    content.classList.add('content');

    giftBag.appendChild(label);
    giftBag.appendChild(input);
    giftBag.appendChild(content);

    // Xử lý sự kiện click để mở túi quà
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
            content.textContent = giftBag.dataset.actualContent || 'Trống không!'; // Lấy nội dung từ dataset

            // Hiển thị nút "Chơi Tiếp"
            playAgainBtn.style.display = 'block';
            shuffleBtn.style.display = 'none'; // Ẩn nút trộn
            resetBtn.style.display = 'none'; // Ẩn nút đặt lại
        } else if (!giftBag.classList.contains('shuffled')) {
            alert('Hãy trộn túi quà trước khi mở!');
        }
    });

    return giftBag;
}

// Khởi tạo các túi quà
function initializeGiftBags() {
    giftContainer.innerHTML = ''; // Xóa các túi quà cũ
    giftBags = [];
    currentGiftContents = []; // Reset nội dung
    for (let i = 0; i < numberOfGiftBags; i++) {
        const giftBag = createGiftBag(i);
        giftBags.push(giftBag);
        giftContainer.appendChild(giftBag);
        // Khởi tạo nội dung trống cho mỗi túi
        currentGiftContents.push('');
    }
    shuffleBtn.disabled = false; // Bật nút trộn
    shuffleBtn.style.display = 'block';
    playAgainBtn.style.display = 'none'; // Ẩn nút chơi tiếp
    resetBtn.style.display = 'block'; // Hiện nút đặt lại
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
    // Cập nhật currentGiftContents từ các input trước khi trộn
    giftBags.forEach((bag, index) => {
        currentGiftContents[index] = bag.querySelector('input[type="text"]').value;
    });
    
    shuffleArray(currentGiftContents); // Trộn ngẫu nhiên nội dung

    // Gán nội dung đã trộn vào dataset của từng túi và cập nhật trạng thái
    giftBags.forEach((bag, index) => {
        bag.dataset.actualContent = currentGiftContents[index]; // Lưu nội dung đã trộn vào dataset
        bag.classList.add('shuffled'); // Đánh dấu túi đã được trộn
        bag.classList.remove('open', 'hidden'); // Đảm bảo túi đang đóng và không bị ẩn
        bag.querySelector('input[type="text"]').readOnly = true; // Khóa input
        bag.querySelector('input[type="text"]').style.display = 'none'; // Ẩn input
        bag.querySelector('span.label').style.display = 'none'; // Ẩn label

        // Đảm bảo nội dung chữ bên trong cũng bị ẩn
        bag.querySelector('.content').style.display = 'none';
    });

    shuffleBtn.disabled = true; // Vô hiệu hóa nút trộn sau khi đã trộn
});

// Xử lý nút "Chơi Tiếp"
playAgainBtn.addEventListener('click', () => {
    // Đặt lại trạng thái tất cả các túi về ban đầu (chưa mở, chưa ẩn)
    giftBags.forEach(bag => {
        bag.classList.remove('open', 'hidden');
        bag.querySelector('.content').style.display = 'none'; // Đảm bảo nội dung ẩn đi
    });

    // Trộn lại các túi quà dựa trên nội dung đã có trong currentGiftContents
    // Không cần lấy lại từ input vì input đã bị khóa
    shuffleArray(currentGiftContents); // Trộn lại nội dung

    giftBags.forEach((bag, index) => {
        bag.dataset.actualContent = currentGiftContents[index]; // Gán lại nội dung đã trộn vào dataset
        bag.classList.remove('open', 'hidden'); // Đảm bảo túi đang đóng và không ẩn
        bag.querySelector('.content').style.display = 'none'; // Ẩn nội dung

        // Giữ nguyên trạng thái shuffled và readOnly
        // input và label vẫn ẩn
    });

    playAgainBtn.style.display = 'none'; // Ẩn nút "Chơi Tiếp"
    shuffleBtn.style.display = 'none'; // Nút trộn vẫn ẩn (chỉ có thể chơi tiếp hoặc reset)
    resetBtn.style.display = 'block'; // Hiện nút đặt lại
});


// Xử lý nút đặt lại
resetBtn.addEventListener('click', () => {
    initializeGiftBags(); // Khởi tạo lại tất cả túi quà
    giftBags.forEach(bag => {
        bag.classList.remove('shuffled', 'open', 'hidden'); // Xóa tất cả trạng thái
        bag.querySelector('input[type="text"]').readOnly = false; // Cho phép chỉnh sửa lại
        bag.querySelector('input[type="text"]').style.display = 'block'; // Hiện input
        bag.querySelector('input[type="text"]').value = ''; // Xóa nội dung input
        bag.querySelector('span.label').style.display = 'block'; // Hiện label
        bag.querySelector('.content').style.display = 'none'; // Ẩn nội dung đã mở
        bag.dataset.actualContent = ''; // Xóa nội dung đã lưu
    });
    shuffleBtn.disabled = false; // Bật lại nút trộn
    shuffleBtn.style.display = 'block'; // Hiện nút trộn
    playAgainBtn.style.display = 'none'; // Ẩn nút chơi tiếp
});

// Khởi tạo lần đầu khi tải trang
initializeGiftBags();
