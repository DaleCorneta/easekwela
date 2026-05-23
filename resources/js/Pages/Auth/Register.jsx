import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    FiUser,
    FiMail,
    FiLock,
    FiArrowRight,
    FiCheckCircle,
    FiUsers,
    FiCalendar,
    FiTrendingUp,
    FiEye,
    FiEyeOff,
    FiShield,
    FiSun,
    FiMoon,
    FiPhone,
} from "react-icons/fi";
import GuestLayout from "@/Layouts/GuestLayout";

const Motion = motion;

const features = [
    {
        icon: FiUsers,
        label: "Student Management",
        color: "#47b1fc",
    },
    {
        icon: FiCalendar,
        label: "Smart Scheduling",
        color: "#ca90fc",
    },
    {
        icon: FiTrendingUp,
        label: "Real-time Analytics",
        color: "#29ccb4",
    },
];

export default function Register({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        prefix: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        mobile_number: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize theme from localStorage/system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        const shouldBeDark =
            savedTheme === "dark" || (!savedTheme && systemPrefersDark);
        setIsDarkMode(shouldBeDark);
        if (shouldBeDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Background wrapper – matches Welcome page light/dark backgrounds */}
            <div className="relative min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
                {/* Subtle radial gradients (same as Welcome page) */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(71,177,252,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(202,144,252,0.06),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(71,177,252,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(202,144,252,0.10),transparent_60%)]" />
                    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-225 h-225 bg-[radial-gradient(circle,rgba(71,177,252,0.1),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(71,177,252,0.15),transparent_70%)]" />
                </div>

                <header className="relative z-50 grid grid-cols-2 items-center gap-2 py-6 px-6 lg:grid-cols-3">
                    {/* Logo */}
                    <div className="flex lg:col-start-2 lg:justify-center">
                        <svg
                            className="h-10 w-auto text-primary lg:h-12"
                            viewBox="0 0 62 65"
                            fill="none"
                        >
                            <path d="M61.8548 14.6253..." fill="currentColor" />
                        </svg>
                    </div>

                    {/* Nav + Theme Toggle */}
                    <nav className="-mx-3 flex flex-1 justify-end gap-3 items-center">
                        <Link
                            href="/"
                            className="rounded-lg px-4 py-2 text-sm font-primary text-gray-700 dark:text-white/70 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary"
                        >
                            Home
                        </Link>
                        <Link
                            href={route("login")}
                            className="rounded-lg px-4 py-2 text-sm font-primary text-gray-700 dark:text-white/70 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary"
                        >
                            Sign in
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <FiSun className="w-5 h-5" />
                            ) : (
                                <FiMoon className="w-5 h-5" />
                            )}
                        </button>
                    </nav>
                </header>

                <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* LEFT — Brand / Hero Section */}
                        <div className="hidden lg:flex lg:w-1/2 flex-col">
                            <Motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.7,
                                    ease: "easeOut",
                                }}
                            >
                                <div className="mb-10">
                                    <h1 className="text-4xl xl:text-5xl font-secondary font-thin text-gray-900 dark:text-white tracking-wide">
                                        Ease
                                        <span className="text-primary font-normal">
                                            Kwela
                                        </span>
                                    </h1>
                                    <div className="mt-3 h-px w-16 bg-linear-to-r from-primary/60 to-transparent" />
                                </div>

                                <h2 className="text-3xl xl:text-4xl font-secondary font-thin text-gray-900 dark:text-white leading-tight mb-6">
                                    Start Managing Your{" "}
                                    <span className="text-primary">
                                        School Better
                                    </span>
                                </h2>

                                <p className="text-gray-600 dark:text-gray-400 font-secondary font-thin text-base xl:text-lg leading-relaxed mb-10 max-w-md">
                                    Join schools across the Philippines that
                                    have streamlined their operations with our
                                    centralized management platform.
                                </p>

                                <div className="space-y-4 mb-10">
                                    {features.map((f, i) => {
                                        const Icon = f.icon;
                                        return (
                                            <Motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.3 + i * 0.15,
                                                    duration: 0.5,
                                                    ease: "easeOut",
                                                }}
                                                className="flex items-center gap-4"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{
                                                        background: `${f.color}15`,
                                                        border: `1px solid ${f.color}30`,
                                                        boxShadow: `0 0 12px ${f.color}10`,
                                                    }}
                                                >
                                                    <Icon
                                                        className="text-lg"
                                                        style={{
                                                            color: f.color,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-gray-800 dark:text-gray-400 text-sm font-secondary font-extralight">
                                                    {f.label}
                                                </span>
                                            </Motion.div>
                                        );
                                    })}
                                </div>

                                <Motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.75,
                                        duration: 0.5,
                                        ease: "easeOut",
                                    }}
                                    className="flex items-center gap-4"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            background: "rgba(71,177,252,0.08)",
                                            border: "1px solid rgba(71,177,252,0.2)",
                                            boxShadow:
                                                "0 0 12px rgba(71,177,252,0.06)",
                                        }}
                                    >
                                        <FiShield className="text-lg text-primary" />
                                    </div>
                                    <span className="text-gray-800 dark:text-gray-400 text-sm font-secondary font-extralight">
                                        Secure & Role-Based Access
                                    </span>
                                </Motion.div>

                                <div className="mt-12 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 font-primary">
                                    <FiCheckCircle className="text-[#29ccb4] text-sm" />
                                    <span>
                                        Free to get started • No upfront
                                        complexity
                                    </span>
                                </div>
                            </Motion.div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-96 bg-linear-to-b from-transparent via-gray-300 dark:via-white/10 to-transparent" />

                        {/* RIGHT — Register Form */}
                        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.2,
                                    ease: "easeOut",
                                }}
                            >
                                {/* Mobile logo */}
                                <div className="lg:hidden text-center mb-10">
                                    <h1 className="text-3xl font-secondary font-thin text-gray-900 dark:text-white tracking-wide">
                                        Ease
                                        <span className="text-primary font-normal">
                                            Kwela
                                        </span>
                                    </h1>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-500 font-secondary">
                                        School Management System
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <p className="text-xs uppercase tracking-widest text-primary font-primary mb-3">
                                        Get Started
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-secondary font-thin text-gray-900 dark:text-white">
                                        Create your account
                                    </h2>
                                    <p className="mt-2 text-gray-500 dark:text-gray-500 text-sm font-secondary font-extralight">
                                        Set up your school management system in
                                        minutes
                                    </p>
                                </div>

                                <form onSubmit={submit} className="space-y-5">
                                    {/* Prefix / First Name / Middle Name / Last Name / Suffix */}
                                    <div className="flex flex-wrap gap-3">
                                        {/* Prefix */}
                                        <div className="w-20 sm:w-24">
                                            <label
                                                htmlFor="prefix"
                                                className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                            >
                                                Prefix
                                            </label>
                                            <input
                                                id="prefix"
                                                type="text"
                                                name="prefix"
                                                value={data.prefix}
                                                autoComplete="honorific-prefix"
                                                onChange={(e) =>
                                                    setData(
                                                        "prefix",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Mr."
                                                className="w-full px-3 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                ring-1 ring-gray-200 dark:ring-white/10
                text-gray-900 dark:text-white text-sm font-secondary font-extralight
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-gray-50 dark:focus:bg-white/5
                transition-all duration-300"
                                            />
                                            {errors.prefix && (
                                                <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                    {errors.prefix}
                                                </p>
                                            )}
                                        </div>

                                        {/* First Name */}
                                        <div className="flex-1 min-w-[120px]">
                                            <label
                                                htmlFor="first_name"
                                                className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                            >
                                                First Name *
                                            </label>
                                            <input
                                                id="first_name"
                                                type="text"
                                                name="first_name"
                                                value={data.first_name}
                                                autoComplete="given-name"
                                                required
                                                onChange={(e) =>
                                                    setData(
                                                        "first_name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Juan"
                                                className="w-full px-3 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                ring-1 ring-gray-200 dark:ring-white/10
                text-gray-900 dark:text-white text-sm font-secondary font-extralight
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-gray-50 dark:focus:bg-white/5
                transition-all duration-300"
                                            />
                                            {errors.first_name && (
                                                <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Middle Name */}
                                        <div className="flex-1 min-w-[120px]">
                                            <label
                                                htmlFor="middle_name"
                                                className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                            >
                                                Middle Name
                                            </label>
                                            <input
                                                id="middle_name"
                                                type="text"
                                                name="middle_name"
                                                value={data.middle_name}
                                                autoComplete="additional-name"
                                                onChange={(e) =>
                                                    setData(
                                                        "middle_name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Santos"
                                                className="w-full px-3 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                ring-1 ring-gray-200 dark:ring-white/10
                text-gray-900 dark:text-white text-sm font-secondary font-extralight
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-gray-50 dark:focus:bg-white/5
                transition-all duration-300"
                                            />
                                            {errors.middle_name && (
                                                <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                    {errors.middle_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Last Name */}
                                        <div className="flex-1 min-w-[120px]">
                                            <label
                                                htmlFor="last_name"
                                                className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                            >
                                                Last Name *
                                            </label>
                                            <input
                                                id="last_name"
                                                type="text"
                                                name="last_name"
                                                value={data.last_name}
                                                autoComplete="family-name"
                                                required
                                                onChange={(e) =>
                                                    setData(
                                                        "last_name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Dela Cruz"
                                                className="w-full px-3 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                ring-1 ring-gray-200 dark:ring-white/10
                text-gray-900 dark:text-white text-sm font-secondary font-extralight
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-gray-50 dark:focus:bg-white/5
                transition-all duration-300"
                                            />
                                            {errors.last_name && (
                                                <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                    {errors.last_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Suffix */}
                                        <div className="w-20 sm:w-24">
                                            <label
                                                htmlFor="suffix"
                                                className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                            >
                                                Suffix
                                            </label>
                                            <input
                                                id="suffix"
                                                type="text"
                                                name="suffix"
                                                value={data.suffix}
                                                autoComplete="honorific-suffix"
                                                onChange={(e) =>
                                                    setData(
                                                        "suffix",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Jr."
                                                className="w-full px-3 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                ring-1 ring-gray-200 dark:ring-white/10
                text-gray-900 dark:text-white text-sm font-secondary font-extralight
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-gray-50 dark:focus:bg-white/5
                transition-all duration-300"
                                            />
                                            {errors.suffix && (
                                                <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                    {errors.suffix}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Number */}
                                    <div>
                                        <label
                                            htmlFor="mobile_number"
                                            className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                        >
                                            Mobile Number
                                        </label>
                                        <div
                                            className={`relative rounded-xl transition-all duration-300 ${
                                                focusedField === "mobile_number"
                                                    ? "ring-1 ring-primary/50"
                                                    : "ring-1 ring-gray-200 dark:ring-white/10"
                                            }`}
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiPhone
                                                    className={`text-sm transition-colors duration-300 ${
                                                        focusedField ===
                                                        "mobile_number"
                                                            ? "text-primary"
                                                            : "text-gray-400 dark:text-gray-500"
                                                    }`}
                                                />
                                            </div>
                                            <input
                                                id="mobile_number"
                                                type="text"
                                                name="mobile_number"
                                                value={data.mobile_number}
                                                autoComplete="tel-national"
                                                onFocus={() =>
                                                    setFocusedField(
                                                        "mobile_number",
                                                    )
                                                }
                                                onBlur={() =>
                                                    setFocusedField(null)
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "mobile_number",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="+63 912 345 6789"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                                                    text-gray-900 dark:text-white text-sm font-secondary font-extralight
                                                    placeholder:text-gray-400 dark:placeholder:text-gray-600
                                                    focus:outline-none focus:bg-gray-50 dark:focus:bg-white/5
                                                    transition-all duration-300"
                                            />
                                        </div>
                                        {errors.mobile_number && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                {errors.mobile_number}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email field */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                        >
                                            Email Address
                                        </label>
                                        <div
                                            className={`relative rounded-xl transition-all duration-300 ${
                                                focusedField === "email"
                                                    ? "ring-1 ring-primary/50"
                                                    : "ring-1 ring-gray-200 dark:ring-white/10"
                                            }`}
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiMail
                                                    className={`text-sm transition-colors duration-300 ${
                                                        focusedField === "email"
                                                            ? "text-primary"
                                                            : "text-gray-400 dark:text-gray-500"
                                                    }`}
                                                />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                autoComplete="username"
                                                required
                                                onFocus={() =>
                                                    setFocusedField("email")
                                                }
                                                onBlur={() =>
                                                    setFocusedField(null)
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="your@email.com"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                                                    text-gray-900 dark:text-white text-sm font-secondary font-extralight
                                                    placeholder:text-gray-400 dark:placeholder:text-gray-600
                                                    focus:outline-none focus:bg-gray-50 dark:focus:bg-white/5
                                                    transition-all duration-300"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password field */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                        >
                                            Password
                                        </label>
                                        <div
                                            className={`relative rounded-xl transition-all duration-300 ${
                                                focusedField === "password"
                                                    ? "ring-1 ring-primary/50"
                                                    : "ring-1 ring-gray-200 dark:ring-white/10"
                                            }`}
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiLock
                                                    className={`text-sm transition-colors duration-300 ${
                                                        focusedField ===
                                                        "password"
                                                            ? "text-primary"
                                                            : "text-gray-400 dark:text-gray-500"
                                                    }`}
                                                />
                                            </div>
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={data.password}
                                                autoComplete="new-password"
                                                required
                                                onFocus={() =>
                                                    setFocusedField("password")
                                                }
                                                onBlur={() =>
                                                    setFocusedField(null)
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Create a strong password"
                                                className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                                                    text-gray-900 dark:text-white text-sm font-secondary font-extralight
                                                    placeholder:text-gray-400 dark:placeholder:text-gray-600
                                                    focus:outline-none focus:bg-gray-50 dark:focus:bg-white/5
                                                    transition-all duration-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <FiEyeOff className="text-sm" />
                                                ) : (
                                                    <FiEye className="text-sm" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password field */}
                                    <div>
                                        <label
                                            htmlFor="password_confirmation"
                                            className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-primary mb-2"
                                        >
                                            Confirm Password
                                        </label>
                                        <div
                                            className={`relative rounded-xl transition-all duration-300 ${
                                                focusedField ===
                                                "password_confirmation"
                                                    ? "ring-1 ring-primary/50"
                                                    : "ring-1 ring-gray-200 dark:ring-white/10"
                                            }`}
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiLock
                                                    className={`text-sm transition-colors duration-300 ${
                                                        focusedField ===
                                                        "password_confirmation"
                                                            ? "text-primary"
                                                            : "text-gray-400 dark:text-gray-500"
                                                    }`}
                                                />
                                            </div>
                                            <input
                                                id="password_confirmation"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password_confirmation"
                                                value={
                                                    data.password_confirmation
                                                }
                                                autoComplete="new-password"
                                                required
                                                onFocus={() =>
                                                    setFocusedField(
                                                        "password_confirmation",
                                                    )
                                                }
                                                onBlur={() =>
                                                    setFocusedField(null)
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Re-enter your password"
                                                className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-white/3 border-0 rounded-xl
                                                    text-gray-900 dark:text-white text-sm font-secondary font-extralight
                                                    placeholder:text-gray-400 dark:placeholder:text-gray-600
                                                    focus:outline-none focus:bg-gray-50 dark:focus:bg-white/5
                                                    transition-all duration-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <FiEyeOff className="text-sm" />
                                                ) : (
                                                    <FiEye className="text-sm" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400/80 font-primary">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2 space-y-4">
                                        <Motion.button
                                            type="submit"
                                            disabled={processing}
                                            whileHover={{
                                                scale: processing ? 1 : 1.02,
                                            }}
                                            whileTap={{
                                                scale: processing ? 1 : 0.98,
                                            }}
                                            className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                                                bg-primary text-white font-primary text-sm
                                                transition-all duration-300
                                                hover:shadow-[0_8px_25px_rgba(71,177,252,0.30)]
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Creating account...
                                                </>
                                            ) : (
                                                <>
                                                    Create account
                                                    <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </Motion.button>

                                        <p className="text-center text-xs text-gray-500 dark:text-gray-500 font-secondary font-extralight">
                                            Already have an account?{" "}
                                            <Link
                                                href={route("login")}
                                                className="text-primary hover:text-primary/80 transition-colors duration-200 font-primary"
                                            >
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </Motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
