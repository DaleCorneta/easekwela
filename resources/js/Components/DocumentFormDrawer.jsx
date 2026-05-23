import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function DocumentFormDrawer({
    student,
    document, // null for create, object for edit
    onClose,
}) {
    const isEdit = !!document;

    const { data, setData, post, processing, errors, reset } = useForm({
        document_type: document?.document_type || "",
        remarks: document?.remarks || "",
        file: null,
    });

    useEffect(() => {
        return () => reset();
    }, [document]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEdit
            ? route("students.documents.update", {
                  student: student.id,
                  document: document.id,
              })
            : route("students.documents.store", student.id);

        // If a file is selected, send as FormData
        if (data.file) {
            const formData = new FormData();
            formData.append("document_type", data.document_type);
            formData.append("remarks", data.remarks || "");
            formData.append("file", data.file);

            post(url, {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            // No file – send as JSON (only for edit, create still requires file)
            post(url, {
                data: {
                    document_type: data.document_type,
                    remarks: data.remarks,
                },
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Document Type *
                </label>
                <input
                    type="text"
                    value={data.document_type}
                    onChange={(e) => setData("document_type", e.target.value)}
                    required
                    placeholder="e.g., PSA, SF9, SF10"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.document_type && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.document_type}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    File {!isEdit && "*"}
                </label>
                <input
                    type="file"
                    onChange={(e) => setData("file", e.target.files[0])}
                    required={!isEdit}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-white hover:file:bg-primary-dark"
                />
                {isEdit && (
                    <p className="text-xs text-body dark:text-gray-400 mt-1">
                        Leave blank to keep the current file.
                    </p>
                )}
                {errors.file && (
                    <p className="text-red-600 text-sm mt-1">{errors.file}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Remarks
                </label>
                <textarea
                    value={data.remarks}
                    onChange={(e) => setData("remarks", e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                ></textarea>
                {errors.remarks && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.remarks}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-default dark:border-gray-700">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={processing}
                    className="px-4 py-2 bg-neutral-secondary-medium border border-default-medium text-body rounded-base hover:bg-neutral-tertiary-medium hover:text-heading transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-primary text-white rounded-base hover:bg-primary-dark disabled:opacity-50 transition shadow-sm"
                >
                    {processing ? "Saving..." : isEdit ? "Update" : "Upload"}
                </button>
            </div>
        </form>
    );
}
