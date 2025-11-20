import Swal from 'sweetalert2';

export const confirmDialog = async ({
    title = 'Xác nhận xóa?',
    text = 'Bạn có chắc chắn muốn thực hiện hành động này?',
    confirmText = 'Xóa',
    cancelText = 'Hủy',
    icon = 'warning',
} = {}) => {
    return await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
    });
};
