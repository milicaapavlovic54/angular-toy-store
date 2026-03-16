import Swal from "sweetalert2";

const matCustomClass = {
    popup: 'mat-swal-popup',
    title: 'mat-swal-title',
    actions: 'mat-swal-actions',
    confirmButton: 'mat-swal-confirm',
    cancelButton: 'mat-swal-cancel'
}

export class Alerts {
    static success(text: string) {
        Swal.fire({
            title: 'Uspešno',
            text,
            icon: 'success', 
            customClass: matCustomClass
        })
    }

    static error(text: string) {
        Swal.fire({
            title: 'Greška',
            text,
            icon: 'error',
            customClass: matCustomClass
        })
    }

    static confirm(text: string, callback: Function) {
        Swal.fire({
            title: "Da li ste sigurni?",
            text,
            icon: "question",
            customClass: matCustomClass,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Da",
            cancelButtonText: "Odustani"
        }).then((result) => {
            if (result.isConfirmed) {
                callback()
            }
        })
    }

}