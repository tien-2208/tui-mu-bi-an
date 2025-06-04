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
    // Gán một ID duy nhất cho mỗi túi dựa trên vị trí vật lý ban đầu của nó
    // Điều này giúp giữ số thứ tự cố định cho vị trí đó
    giftBag.id = `giftBag-${index}`;

    // Gán màu ban đầu
    giftBag.classList.add(initialData.color);

    // Lưu toàn bộ dữ liệu nội dung vào dataset để dễ dàng truy xuất sau này
    // initialData.content là nội dung thực sự của túi này
    giftBag.dataset.actualContent = initialData.content;
    giftBag.dataset.originalColor = initialData.color;
    // initialData.originalIndex là index của nội dung, sẽ thay đổi khi shuffle
    // nhưng index (vị trí) của túi vật lý thì cố định
    giftBag.dataset.physicalIndex = index; // Lưu vị trí vật lý của túi

    const giftIcon = document.createElement('i');
    giftIcon.classList.add('fas', 'fa-gift');

    const label = document.createElement('span');
    label.classList.add('label');
    // Hiển thị số thứ tự vật lý của túi, không thay đổi khi trộn
    label.textContent = `${parseInt(giftBag.dataset.physicalIndex) + 1}`;

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Ghi điều ước (tối đa 150 ký tự)...';
    textarea.maxLength = maxContentLength;
    textarea.value = initialData.content; // Đặt giá trị ban đầu cho textarea
    // Mặc định hiển thị textarea khi ở trạng thái nhập liệu (chưa trộn)
    textarea.style.display = 'block'; 

    textarea.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn sự kiện click lan ra túi mù
    });

    const content = document.createElement('div');
    content.classList.add('content');
    content.style.display = 'none'; // Mặc định ẩn nội dung

    giftBag.appendChild(giftIcon);
    giftBag.appendChild(label);
    giftBag.appendChild(textarea);
    giftBag.appendChild(content);

    // Xử lý sự kiện click để mở túi mù
    giftBag.addEventListener('click', () => {
        // Chỉ cho phép mở túi khi đã trộn và túi chưa được mở
        if (giftBag.classList.contains('shuffled') && !giftBag.classList.contains('open')) {
            // Loại bỏ màu vàng và trả về màu gốc của NỘI DUNG túi (lấy từ shuffledItem)
            giftBag.classList.remove('shuffled-yellow');
            // Tìm data của túi này trong giftData để lấy màu gốc đúng
            // Dựa vào physicalIndex để lấy data đã được gán vào túi hiện tại
            const currentContentData = giftData[parseInt(giftBag.dataset.physicalIndex)];
            giftBag.classList.add(currentContentData.color); 

            // Thêm class 'open' cho túi được chọn
            giftBag.classList.add('open');

            // Ẩn tất cả các túi khác sau một khoảng trễ ngắn
            // để túi được chọn có thời gian biến đổi trước khi các túi khác biến mất.
            // Điều này giúp tránh việc tính toán lại vị trí đột ngột.
            setTimeout(() => {
                giftBags.forEach(bag => {
                    if (bag !== giftBag) {
                        bag.classList.add('hidden');
                    }
                });
            }, 100); // Khoảng trễ 100ms

            // Lấy nội dung thực sự từ dataset
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
                originalIndex: i // Lưu số thứ tự gốc của nội dung
            });
        }
    }

    if (giftBags.length === 0) {
        giftContainer.innerHTML = '';
        giftData.forEach((dataItem, i) => {
            // Khi tạo túi lần đầu, physicalIndex chính là i
            const giftBag = createGiftBag(i, dataItem); 
            giftBags.push(giftBag);
            giftContainer.appendChild(giftBag);
        });
    } else {
        // Nếu đã có túi, cập nhật trạng thái
        giftBags.forEach((giftBag, i) => {
            // Lấy data tương ứng với vị trí vật lý của túi hiện tại
            const dataItem = giftData[i]; 

            // Cập nhật nội dung và màu SẮC GỐC của túi
            giftBag.dataset.actualContent = dataItem.content;
            giftBag.dataset.originalColor = dataItem.color; 
            // physicalIndex không thay đổi, originalIndex của nội dung thì có thể thay đổi
            // label.textContent = `${parseInt(giftBag.dataset.physicalIndex) + 1}`; // Không cần cập nhật vì nó cố định

            giftBag.querySelector('textarea').value = dataItem.content;

            // Đảm bảo túi về trạng thái ban đầu: không trộn, không mở, không ẩn
            giftBag.classList.remove('shuffled-yellow', 'shuffled', 'open', 'hidden');
            giftBag.classList.remove('pink', 'black'); // Xóa màu cũ
            giftBag.classList.add(dataItem.color); // Đặt lại màu gốc của nội dung

            giftBag.querySelector('.fa-gift').style.display = 'none'; // Ẩn icon khi đang nhập
            giftBag.querySelector('span.label').style.display = 'none'; // Ẩn label khi đang nhập
            giftBag.querySelector('textarea').style.display = 'block'; // Hiển thị textarea
            giftBag.querySelector('textarea').readOnly = false;
            giftBag.querySelector('.content').style.display = 'none';

            // Reset các thuộc tính style được thêm bởi class 'open'
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

// Hàm trộn ngẫu nhiên mảng (chỉ trộn giftData, không trộn giftBags DOM elements)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Xử lý nút trộn
shuffleBtn.addEventListener('click', () => {
    // Lưu nội dung hiện tại từ các textarea vào giftData
    giftBags.forEach((bag, index) => {
        // Lấy nội dung từ textarea của túi vật lý tại vị trí 'index'
        // và lưu nó vào 'giftData' ở vị trí 'index'
        giftData[index].content = bag.querySelector('textarea').value;
    });

    // Trộn ngẫu nhiên MẢNG DỮ LIỆU (giftData)
    shuffleArray(giftData);

    // Cập nhật từng túi DOM (giftBag) với dữ liệu ĐÃ TRỘN tương ứng với VỊ TRÍ VẬT LÝ của nó
    giftBags.forEach((bag, index) => {
        const shuffledItem = giftData[index]; // Lấy dữ liệu đã trộn cho vị trí này

        // Cập nhật dataset của túi DOM với nội dung và màu SẮC GỐC của NỘI DUNG đã trộn
        bag.dataset.actualContent = shuffledItem.content;
        bag.dataset.originalColor = shuffledItem.color;
        // physicalIndex không thay đổi
        // bag.dataset.originalIndex = shuffledItem.originalIndex; // Không cần thiết ở đây, đã là physicalIndex

        bag.classList.add('shuffled', 'shuffled-yellow'); // Thêm class shuffled và màu vàng
        bag.classList.remove('pink', 'black'); // Xóa màu cũ
        // Không thêm màu gốc của nội dung vào đây, chỉ dùng màu vàng khi trộn

        bag.querySelector('textarea').readOnly = true;
        bag.querySelector('textarea').style.display = 'none'; // Ẩn textarea

        bag.querySelector('.content').style.display = 'none'; // Ẩn nội dung

        // Hiển thị icon hộp quà và nhãn số thứ tự
        bag.querySelector('.fa-gift').style.display = 'block'; // Hiển thị icon
        bag.querySelector('span.label').style.display = 'block'; // Hiển thị số thứ tự

        // Reset các thuộc tính style
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
    // Reset tất cả các túi về trạng thái chưa mở, chưa trộn
    giftBags.forEach(bag => {
        bag.classList.remove('open'); // Loại bỏ class 'open' ngay lập tức
        bag.querySelector('.content').style.display = 'none';
        
        // Reset các thuộc tính style khi túi không ở trạng thái 'open'
        bag.style.position = '';
        bag.style.left = '';
        bag.style.top = '';
        bag.style.transform = ''; 
        bag.style.zIndex = '';

        // Đảm bảo túi về trạng thái đã trộn (vàng) và ẩn tạm thời
        bag.classList.add('shuffled-yellow', 'shuffled');
        bag.classList.remove('pink', 'black'); // Loại bỏ màu gốc nếu có
        bag.querySelector('.fa-gift').style.display = 'block'; // Hiển thị icon
        bag.querySelector('span.label').style.display = 'block'; // Hiển thị số thứ tự
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
            bag.dataset.originalColor = shuffledItem.color;

            bag.classList.remove('hidden', 'open'); // Đảm bảo bỏ hidden và open
            bag.querySelector('.content').style.display = 'none';
            
            bag.classList.add('shuffled-yellow'); // Đảm bảo túi có màu vàng sau khi chơi tiếp
            bag.classList.remove('pink', 'black');

            // Hiển thị icon hộp quà và nhãn số thứ tự
            bag.querySelector('.fa-gift').style.display = 'block';
            bag.querySelector('span.label').style.display = 'block';

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
    // Sắp xếp lại giftData theo originalIndex (tức là theo thứ tự nội dung ban đầu)
    giftData.sort((a, b) => a.originalIndex - b.originalIndex);

    // Cập nhật lại từng túi DOM theo thứ tự vật lý của nó với nội dung đã sắp xếp
    giftBags.forEach((bag, i) => {
        // Lấy data tương ứng với vị trí vật lý của túi hiện tại
        const dataItem = giftData[i]; 

        bag.classList.remove('shuffled', 'open', 'hidden', 'shuffled-yellow');
        bag.classList.remove('pink', 'black'); // Xóa màu cũ
        bag.classList.add(dataItem.color); // Đặt lại màu gốc

        bag.querySelector('textarea').value = dataItem.content; // Cập nhật nội dung textarea
        bag.querySelector('textarea').readOnly = false;
        bag.querySelector('textarea').style.display = 'block'; // Hiển thị textarea

        // Không cần cập nhật label.textContent vì nó cố định theo physicalIndex
        // bag.querySelector('span.label').textContent = `${parseInt(bag.dataset.physicalIndex) + 1}`; 
        bag.querySelector('span.label').style.display = 'none'; // Ẩn label khi chỉnh sửa

        bag.querySelector('.fa-gift').style.display = 'none'; // Ẩn icon khi chỉnh sửa

        bag.querySelector('.content').style.display = 'none';

        // Quan trọng: Reset các thuộc tính style đã bị thay đổi bởi trạng thái 'open'
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
