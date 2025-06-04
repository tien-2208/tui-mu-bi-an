const giftContainer = document.getElementById('giftContainer');
const shuffleBtn = document.getElementById('shuffleBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const editBtn = document.getElementById('editBtn'); 

const numberOfGiftBags = 10;
const maxContentLength = 150; // Giới hạn ký tự

// Mảng để lưu trữ toàn bộ dữ liệu của các túi: nội dung, màu gốc, và số thứ tự ban đầu
let giftData = []; 
let giftBags = []; // Mảng lưu trữ các phần tử DOM của túi mù

// Hàm tạo túi mù
function createGiftBag(index, initialData) { 
    const giftBag = document.createElement('div');
    giftBag.classList.add('gift-bag');
    
    // Gán màu ban đầu
    giftBag.classList.add(initialData.color); 
    
    // Lưu toàn bộ dữ liệu vào dataset để dễ dàng truy xuất sau này
    giftBag.dataset.actualContent = initialData.content;
    giftBag.dataset.originalColor = initialData.color;
    giftBag.dataset.originalIndex = initialData.originalIndex; // Lưu số thứ tự ban đầu

    const giftIcon = document.createElement('i');
    giftIcon.classList.add('fas', 'fa-gift'); 

    const label = document.createElement('span');
    label.classList.add('label');
    // Hiển thị số thứ tự gốc của túi
    label.textContent = `Túi Mù ${initialData.originalIndex + 1}`; 

    const textarea = document.createElement('textarea'); 
    textarea.placeholder = 'Ghi điều ước (tối đa 150 ký tự)...';
    textarea.maxLength = maxContentLength; 
    textarea.value = initialData.content; // Đặt giá trị ban đầu cho textarea
    // Đảm bảo textarea hiển thị khi mới khởi tạo
    textarea.style.display = 'block'; 

    textarea.addEventListener('click', (event) => {
        event.stopPropagation(); 
    });

    const content = document.createElement('div');
    content.classList.add('content');
    // Đảm bảo nội dung ẩn khi mới khởi tạo
    content.style.display = 'none'; 

    giftBag.appendChild(giftIcon); 
    giftBag.appendChild(label);
    giftBag.appendChild(textarea); 
    giftBag.appendChild(content);

    // Xử lý sự kiện click để mở túi mù
    giftBag.addEventListener('click', () => {
        if (giftBag.classList.contains('shuffled') && !giftBag.classList.contains('open')) {
            // Loại bỏ màu vàng và trả về màu gốc
            giftBag.classList.remove('shuffled-yellow');
            giftBag.classList.add(giftBag.dataset.originalColor); // Lấy màu gốc từ dataset

            // Ẩn tất cả các túi khác và phóng to túi được chọn
            giftBags.forEach(bag => {
                if (bag !== giftBag) {
                    bag.classList.add('hidden');
                }
            });
            giftBag.classList.add('open');
            content.textContent = giftBag.dataset.actualContent || 'Trống không!'; 
            content.style.display = 'flex'; // Hiển thị nội dung khi mở

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
function initializeGiftBags(data = []) {
    giftContainer.innerHTML = ''; 
    giftBags = [];
    
    // Nếu không có dữ liệu được truyền vào (lần đầu tải trang hoặc reset hoàn toàn), tạo dữ liệu mặc định
    if (data.length === 0) {
        giftData = [];
        for (let i = 0; i < numberOfGiftBags; i++) {
            giftData.push({
                content: '',
                color: (i < 5 ? 'pink' : 'black'), // 5 hồng, 5 đen ban đầu
                originalIndex: i // Lưu số thứ tự ban đầu
            });
        }
    } else {
        giftData = data; // Sử dụng dữ liệu đã có (khi chỉnh sửa)
    }

    // Tạo các phần tử DOM cho túi mù từ giftData
    giftData.forEach((dataItem, i) => {
        const giftBag = createGiftBag(i, dataItem);
        giftBags.push(giftBag);
        giftContainer.appendChild(giftBag);
        
        // Đảm bảo túi có màu gốc chính xác khi khởi tạo hoặc chỉnh sửa
        giftBag.classList.remove('shuffled-yellow', 'shuffled', 'open', 'hidden');
        giftBag.classList.add(dataItem.color); 
        
        // Đảm bảo icon, label và textarea hiển thị và không có màu vàng
        giftBag.querySelector('.fa-gift').style.display = 'block';
        giftBag.querySelector('span.label').style.display = 'block';
        giftBag.querySelector('textarea').style.display = 'block';
        giftBag.querySelector('.content').style.display = 'none'; 
    });
    
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
    // Cập nhật nội dung từ các textarea vào giftData trước khi trộn
    giftBags.forEach((bag, index) => {
        // Cập nhật content của item tương ứng trong giftData (quan trọng!)
        giftData[index].content = bag.querySelector('textarea').value; 
    });
    
    shuffleArray(giftData); // Trộn toàn bộ mảng dữ liệu (bao gồm content, color, originalIndex)

    // Cập nhật lại các túi mù dựa trên dữ liệu đã trộn
    giftBags.forEach((bag, index) => {
        const shuffledItem = giftData[index]; 

        // Cập nhật dataset của túi DOM
        bag.dataset.actualContent = shuffledItem.content; 
        bag.dataset.originalColor = shuffledItem.color; 
        bag.dataset.originalIndex = shuffledItem.originalIndex; 

        // Thay đổi màu sắc và trạng thái hiển thị
        bag.classList.add('shuffled', 'shuffled-yellow'); 
        bag.classList.remove('pink', 'black'); // Loại bỏ màu gốc để màu vàng hiển thị
        bag.classList.remove('open', 'hidden'); 
        
        bag.querySelector('textarea').readOnly = true; 
        bag.querySelector('textarea').style.display = 'none'; // Ẩn textarea khi trộn

        bag.querySelector('.content').style.display = 'none'; // Đảm bảo nội dung ẩn khi trộn
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

    // Trộn lại mảng dữ liệu (bao gồm nội dung và màu gốc)
    shuffleArray(giftData); 

    // Cập nhật lại các túi mù dựa trên dữ liệu đã trộn
    giftBags.forEach((bag, index) => {
        const shuffledItem = giftData[index];

        bag.dataset.actualContent = shuffledItem.content; 
        bag.dataset.originalColor = shuffledItem.color; 
        bag.dataset.originalIndex = shuffledItem.originalIndex; 

        bag.classList.remove('open', 'hidden'); 
        bag.querySelector('.content').style.display = 'none'; 
    });

    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block'; 
});

// Xử lý nút "Chỉnh Sửa"
editBtn.addEventListener('click', () => {
    // Khi chỉnh sửa, chúng ta sử dụng lại mảng giftData hiện tại để khôi phục trạng thái
    initializeGiftBags(giftData); 

    giftBags.forEach(bag => {
        bag.classList.remove('shuffled', 'open', 'hidden', 'shuffled-yellow'); 
        bag.classList.add(bag.dataset.originalColor); // Đảm bảo túi về màu gốc ban đầu
        bag.querySelector('textarea').readOnly = false; 
        bag.querySelector('textarea').style.display = 'block'; // Hiển thị textarea khi chỉnh sửa
        bag.querySelector('span.label').style.display = 'block'; 
        bag.querySelector('.fa-gift').style.display = 'block'; 
        bag.querySelector('.content').style.display = 'none'; 
    });
    
    shuffleBtn.disabled = false; 
    shuffleBtn.style.display = 'block'; 
    playAgainBtn.style.display = 'none'; 
    editBtn.style.display = 'block'; 
});

// Đảm bảo rằng hàm initializeGiftBags() được gọi sau khi toàn bộ DOM đã được tải.
document.addEventListener('DOMContentLoaded', initializeGiftBags);
