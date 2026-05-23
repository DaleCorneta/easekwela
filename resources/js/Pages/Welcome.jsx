import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    FiArrowRight,
    FiUsers,
    FiCalendar,
    FiAward,
    FiBarChart,
    FiBook,
    FiSun,
    FiMoon,
} from "react-icons/fi";

const Motion = motion;

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, ease: "easeOut" } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const features = [
    {
        icon: FiUsers,
        label: "Student & Enrollment Management",
        accentColorLight: "rgba(71,177,252,0.08)",
        accentColorDark: "rgba(71,177,252,0.12)",
        borderColorLight: "rgba(71,177,252,0.2)",
        borderColorDark: "rgba(71,177,252,0.3)",
        glowColorLight: "rgba(71,177,252,0.05)",
        glowColorDark: "rgba(71,177,252,0.1)",
        iconColor: "#47b1fc",
    },
    {
        icon: FiCalendar,
        label: "Scheduling & Attendance",
        accentColorLight: "rgba(202,144,252,0.08)",
        accentColorDark: "rgba(202,144,252,0.12)",
        borderColorLight: "rgba(202,144,252,0.2)",
        borderColorDark: "rgba(202,144,252,0.3)",
        glowColorLight: "rgba(202,144,252,0.05)",
        glowColorDark: "rgba(202,144,252,0.1)",
        iconColor: "#ca90fc",
    },
    {
        icon: FiAward,
        label: "Grades & Academic Records",
        accentColorLight: "rgba(41,204,180,0.08)",
        accentColorDark: "rgba(41,204,180,0.12)",
        borderColorLight: "rgba(41,204,180,0.2)",
        borderColorDark: "rgba(41,204,180,0.3)",
        glowColorLight: "rgba(41,204,180,0.05)",
        glowColorDark: "rgba(41,204,180,0.1)",
        iconColor: "#29ccb4",
    },
    {
        icon: FiBarChart,
        label: "Reports & Performance Insights",
        accentColorLight: "rgba(71,177,252,0.08)",
        accentColorDark: "rgba(71,177,252,0.12)",
        borderColorLight: "rgba(71,177,252,0.2)",
        borderColorDark: "rgba(71,177,252,0.3)",
        glowColorLight: "rgba(71,177,252,0.05)",
        glowColorDark: "rgba(71,177,252,0.1)",
        iconColor: "#47b1fc",
    },
    {
        icon: FiBook,
        label: "Learning Management System (LMS)",
        accentColorLight: "rgba(202,144,252,0.08)",
        accentColorDark: "rgba(202,144,252,0.12)",
        borderColorLight: "rgba(202,144,252,0.2)",
        borderColorDark: "rgba(202,144,252,0.3)",
        glowColorLight: "rgba(202,144,252,0.05)",
        glowColorDark: "rgba(202,144,252,0.1)",
        iconColor: "#ca90fc",
    },
];

export default function Welcome({ auth, laravelVersion, phpVersion }) {
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

    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen bg-white dark:bg-gray-950 text-gray-700 dark:text-white/70 overflow-hidden transition-colors duration-300">
                {/* Aurora-style animated background - adapted for both themes */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    {/* Layered radial gradients - lighter in light mode, darker in dark mode */}
                    <div
                        className="absolute inset-0
                            bg-[radial-gradient(ellipse_at_top_left,rgba(71,177,252,0.08),transparent_60%),
                            radial-gradient(ellipse_at_bottom_right,rgba(202,144,252,0.06),transparent_60%)]
                            dark:bg-[radial-gradient(ellipse_at_top_left,rgba(71,177,252,0.12),transparent_60%),
                            radial-gradient(ellipse_at_bottom_right,rgba(202,144,252,0.10),transparent_60%)]"
                    />
                    {/* Center glow */}
                    <div
                        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-225 h-225 pointer-events-none
                            bg-[radial-gradient(circle,rgba(71,177,252,0.1),transparent_70%)]
                            dark:bg-[radial-gradient(circle,rgba(71,177,252,0.15),transparent_70%)]"
                    />
                    {/* Animated grid - opacity/color adjusted for light mode */}
                    <Motion.div
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, ${isDarkMode ? "rgba(71,177,252,0.08)" : "rgba(71,177,252,0.04)"} 1px, transparent 1px),
                                linear-gradient(to bottom, ${isDarkMode ? "rgba(71,177,252,0.08)" : "rgba(71,177,252,0.04)"} 1px, transparent 1px)
                            `,
                            backgroundSize: "40px 40px",
                            WebkitMaskImage:
                                "radial-gradient(ellipse at center, black, transparent 75%)",
                            maskImage:
                                "radial-gradient(ellipse at center, black, transparent 75%)",
                        }}
                        animate={{
                            backgroundPosition: ["0px 0px", "40px 40px"],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute inset-0"
                    />
                </div>

                <div className="relative flex min-h-screen flex-col">
                    {/* HEADER with theme toggle */}
                    <header className="relative z-50 grid grid-cols-2 items-center gap-2 py-6 px-6 lg:grid-cols-3">
                        {/* Logo */}
                        <div className="flex lg:col-start-2 lg:justify-center">
                            <svg
                                className="h-10 w-auto text-primary dark:text-primary lg:h-12"
                                viewBox="0 0 62 65"
                                fill="none"
                            >
                                <path
                                    d="M61.8548 14.6253..."
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        {/* Nav + Theme Toggle */}
                        <nav className="-mx-3 flex flex-1 justify-end gap-3 items-center">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="rounded-lg px-4 py-2 text-sm font-primary text-gray-700 dark:text-white/70
                                        transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="rounded-lg px-4 py-2 text-sm font-primary text-gray-700 dark:text-white/70
                                            transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="rounded-lg px-4 py-2 text-sm font-primary
                                            bg-primary text-white dark:text-dark
                                            transition-all duration-300 hover:scale-105 shadow-md"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white/70
                                    hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
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

                    {/* MAIN */}
                    <main className="relative flex-1 flex items-center justify-center">
                        <section className="relative w-full py-16 md:py-32 px-6 overflow-hidden">
                            <div className="container mx-auto">
                                {/* HERO CONTENT */}
                                <Motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="max-w-3xl mx-auto text-center mb-16"
                                >
                                    <Motion.p
                                        variants={item}
                                        className="text-xs uppercase tracking-widest text-primary font-primary mb-4"
                                    >
                                        School Management System
                                    </Motion.p>

                                    <Motion.h1
                                        variants={item}
                                        className="text-4xl md:text-6xl lg:text-7xl font-secondary font-thin text-gray-900 dark:text-white leading-tight"
                                    >
                                        <span className="text-primary">
                                            Ease
                                        </span>
                                        Kwela
                                    </Motion.h1>

                                    <Motion.p
                                        variants={item}
                                        className="mt-6 text-gray-600 dark:text-gray-400 font-secondary font-thin md:font-extralight text-base md:text-lg leading-relaxed"
                                    >
                                        A centralized platform designed to
                                        manage student records, academic
                                        workflows, and daily school operations —
                                        all in one unified system.
                                    </Motion.p>
                                </Motion.div>

                                {/* FEATURES GRID */}
                                <Motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
                                >
                                    {features.map((f, i) => {
                                        const Icon = f.icon;
                                        const isDark = isDarkMode;
                                        const accentColor = isDark
                                            ? f.accentColorDark
                                            : f.accentColorLight;
                                        const borderColor = isDark
                                            ? f.borderColorDark
                                            : f.borderColorLight;
                                        const glowColor = isDark
                                            ? f.glowColorDark
                                            : f.glowColorLight;
                                        return (
                                            <Motion.div
                                                key={i}
                                                variants={item}
                                                className="group relative rounded-2xl p-5 overflow-hidden
                                                    bg-white dark:bg-gray-900/80
                                                    border
                                                    shadow-sm dark:shadow-[0_4px_14px_rgba(0,0,0,0.30)]
                                                    hover:shadow-md dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.42)]
                                                    hover:-translate-y-0.5
                                                    transition-all duration-300"
                                                style={{
                                                    borderColor: borderColor,
                                                }}
                                            >
                                                {/* Radial gradient accent */}
                                                <div
                                                    className="absolute inset-0 pointer-events-none rounded-2xl"
                                                    style={{
                                                        background: `radial-gradient(ellipse at 80% 10%, ${accentColor}, transparent 65%)`,
                                                    }}
                                                />

                                                {/* Subtle dot pattern */}
                                                <div
                                                    className="pointer-events-none absolute inset-0 rounded-2xl
                                                        bg-[radial-gradient(circle,rgba(0,0,0,0.02)_1.2px,transparent_1.5px)]
                                                        dark:bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1.2px,transparent_1.5px)]
                                                        bg-size-[20px_20px]
                                                        mask-[radial-gradient(circle_at_top_right,white_30%,transparent_80%)]"
                                                />

                                                {/* Icon box */}
                                                <div
                                                    className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center mb-3
                                                        backdrop-blur-sm transition-all duration-300
                                                        group-hover:scale-105"
                                                    style={{
                                                        background: accentColor,
                                                        border: `1px solid ${borderColor}`,
                                                        boxShadow: `0 0 12px ${glowColor}`,
                                                    }}
                                                >
                                                    <Icon
                                                        className="text-sm"
                                                        style={{
                                                            color: f.iconColor,
                                                        }}
                                                    />
                                                </div>

                                                {/* Label */}
                                                <p className="relative z-10 text-gray-800 dark:text-white text-sm font-secondary font-extralight leading-snug">
                                                    {f.label}
                                                </p>
                                            </Motion.div>
                                        );
                                    })}
                                </Motion.div>
                            </div>
                        </section>
                    </main>

                    {/* FOOTER */}
                    <footer className="relative z-10 py-8 px-6 text-center text-xs text-gray-500 dark:text-gray-500 font-secondary border-t border-gray-200 dark:border-white/5">
                        Powered by{" "}
                        <span className="text-gray-800 dark:text-white">
                            Asenso
                        </span>
                        <span className="text-primary">Tech</span>
                    </footer>
                </div>
            </div>
        </>
    );
}
