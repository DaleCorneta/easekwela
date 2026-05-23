import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { HiOutlineTrash, HiOutlineX } from "react-icons/hi";
import Modal from "@/Components/Modal";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        // Temporarily disabled – modal will not open
        // setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-heading dark:text-white">
                    Delete Account
                </h2>
                <p className="mt-1 text-sm text-body dark:text-gray-400">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                disabled
                title="Account deletion is temporarily disabled"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/50 text-white/70 rounded-base cursor-not-allowed transition shadow-sm"
            >
                <HiOutlineTrash className="w-4 h-4" />
                Delete Account
            </button>

            <Modal isOpen={confirmingUserDeletion} onClose={closeModal}>
                {/* Modal content unchanged – but it will never open because confirmingUserDeletion never becomes true */}
                <form onSubmit={deleteUser} className="p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-medium text-heading dark:text-white">
                            Are you sure you want to delete your account?
                        </h2>
                        <p className="mt-1 text-sm text-body dark:text-gray-400">
                            Once your account is deleted, all of its resources
                            and data will be permanently deleted. Please enter
                            your password to confirm.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                            autoFocus
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-neutral-secondary-medium border border-default-medium text-body rounded-base hover:bg-neutral-tertiary-medium hover:text-heading transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 text-white rounded-base hover:bg-red-700 disabled:opacity-50 transition shadow-sm"
                        >
                            {processing ? "Deleting..." : "Delete Account"}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
