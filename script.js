const giftContainer = document.getElementById('giftContainer');
const shuffleBtn = document.getElementById('shuffleBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const editBtn = document.getElementById('editBtn'); 

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

    // Tạo icon túi quà
    const giftIcon = document.createElement('i');
    giftIcon.classList.add('fas', 'fa-gift'); // Biểu tượng túi quà từ Font Awesome

    const label = document.createElement('span');
    label.classList.add('label');
    label.textContent = `Túi Mù ${index + 1}`;

    const textarea = document.createElement('textarea'); 
    textarea.placeholder = 'Ghi điều ước (tối đa 150 ký tự)...';
    textarea.maxLength = maxContentLength; // Giới hạn ký tự
    textarea.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên giftBag
    });

    const content = document.createElement('div');
    content.classList.add('content');

    giftBag.appendChild(giftIcon); // Thêm icon vào túi
    giftBag.appendChild(label);
    giftBag.appendChild(textarea); 
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
            content.style.display = 'flex'; 

            playAgainBtn.style.display = 'block';
            shuffleBtn.style.display = 'none';
            editBtn.style.display = 'none'; 
        } else if (!giftBag.classList.contains('shuffled')) {
            alert('Hãy trộn túi mù trước khi mở!');
        }
    });

    return giftBag;
}

// Khởi tạo các túi mù (chỉ gọi khi cần reset hoàn toàn)
function initializeGiftBags(contents = []) {
    giftContainer.innerHTML = ''; // Xóa các túi mù cũ
    giftBags = [];
    currentGiftContents = contents.length ? contents : Array(numberOfGiftBags).fill(''); 

    for (let i = 0; i < numberOfGiftBags; i++) {
        const giftBag = createGiftBag(i);
        giftBags.push(giftBag);
        giftContainer.appendChild(giftBag);
        // Gán nội dung đã có (nếu có) vào textarea
        giftBag.querySelector('textarea').value = currentGiftContents[i];
        
        // Đảm bảo icon, label và textarea hiển thị khi khởi tạo hoặc chỉnh sửa
        giftBag.querySelector('.fa-gift').style.display = 'block';
        giftBag.querySelector('span.label').style.display = 'block';
        giftBag.querySelector('textarea').style.display = 'block';
        giftBag.querySelector('.content').style.display = 'none'; // Ẩn nội dung đã mở
    }
    // Thiết lập trạng thái ban đầu của các nút
    shuffleBtn.disabled = false;
    shuffleBtn.style.display = 'block';
    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block'; 
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

        // Icon và label sẽ được CSS ẩn đi nhờ class .shuffled
        bag.querySelector('.content').style.display = 'none'; // Ẩn nội dung đã mở
    });

    shuffleBtn.disabled = true; // Vô hiệu hóa nút trộn sau khi đã trộn
    editBtn.style.display = 'none'; // Ẩn nút "Chỉnh Sửa" khi đã trộn
});

// Xử lý nút "Chơi Tiếp"
playAgainBtn.addEventListener('click', () => {
    // Đặt lại trạng thái tất cả các túi về ban đầu (chưa mở, chưa ẩn)
    giftBags.forEach(bag => {
        bag.classList.remove('open', 'hidden');
        bag.querySelector('.content').style.display = 'none'; // Đảm bảo nội dung ẩn đi

        // Hiện lại icon và label sau khi chơi xong 1 lượt để có thể chơi tiếp hoặc chỉnh sửa
        bag.querySelector('.fa-gift').style.display = 'block'; // Hiển thị icon
        bag.querySelector('span.label').style.display = 'block'; // Hiển thị label
    });

    // Trộn lại các túi mù dựa trên nội dung đã có trong currentGiftContents
    shuffleArray(currentGiftContents); // Trộn lại nội dung

    giftBags.forEach((bag, index) => {
        bag.dataset.actualContent = currentGiftContents[index]; // Gán lại nội dung đã trộn vào dataset
        bag.classList.remove('open', 'hidden'); // Đảm bảo túi đang đóng và không ẩn
        bag.querySelector('.content').style.display = 'none'; // Ẩn nội dung
    });

    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block'; 
});

// Xử lý nút "Chỉnh Sửa"
editBtn.addEventListener('click', () => {
    // Thu thập nội dung hiện tại từ các textarea trước khi chỉnh sửa
    const currentInputs = giftBags.map(bag => bag.querySelector('textarea').value);
    
    // Khởi tạo lại các túi, truyền vào nội dung đã có
    initializeGiftBags(currentInputs); 

    // Đảm bảo tất cả các túi quay về trạng thái nhập liệu
    giftBags.forEach(bag => {
        bag.classList.remove('shuffled', 'open', 'hidden'); // Xóa tất cả trạng thái
        bag.querySelector('textarea').readOnly = false; // Cho phép chỉnh sửa
        bag.querySelector('textarea').style.display = 'block'; // Hiện textarea
        bag.querySelector('span.label').style.display = 'block'; // Hiện label
        bag.querySelector('.fa-gift').style.display = 'block'; // Hiện icon
        bag.querySelector('.content').style.display = 'none'; // Ẩn nội dung đã mở
        bag.dataset.actualContent = ''; // Xóa nội dung đã lưu (vì đang chỉnh sửa)
    });
    
    shuffleBtn.disabled = false; // Bật lại nút trộn
    shuffleBtn.style.display = 'block'; // Hiện nút trộn
    playAgainBtn.style.display = 'none'; // Ẩn nút chơi tiếp
    editBtn.style.display = 'block'; // Đảm bảo nút "Chỉnh Sửa" vẫn hiển thị
});

// Đảm bảo rằng hàm initializeGiftBags() được gọi sau khi toàn bộ DOM đã được tải.
document.addEventListener('DOMContentLoaded', initializeGiftBags);
