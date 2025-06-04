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

// Khởi tạo hoặc cập nhật các túi mù
function initializeGiftBags(data = []) {
    // Đảm bảo giftData là một mảng. Nếu không phải, gán một mảng rỗng.
    giftData = Array.isArray(data) ? data : [];

    // Nếu giftData rỗng, tạo dữ liệu mặc định
    if (giftData.length === 0) {
        for (let i = 0; i < numberOfGiftBags; i++) {
            giftData.push({
                content: '',
                color: (i < 5 ? 'pink' : 'black'), // 5 hồng, 5 đen ban đầu
                originalIndex: i // Lưu số thứ tự ban đầu
            });
        }
    }

    // Nếu các túi đã được tạo, không xóa mà chỉ cập nhật lại chúng.
    // Nếu chưa có túi nào (lần đầu tải trang), tạo mới.
    if (giftBags.length === 0) {
        giftContainer.innerHTML = ''; // Chỉ xóa khi không có túi nào để tránh nhấp nháy
        giftData.forEach((dataItem, i) => {
            const giftBag = createGiftBag(i, dataItem);
            giftBags.push(giftBag);
            giftContainer.appendChild(giftBag);
        });
    } else {
        // Cập nhật nội dung và trạng thái của các túi hiện có
        giftBags.forEach((giftBag, i) => {
            const dataItem = giftData[i]; // Lấy dữ liệu theo thứ tự ban đầu
            
            // Cập nhật data-set
            giftBag.dataset.actualContent = dataItem.content;
            giftBag.dataset.originalColor = dataItem.color;
            giftBag.dataset.originalIndex = dataItem.originalIndex;

            // Cập nhật textarea và label
            giftBag.querySelector('textarea').value = dataItem.content;
            giftBag.querySelector('span.label').textContent = `Túi Mù ${dataItem.originalIndex + 1}`;

            // Reset các class và style
            giftBag.classList.remove('shuffled-yellow', 'shuffled', 'open', 'hidden');
            // Xóa tất cả các class màu cũ trước khi thêm màu mới
            giftBag.classList.remove('pink', 'black'); // Đảm bảo xóa màu cũ
            giftBag.classList.add(dataItem.color);

            // Đảm bảo các phần tử con hiển thị/ẩn đúng trạng thái chỉnh sửa
            giftBag.querySelector('.fa-gift').style.display = 'block';
            giftBag.querySelector('span.label').style.display = 'block';
            giftBag.querySelector('textarea').style.display = 'block';
            giftBag.querySelector('textarea').readOnly = false; // Có thể chỉnh sửa
            giftBag.querySelector('.content').style.display = 'none';
            
            // Đặt lại vị trí transform
            giftBag.style.transform = ''; // Xóa bất kỳ transform nào đang áp dụng
            giftBag.style.position = 'relative'; // Quay về vị trí bình thường
            giftBag.style.left = '';
            giftBag.style.top = '';
            giftBag.style.zIndex = '';
            
        });
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
    // Cập nhật nội dung từ các textarea vào giftData trước khi trộn
    giftBags.forEach((bag, index) => {
        // Cập nhật content của item tương ứng trong giftData (quan trọng!)
        // Lấy nội dung từ textarea của túi hiện tại và gán vào giftData
        giftData[index].content = bag.querySelector('textarea').value; 
    });
    
    // Trộn toàn bộ mảng dữ liệu (bao gồm content, color, originalIndex)
    shuffleArray(giftData); 

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
        
        // Đặt lại vị trí và transform để chúng có thể di chuyển nếu đang bị "mở"
        bag.style.transform = '';
        bag.style.position = 'relative';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.zIndex = '';
    });

    shuffleBtn.disabled = true;
    editBtn.style.display = 'none';
});

// Xử lý nút "Chơi Tiếp"
playAgainBtn.addEventListener('click', () => {
    // Đặt lại trạng thái tất cả các túi về ban đầu (chưa mở, chưa ẩn)
    // Và hiển thị lại tất cả các túi
    giftBags.forEach(bag => {
        bag.classList.remove('open', 'hidden');
        bag.querySelector('.content').style.display = 'none';

        // Đảm bảo túi quay lại màu vàng sau khi chơi tiếp một lượt
        bag.classList.add('shuffled-yellow');
        bag.classList.remove('pink', 'black'); // Loại bỏ màu gốc nếu có
        
        // Đặt lại vị trí và transform để chúng quay về lưới
        bag.style.transform = '';
        bag.style.position = 'relative';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.zIndex = '';
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
    // Khi chỉnh sửa, không cần gọi initializeGiftBags(giftData) nữa.
    // Thay vào đó, chúng ta sẽ lặp qua các túi hiện có và reset chúng.
    
    // Đảm bảo dữ liệu trong giftData là đúng thứ tự ban đầu để hiển thị chính xác
    // Sắp xếp lại giftData theo originalIndex
    giftData.sort((a, b) => a.originalIndex - b.originalIndex);

    giftBags.forEach((bag, i) => {
        // Lấy dữ liệu gốc từ giftData đã sắp xếp
        const originalDataItem = giftData[i];

        bag.classList.remove('shuffled', 'open', 'hidden', 'shuffled-yellow');
        // Xóa tất cả các class màu cũ trước khi thêm màu mới
        bag.classList.remove('pink', 'black'); // Đảm bảo xóa màu cũ
        bag.classList.add(originalDataItem.color); // Đảm bảo túi về màu gốc ban đầu

        // Cập nhật nội dung textarea
        bag.querySelector('textarea').value = originalDataItem.content;
        bag.querySelector('textarea').readOnly = false;
        bag.querySelector('textarea').style.display = 'block'; // Hiển thị textarea khi chỉnh sửa

        // Cập nhật label
        bag.querySelector('span.label').textContent = `Túi Mù ${originalDataItem.originalIndex + 1}`;
        bag.querySelector('span.label').style.display = 'block';

        // Đảm bảo icon hiển thị
        bag.querySelector('.fa-gift').style.display = 'block';
        
        // Ẩn nội dung đã mở
        bag.querySelector('.content').style.display = 'none';
        
        // Quan trọng: Reset các thuộc tính style đã bị thay đổi bởi trạng thái 'open'
        bag.style.transform = ''; // Xóa transform (scale, translate)
        bag.style.position = 'relative'; // Quay về vị trí bình thường
        bag.style.left = ''; // Xóa left
        bag.style.top = ''; // Xóa top
        bag.style.zIndex = ''; // Xóa z-index
    });
    
    // Đảm bảo hiển thị đúng nút điều khiển
    shuffleBtn.disabled = false;
    shuffleBtn.style.display = 'block';
    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block';
});

// Đảm bảo rằng hàm initializeGiftBags() được gọi sau khi toàn bộ DOM đã được tải.
document.addEventListener('DOMContentLoaded', initializeGiftBags);
