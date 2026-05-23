import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            prefix: user.prefix || "",
            first_name: user.first_name || "",
            middle_name: user.middle_name || "",
            last_name: user.last_name || "",
            suffix: user.suffix || "",
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-heading dark:text-white">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-body dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                            Prefix
                        </label>
                        <input
                            type="text"
                            value={data.prefix}
                            onChange={(e) => setData("prefix", e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                            placeholder="Mr./Ms./Dr."
                        />
                        {errors.prefix && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.prefix}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                            First Name *
                        </label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                            className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                        />
                        {errors.first_name && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.first_name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                            Middle Name
                        </label>
                        <input
                            type="text"
                            value={data.middle_name}
                            onChange={(e) =>
                                setData("middle_name", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                        />
                        {errors.middle_name && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.middle_name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                            className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                        />
                        {errors.last_name && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                            Suffix
                        </label>
                        <input
                            type="text"
                            value={data.suffix}
                            onChange={(e) => setData("suffix", e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                            placeholder="Jr., Sr., III"
                        />
                        {errors.suffix && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.suffix}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm text-body dark:text-gray-400">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="ml-1 text-primary hover:underline focus:outline-none"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-primary text-white rounded-base hover:bg-primary-dark disabled:opacity-50 transition shadow-sm"
                    >
                        Save
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-body dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
