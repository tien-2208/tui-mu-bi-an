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
    textarea.style.display = 'block';

    textarea.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const content = document.createElement('div');
    content.classList.add('content');
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

            // 1. Thêm cả class 'open' và 'fading-in' ngay lập tức
            giftBag.classList.add('open', 'fading-in');

            // Ẩn tất cả các túi khác sau một khoảng trễ ngắn
            setTimeout(() => {
                giftBags.forEach(bag => {
                    if (bag !== giftBag) {
                        bag.classList.add('hidden');
                    }
                });

                // 2. Sau khi các túi khác ẩn đi và có một khoảng trễ nhỏ, loại bỏ 'fading-in'
                // Điều này kích hoạt hiệu ứng fade-in từ opacity: 0 lên opacity: 1
                setTimeout(() => {
                    giftBag.classList.remove('fading-in');
                }, 50); // Khoảng trễ rất ngắn để đảm bảo class đã được áp dụng trước đó

            }, 100); // Khoảng trễ 100ms như cũ cho việc ẩn túi

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
    giftData = Array.isArray(data) ? data : [];

    if (giftData.length === 0) {
        for (let i = 0; i < numberOfGiftBags; i++) {
            giftData.push({
                content: '',
                color: (i < 5 ? 'pink' : 'black'), // 5 hồng, 5 đen ban đầu
                originalIndex: i // Lưu số thứ tự ban đầu
            });
        }
    }

    if (giftBags.length === 0) {
        giftContainer.innerHTML = '';
        giftData.forEach((dataItem, i) => {
            const giftBag = createGiftBag(i, dataItem);
            giftBags.push(giftBag);
            giftContainer.appendChild(giftBag);
        });
    } else {
        giftBags.forEach((giftBag, i) => {
            const dataItem = giftData[i];

            giftBag.dataset.actualContent = dataItem.content;
            giftBag.dataset.originalColor = dataItem.color;
            giftBag.dataset.originalIndex = dataItem.originalIndex;

            giftBag.querySelector('textarea').value = dataItem.content;
            giftBag.querySelector('span.label').textContent = `Túi Mù ${dataItem.originalIndex + 1}`;

            giftBag.classList.remove('shuffled-yellow', 'shuffled', 'open', 'hidden', 'fading-in'); // <--- Thêm 'fading-in' vào remove
            giftBag.classList.remove('pink', 'black');
            giftBag.classList.add(dataItem.color);

            giftBag.querySelector('.fa-gift').style.display = 'block';
            giftBag.querySelector('span.label').style.display = 'block';
            giftBag.querySelector('textarea').style.display = 'block';
            giftBag.querySelector('textarea').readOnly = false;
            giftBag.querySelector('.content').style.display = 'none';

            // Đảm bảo không có position: absolute và transform khi không phải trạng thái 'open'
            // Đặt lại các thuộc tính style này về mặc định của CSS
            giftBag.style.position = '';
            giftBag.style.left = '';
            giftBag.style.top = '';
            giftBag.style.transform = ''; // Loại bỏ transform
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
    giftBags.forEach((bag, index) => {
        giftData[index].content = bag.querySelector('textarea').value;
    });

    shuffleArray(giftData);

    giftBags.forEach((bag, index) => {
        const shuffledItem = giftData[index];

        bag.dataset.actualContent = shuffledItem.content;
        bag.dataset.originalColor = shuffledItem.color;
        bag.dataset.originalIndex = shuffledItem.originalIndex;

        bag.classList.add('shuffled', 'shuffled-yellow');
        bag.classList.remove('pink', 'black');
        bag.classList.remove('open', 'hidden', 'fading-in'); // <--- Thêm 'fading-in' vào remove

        bag.querySelector('textarea').readOnly = true;
        bag.querySelector('textarea').style.display = 'none';

        bag.querySelector('.content').style.display = 'none';

        // Đảm bảo không có position: absolute và transform khi không phải trạng thái 'open'
        bag.style.position = '';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.transform = ''; // Loại bỏ transform
        bag.style.zIndex = '';
    });

    shuffleBtn.disabled = true;
    editBtn.style.display = 'none';
});

// Xử lý nút "Chơi Tiếp"
playAgainBtn.addEventListener('click', () => {
    // Ẩn tất cả các túi và reset trạng thái 'open' trước khi trộn lại
    // để đảm bảo túi đang mở được đưa về trạng thái bình thường trước khi bị ẩn.
    giftBags.forEach(bag => {
        bag.classList.remove('open', 'fading-in'); // <--- Thêm 'fading-in' vào remove
        bag.querySelector('.content').style.display = 'none';
        
        // Reset các thuộc tính style khi túi không ở trạng thái 'open'
        bag.style.position = '';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.transform = ''; // Loại bỏ transform
        bag.style.zIndex = '';

        // Sau đó thêm lại class 'shuffled-yellow' và 'shuffled' và 'hidden'
        bag.classList.add('shuffled-yellow', 'shuffled');
        bag.classList.remove('pink', 'black'); // Loại bỏ màu gốc nếu có
    });
    
    // Sau khi reset, ẩn tất cả các túi trước khi trộn để tránh nhấp nháy
    // và đảm bảo túi đã chọn không còn ở giữa màn hình
    giftBags.forEach(bag => {
        bag.classList.add('hidden');
    });

    // Trộn lại mảng dữ liệu (bao gồm nội dung và màu gốc)
    shuffleArray(giftData);

    // Hiển thị lại tất cả các túi và cập nhật dữ liệu sau khi trộn
    setTimeout(() => {
        giftBags.forEach((bag, index) => {
            const shuffledItem = giftData[index];

            bag.dataset.actualContent = shuffledItem.content;
            bag.dataset.originalColor = shuffledItem.color;
            bag.dataset.originalIndex = shuffledItem.originalIndex;

            bag.classList.remove('hidden', 'open', 'fading-in'); // <--- Thêm 'fading-in' vào remove
            bag.querySelector('.content').style.display = 'none';
            
            bag.classList.add('shuffled-yellow');
            bag.classList.remove('pink', 'black');

            // Reset các thuộc tính style
            bag.style.position = '';
            bag.style.left = '';
            bag.style.top = '';
            bag.style.transform = '';
            bag.style.zIndex = '';
        });
    }, 100); // Khoảng trễ nhỏ để hiệu ứng mượt mà hơn

    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block';
    shuffleBtn.disabled = false; // Đảm bảo nút trộn được kích hoạt lại
    shuffleBtn.style.display = 'block';
});

// Xử lý nút "Chỉnh Sửa"
editBtn.addEventListener('click', () => {
    giftData.sort((a, b) => a.originalIndex - b.originalIndex);

    giftBags.forEach((bag, i) => {
        const originalDataItem = giftData[i];

        bag.classList.remove('shuffled', 'open', 'hidden', 'shuffled-yellow', 'fading-in'); // <--- Thêm 'fading-in' vào remove
        bag.classList.remove('pink', 'black');
        bag.classList.add(originalDataItem.color);

        bag.querySelector('textarea').value = originalDataItem.content;
        bag.querySelector('textarea').readOnly = false;
        bag.querySelector('textarea').style.display = 'block';

        bag.querySelector('span.label').textContent = `Túi Mù ${originalDataItem.originalIndex + 1}`;
        bag.querySelector('span.label').style.display = 'block';

        bag.querySelector('.fa-gift').style.display = 'block';

        bag.querySelector('.content').style.display = 'none';

        // Quan trọng: Reset các thuộc tính style đã bị thay đổi bởi trạng thái 'open'
        // để túi quay về vị trí ban đầu trong lưới
        bag.style.transform = '';
        bag.style.position = ''; // Loại bỏ position: absolute
        bag.style.left = '';
        bag.style.top = '';
        bag.style.zIndex = '';
    });

    shuffleBtn.disabled = false;
    shuffleBtn.style.display = 'block';
    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block';
});

// Đảm bảo rằng hàm initializeGiftBags() được gọi sau khi toàn bộ DOM đã được tải.
document.addEventListener('DOMContentLoaded', initializeGiftBags);
