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

    const label = document.createElement('span');
    label.classList.add('label');
    label.textContent = `${initialData.originalIndex + 1}`;

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Ghi điều ước (tối đa 150 ký tự)...';
    textarea.maxLength = maxContentLength;
    textarea.value = initialData.content;

    textarea.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên giftBag
    });
    textarea.addEventListener('input', () => {
        // Cập nhật content vào giftData ngay khi người dùng gõ
        const bagIndex = parseInt(giftBag.dataset.originalIndex);
        if (giftData[bagIndex]) {
            giftData[bagIndex].content = textarea.value;
        }
    });

    const content = document.createElement('div');
    content.classList.add('content');
    // content.style.display = 'none'; // Đã xóa - CSS sẽ quản lý display

    giftBag.appendChild(label);
    giftBag.appendChild(textarea);
    giftBag.appendChild(content);

    // Xử lý sự kiện click để mở túi mù
    giftBag.addEventListener('click', () => {
        if (giftBag.classList.contains('shuffled') && !giftBag.classList.contains('open')) {
            // Loại bỏ màu vàng và trả về màu gốc (lấy từ originalColor)
            giftBag.classList.remove('shuffled-yellow');
            giftBag.classList.remove('pink', 'black'); // Loại bỏ cả hai màu cũ
            giftBag.classList.add(giftBag.dataset.originalColor);

            // Thêm class 'open' cho túi được chọn
            giftBag.classList.add('open');

            // Ẩn tất cả các túi khác (sử dụng hidden class để CSS xử lý)
            giftBags.forEach(bag => {
                if (bag !== giftBag) {
                    bag.classList.add('hidden');
                }
            });

            // Hiển thị nội dung
            content.textContent = giftBag.dataset.actualContent || 'Trống không!';
            // content.style.display = 'flex'; // Đã xóa - CSS sẽ quản lý display

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

    // Nếu giftBags chưa được tạo, tạo mới
    if (giftBags.length === 0) {
        giftContainer.innerHTML = ''; // Xóa bất kỳ nội dung cũ nào
        giftData.forEach((dataItem, i) => {
            const giftBag = createGiftBag(i, dataItem);
            giftBags.push(giftBag);
            giftContainer.appendChild(giftBag);
        });
    } else {
        // Nếu giftBags đã tồn tại, cập nhật lại chúng
        giftBags.forEach((giftBag, i) => {
            const dataItem = giftData[i];

            // Cập nhật dataset của phần tử DOM
            giftBag.dataset.actualContent = dataItem.content;
            giftBag.dataset.originalColor = dataItem.color;
            giftBag.dataset.originalIndex = dataItem.originalIndex;

            // Xóa tất cả các class trạng thái và màu sắc hiện tại
            giftBag.classList.remove('shuffled-yellow', 'shuffled', 'open', 'hidden', 'pink', 'black');
            // Thêm lại màu gốc
            giftBag.classList.add(dataItem.color);

            // Cập nhật textarea và label
            const textarea = giftBag.querySelector('textarea');
            const label = giftBag.querySelector('span.label');
            const contentDiv = giftBag.querySelector('.content');

            textarea.value = dataItem.content;
            textarea.readOnly = false;
            label.textContent = `${dataItem.originalIndex + 1}`; // Cập nhật số thứ tự

            // contentDiv.style.display = 'none'; // Đã xóa - CSS sẽ quản lý display

            // Đặt lại các style position/transform nếu có từ trạng thái 'open'
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
    // Đảm bảo cập nhật nội dung từ textarea vào giftData trước khi trộn
    giftBags.forEach((bag, index) => {
        const textarea = bag.querySelector('textarea');
        // Sử dụng originalIndex để cập nhật đúng vị trí trong giftData
        const originalIdx = parseInt(bag.dataset.originalIndex);
        giftData[originalIdx].content = textarea.value;
    });

    shuffleArray(giftData); // Trộn mảng dữ liệu

    // Cập nhật DOM của các túi theo dữ liệu đã trộn
    giftBags.forEach((bag, index) => {
        const shuffledItem = giftData[index]; // Lấy dữ liệu đã trộn

        // Gán nội dung đã trộn vào dataset của từng túi DOM
        bag.dataset.actualContent = shuffledItem.content;
        bag.dataset.originalColor = shuffledItem.color; // Cần giữ nguyên màu gốc để khôi phục

        // Thêm class 'shuffled' và 'shuffled-yellow'
        bag.classList.add('shuffled', 'shuffled-yellow');
        // Đảm bảo loại bỏ các màu cũ (pink/black)
        bag.classList.remove('pink', 'black', 'open', 'hidden');

        // Vô hiệu hóa textarea
        bag.querySelector('textarea').readOnly = true;
        // bag.querySelector('textarea').style.display = 'none'; // Đã xóa - CSS quản lý display

        // bag.querySelector('.content').style.display = 'none'; // Đã xóa - CSS quản lý display

        // Đặt lại các style position/transform nếu có từ trạng thái 'open'
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
    // Reset tất cả các túi về trạng thái ban đầu sau khi mở
    giftBags.forEach(bag => {
        // Loại bỏ tất cả các class trạng thái
        bag.classList.remove('open', 'hidden', 'shuffled', 'shuffled-yellow', 'pink', 'black');
        // Thêm lại màu sắc gốc của túi dựa vào dataset (quan trọng!)
        bag.classList.add(bag.dataset.originalColor);

        // Đảm bảo textarea không bị đọc-ghi và nội dung ẩn đi.
        bag.querySelector('textarea').readOnly = true;
        // bag.querySelector('textarea').style.display = 'none'; // Đã xóa - CSS quản lý display
        // bag.querySelector('.content').style.display = 'none'; // Đã xóa - CSS quản lý display
            
        // Reset các style inline
        bag.style.position = '';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.transform = '';
        bag.style.zIndex = '';
    });

    // Trộn lại dữ liệu (chỉ nội dung) để có một lượt chơi mới
    shuffleArray(giftData);

    // Cập nhật lại các túi với dữ liệu đã trộn
    giftBags.forEach((bag, index) => {
        const shuffledItem = giftData[index];
        bag.dataset.actualContent = shuffledItem.content;
        bag.dataset.originalColor = shuffledItem.color; // Giữ nguyên màu gốc cho túi DOM
        bag.classList.add('shuffled', 'shuffled-yellow'); // Đưa về trạng thái trộn
    });


    playAgainBtn.style.display = 'none';
    editBtn.style.display = 'none'; // Ẩn nút chỉnh sửa sau khi chơi tiếp
    shuffleBtn.disabled = false;
    shuffleBtn.style.display = 'block';
});

// Xử lý nút "Chỉnh Sửa"
editBtn.addEventListener('click', () => {
    // Sắp xếp lại giftData theo originalIndex để nội dung trở về đúng vị trí
    giftData.sort((a, b) => a.originalIndex - b.originalIndex);

    giftBags.forEach((bag, i) => {
        const originalDataItem = giftData[i];

        // Loại bỏ tất cả các class trạng thái và màu sắc hiện tại
        bag.classList.remove('shuffled', 'open', 'hidden', 'shuffled-yellow', 'pink', 'black');
        // Thêm lại màu gốc
        bag.classList.add(originalDataItem.color);

        // Cập nhật textarea và label
        const textarea = bag.querySelector('textarea');
        const label = bag.querySelector('span.label');

        textarea.value = originalDataItem.content;
        textarea.readOnly = false; // Cho phép chỉnh sửa
        // textarea.style.display = 'block'; // Đã xóa - CSS quản lý display
        label.textContent = `${originalDataItem.originalIndex + 1}`; // Cập nhật lại số thứ tự
        // label.style.display = 'block'; // Đã xóa - CSS quản lý display

        // bag.querySelector('.content').style.display = 'none'; // Đã xóa - CSS quản lý display

        // Reset các style inline
        bag.style.transform = '';
        bag.style.position = '';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.zIndex = '';
    });

    shuffleBtn.disabled = false;
    shuffleBtn.style.display = 'block';
    playAgainBtn.style.display = 'none'; // Ẩn nút chơi lại
    editBtn.style.display = 'block'; // Đảm bảo nút chỉnh sửa hiển thị
});

// Đảm bảo rằng hàm initializeGiftBags() được gọi sau khi toàn bộ DOM đã được tải.
document.addEventListener('DOMContentLoaded', initializeGiftBags);
