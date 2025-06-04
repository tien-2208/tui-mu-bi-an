const giftContainer = document.getElementById('giftContainer');
const shuffleBtn = document.getElementById('shuffleBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const editBtn = document.getElementById('editBtn'); 

const numberOfGiftBags = 10;
const maxContentLength = 150; // Giới hạn ký tự
let giftBags = []; // Mảng để lưu trữ các phần tử túi mù
let currentGiftContents = []; // Mảng lưu trữ nội dung hiện tại của các túi mù
let originalColors = []; // Mảng lưu trữ màu gốc của từng túi (ví dụ: 'pink' hoặc 'black')

// Hàm tạo túi mù
function createGiftBag(index, initialColorClass) {
    const giftBag = document.createElement('div');
    giftBag.classList.add('gift-bag', initialColorClass); // Gán màu ban đầu
    
    // Lưu màu gốc vào dataset của túi để có thể truy xuất sau này
    giftBag.dataset.originalColor = initialColorClass;

    const giftIcon = document.createElement('i');
    giftIcon.classList.add('fas', 'fa-gift'); 

    const label = document.createElement('span');
    label.classList.add('label');
    label.textContent = `Túi Mù ${index + 1}`;

    const textarea = document.createElement('textarea'); 
    textarea.placeholder = 'Ghi điều ước (tối đa 150 ký tự)...';
    textarea.maxLength = maxContentLength; 
    textarea.addEventListener('click', (event) => {
        event.stopPropagation(); 
    });

    const content = document.createElement('div');
    content.classList.add('content');

    giftBag.appendChild(giftIcon); 
    giftBag.appendChild(label);
    giftBag.appendChild(textarea); 
    giftBag.appendChild(content);

    // Xử lý sự kiện click để mở túi mù
    giftBag.addEventListener('click', () => {
        if (giftBag.classList.contains('shuffled') && !giftBag.classList.contains('open')) {
            // Loại bỏ màu vàng và trả về màu gốc
            giftBag.classList.remove('shuffled-yellow');
            giftBag.classList.add(giftBag.dataset.originalColor);

            // Ẩn tất cả các túi khác và phóng to túi được chọn
            giftBags.forEach(bag => {
                if (bag !== giftBag) {
                    bag.classList.add('hidden');
                }
            });
            giftBag.classList.add('open');
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

// Khởi tạo các túi mù
function initializeGiftBags(contents = [], colors = []) {
    giftContainer.innerHTML = ''; 
    giftBags = [];
    currentGiftContents = contents.length ? contents : Array(numberOfGiftBags).fill(''); 
    
    // Nếu không có màu được truyền vào (lần đầu tải trang hoặc reset), tạo màu mặc định
    if (colors.length === 0) {
        originalColors = Array(numberOfGiftBags).fill('').map((_, i) => (i < 5 ? 'pink' : 'black'));
    } else {
        originalColors = colors;
    }

    for (let i = 0; i < numberOfGiftBags; i++) {
        // Tạo túi với màu gốc từ mảng originalColors
        const giftBag = createGiftBag(i, originalColors[i]);
        giftBags.push(giftBag);
        giftContainer.appendChild(giftBag);
        
        giftBag.querySelector('textarea').value = currentGiftContents[i];
        
        // Đảm bảo icon, label và textarea hiển thị và không có màu vàng
        giftBag.classList.remove('shuffled-yellow', 'shuffled', 'open', 'hidden');
        giftBag.querySelector('.fa-gift').style.display = 'block';
        giftBag.querySelector('span.label').style.display = 'block';
        giftBag.querySelector('textarea').style.display = 'block';
        giftBag.querySelector('.content').style.display = 'none'; 
        giftBag.dataset.actualContent = ''; // Xóa nội dung đã lưu (khi chỉnh sửa)
    }
    
    shuffleBtn.disabled = false;
    shuffleBtn.style.display = 'block';
    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block'; 
}

// Hàm trộn ngẫu nhiên mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

// Xử lý nút trộn
shuffleBtn.addEventListener('click', () => {
    // Cập nhật currentGiftContents từ các textarea trước khi trộn
    giftBags.forEach((bag, index) => {
        currentGiftContents[index] = bag.querySelector('textarea').value; 
    });
    
    // Trộn cả nội dung và màu gốc (quan trọng!)
    shuffleArray(currentGiftContents); 
    shuffleArray(originalColors); // Trộn cả mảng màu gốc

    // Gán nội dung và màu đã trộn vào dataset của từng túi và cập nhật trạng thái
    giftBags.forEach((bag, index) => {
        bag.dataset.actualContent = currentGiftContents[index]; 
        bag.dataset.originalColor = originalColors[index]; // Cập nhật màu gốc đã trộn vào dataset

        bag.classList.add('shuffled', 'shuffled-yellow'); // Thêm class shuffled và shuffled-yellow
        bag.classList.remove('pink', 'black'); // Loại bỏ màu gốc để màu vàng hiển thị
        bag.classList.remove('open', 'hidden'); 
        
        bag.querySelector('textarea').readOnly = true; 
        bag.querySelector('textarea').style.display = 'none'; 

        bag.querySelector('.content').style.display = 'none'; 
    });

    shuffleBtn.disabled = true; 
    editBtn.style.display = 'none'; 
});

// Xử lý nút "Chơi Tiếp"
playAgainBtn.addEventListener('click', () => {
    // Đặt lại trạng thái tất cả các túi về ban đầu (chưa mở, chưa ẩn)
    giftBags.forEach(bag => {
        bag.classList.remove('open', 'hidden');
        bag.querySelector('.content').style.display = 'none'; 
        
        // Đảm bảo túi quay lại màu vàng sau khi chơi tiếp một lượt
        bag.classList.add('shuffled-yellow');
        bag.classList.remove('pink', 'black'); // Loại bỏ màu gốc nếu có
    });

    // Trộn lại các túi mù dựa trên nội dung đã có trong currentGiftContents
    shuffleArray(currentGiftContents); 
    shuffleArray(originalColors); // Trộn lại cả mảng màu gốc

    giftBags.forEach((bag, index) => {
        bag.dataset.actualContent = currentGiftContents[index]; 
        bag.dataset.originalColor = originalColors[index]; // Cập nhật màu gốc đã trộn

        bag.classList.remove('open', 'hidden'); 
        bag.querySelector('.content').style.display = 'none'; 
    });

    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block'; 
});

// Xử lý nút "Chỉnh Sửa"
editBtn.addEventListener('click', () => {
    const currentInputs = giftBags.map(bag => bag.querySelector('textarea').value);
    
    // Khi chỉnh sửa, khởi tạo lại túi với nội dung và màu gốc hiện tại (sau khi đã trộn)
    // Điều này đảm bảo màu được lưu trong originalColors vẫn là màu sau khi trộn.
    initializeGiftBags(currentInputs, originalColors); 

    giftBags.forEach(bag => {
        bag.classList.remove('shuffled', 'open', 'hidden', 'shuffled-yellow'); // Xóa tất cả trạng thái
        bag.classList.add(bag.dataset.originalColor); // Đảm bảo túi về màu gốc ban đầu
        bag.querySelector('textarea').readOnly = false; 
        bag.querySelector('textarea').style.display = 'block'; 
        bag.querySelector('span.label').style.display = 'block'; 
        bag.querySelector('.fa-gift').style.display = 'block'; 
        bag.querySelector('.content').style.display = 'none'; 
        // Không xóa dataset.actualContent hay dataset.originalColor ở đây
        // vì chúng ta đang muốn giữ lại dữ liệu để chỉnh sửa
    });
    
    shuffleBtn.disabled = false; 
    shuffleBtn.style.display = 'block'; 
    playAgainBtn.style.display = 'none'; 
    editBtn.style.display = 'block'; 
});

// Đảm bảo rằng hàm initializeGiftBags() được gọi sau khi toàn bộ DOM đã được tải.
document.addEventListener('DOMContentLoaded', initializeGiftBags);
