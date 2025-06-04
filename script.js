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
    giftBag.dataset.originalIndex = initialData.originalIndex; // Lưu số thứ tự ban đầu (cố định)

    const giftIcon = document.createElement('i'); // Vẫn giữ phần tử icon trong HTML/JS nhưng sẽ ẩn bằng CSS
    giftIcon.classList.add('fas', 'fa-gift');

    const label = document.createElement('span');
    label.classList.add('label');
    // Hiển thị số thứ tự gốc của túi
    label.textContent = `${initialData.originalIndex + 1}`; // Chỉ hiển thị số, không có chữ "Túi Mù"

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Ghi điều ước (tối đa 150 ký tự)...';
    textarea.maxLength = maxContentLength;
    textarea.value = initialData.content; // Đặt giá trị ban đầu cho textarea
    textarea.style.display = 'block';

    textarea.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn sự kiện click lan ra túi mù
    });

    textarea.addEventListener('focus', () => {
        // Khi textarea được focus, ẩn label
        label.style.display = 'none';
    });

    textarea.addEventListener('blur', () => {
        // Khi textarea mất focus, nếu không ở trạng thái shuffled, hiển thị lại label
        if (!giftBag.classList.contains('shuffled')) {
            label.style.display = 'flex'; // Dùng flex để CSS có thể căn giữa
        }
    });

    const content = document.createElement('div');
    content.classList.add('content');
    content.style.display = 'none';

    giftBag.appendChild(giftIcon); // Icon vẫn được thêm vào DOM nhưng bị ẩn bằng CSS
    giftBag.appendChild(label);
    giftBag.appendChild(textarea);
    giftBag.appendChild(content);

    // Xử lý sự kiện click để mở túi mù
    giftBag.addEventListener('click', () => {
        if (giftBag.classList.contains('shuffled') && !giftBag.classList.contains('open')) {
            // Loại bỏ màu vàng và trả về màu gốc
            giftBag.classList.remove('shuffled-yellow');
            giftBag.classList.add(giftBag.dataset.originalColor); // Lấy màu gốc từ dataset

            // Thêm class 'open' cho túi được chọn
            giftBag.classList.add('open');

            // Đảm bảo label và textarea ẩn khi túi mở
            label.style.display = 'none';
            textarea.style.display = 'none';

            // Ẩn tất cả các túi khác sau một khoảng trễ ngắn
            setTimeout(() => {
                giftBags.forEach(bag => {
                    if (bag !== giftBag) {
                        bag.classList.add('hidden');
                    }
                });
            }, 100); // Khoảng trễ 100ms

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
            // Cập nhật lại text content cho label (số thứ tự gốc)
            giftBag.querySelector('span.label').textContent = `${dataItem.originalIndex + 1}`;

            giftBag.classList.remove('shuffled-yellow', 'shuffled', 'open', 'hidden');
            giftBag.classList.remove('pink', 'black');
            giftBag.classList.add(dataItem.color);

            giftBag.querySelector('span.label').style.display = 'flex'; // Đảm bảo label hiển thị khi chưa trộn
            giftBag.querySelector('textarea').style.display = 'block';
            giftBag.querySelector('textarea').readOnly = false;
            giftBag.querySelector('.content').style.display = 'none';

            // Đảm bảo không có position: absolute và transform khi không phải trạng thái 'open'
            giftBag.style.position = '';
            giftBag.style.left = '';
            giftBag.style.top = '';
            giftBag.style.transform = '';
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

    shuffleArray(giftData); // Trộn dữ liệu túi

    giftBags.forEach((bag, index) => {
        const shuffledItem = giftData[index];

        bag.dataset.actualContent = shuffledItem.content;
        // Màu gốc và số thứ tự gốc không thay đổi khi trộn
        // bag.dataset.originalColor = shuffledItem.color; // Giữ nguyên màu gốc cho mỗi vị trí túi
        // bag.dataset.originalIndex = shuffledItem.originalIndex; // Giữ nguyên số thứ tự gốc cho mỗi vị trí túi

        bag.classList.add('shuffled', 'shuffled-yellow');
        bag.classList.remove('pink', 'black'); // Loại bỏ màu cũ
        bag.classList.add(bag.dataset.originalColor); // Áp dụng màu gốc cho túi tại vị trí này

        bag.classList.remove('open', 'hidden');

        bag.querySelector('textarea').readOnly = true;
        bag.querySelector('textarea').style.display = 'none'; // Ẩn textarea
        bag.querySelector('span.label').style.display = 'flex'; // Hiển thị số thứ tự (label) khi đã trộn

        bag.querySelector('.content').style.display = 'none';

        // Đảm bảo không có position: absolute và transform khi không phải trạng thái 'open'
        bag.style.position = '';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.transform = '';
        bag.style.zIndex = '';
    });

    shuffleBtn.disabled = true;
    editBtn.style.display = 'none';
});

// Xử lý nút "Chơi Tiếp"
playAgainBtn.addEventListener('click', () => {
    // Ẩn tất cả các túi và reset trạng thái 'open' trước khi trộn lại
    giftBags.forEach(bag => {
        bag.classList.remove('open');
        bag.querySelector('.content').style.display = 'none';
        
        bag.style.position = '';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.transform = '';
        bag.style.zIndex = '';

        bag.classList.add('shuffled-yellow', 'shuffled');
        bag.classList.remove('pink', 'black');
    });
    
    // Sau khi reset, ẩn tất cả các túi trước khi trộn để tránh nhấp nháy
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
            // Màu gốc và số thứ tự gốc không thay đổi khi chơi tiếp
            // bag.dataset.originalColor = shuffledItem.color;
            // bag.dataset.originalIndex = shuffledItem.originalIndex;

            bag.classList.remove('hidden', 'open');
            bag.querySelector('.content').style.display = 'none';
            
            bag.classList.add('shuffled-yellow');
            bag.classList.remove('pink', 'black');
            bag.classList.add(bag.dataset.originalColor); // Áp dụng màu gốc cho túi tại vị trí này

            bag.querySelector('span.label').style.display = 'flex'; // Đảm bảo label hiển thị

            bag.style.position = '';
            bag.style.left = '';
            bag.style.top = '';
            bag.style.transform = '';
            bag.style.zIndex = '';
        });
    }, 100);

    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'block';
    shuffleBtn.disabled = false;
    shuffleBtn.style.display = 'block';
});

// Xử lý nút "Chỉnh Sửa"
editBtn.addEventListener('click', () => {
    giftData.sort((a, b) => a.originalIndex - b.originalIndex); // Sắp xếp lại theo originalIndex

    giftBags.forEach((bag, i) => {
        const originalDataItem = giftData[i];

        bag.classList.remove('shuffled', 'open', 'hidden', 'shuffled-yellow');
        bag.classList.remove('pink', 'black');
        bag.classList.add(originalDataItem.color); // Đặt lại màu gốc

        bag.querySelector('textarea').value = originalDataItem.content;
        bag.querySelector('textarea').readOnly = false;
        bag.querySelector('textarea').style.display = 'block';

        bag.querySelector('span.label').textContent = `${originalDataItem.originalIndex + 1}`; // Cập nhật lại số thứ tự
        bag.querySelector('span.label').style.display = 'flex'; // Đảm bảo label hiển thị khi chỉnh sửa

        bag.querySelector('.content').style.display = 'none';

        bag.style.transform = '';
        bag.style.position = '';
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
