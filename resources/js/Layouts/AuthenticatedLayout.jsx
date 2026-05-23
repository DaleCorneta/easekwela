import { Link, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/Context/ToastContext";
import {
    HiOutlineUser,
    HiOutlineLogout,
    HiOutlineMenu,
    HiOutlineX,
    HiOutlineMail,
    HiOutlineBell,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineViewBoards,
    HiOutlineInbox,
    HiOutlineUsers,
    HiOutlineCube,
    HiOutlineOfficeBuilding,
    HiOutlineDocumentText,
    HiOutlineSupport,
    HiOutlineSparkles,
    HiOutlineChevronDown,
    HiOutlineAcademicCap,
    HiOutlineClipboardCheck,
    HiOutlineUserGroup,
} from "react-icons/hi";
import { LuCalendarCog } from "react-icons/lu";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const url = usePage().url;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [ecommerceDropdownOpen, setEcommerceDropdownOpen] = useState(false);

    // User Management
    const [userManagementDropdownOpen, setUserManagementDropdownOpen] =
        useState(() => {
            return (
                url === "/users" ||
                url.startsWith("/users/") ||
                url === "/roles" ||
                url.startsWith("/roles/")
            );
        });

    // Core Module Management (parent)
    const [coreModuleOpen, setCoreModuleOpen] = useState(() => {
        return (
            url === "/branches" ||
            url.startsWith("/branches/") ||
            url === "/branch-settings" ||
            url.startsWith("/branch-settings/") ||
            url === "/school-years" ||
            url.startsWith("/school-years/") ||
            url === "/academic-periods" ||
            url.startsWith("/academic-periods/") ||
            url === "/grade-levels" ||
            url.startsWith("/grade-levels/") ||
            url === "/tracks" ||
            url.startsWith("/tracks/") ||
            url === "/strands" ||
            url.startsWith("/strands/") ||
            url === "/sections" ||
            url.startsWith("/sections/") ||
            url === "/adviser-assignments" ||
            url.startsWith("/adviser-assignments/") ||
            url === "/section-settings" ||
            url.startsWith("/section-settings/")
        );
    });

    // Branch Management (sub of Core Module)
    const [branchManagementDropdownOpen, setBranchManagementDropdownOpen] =
        useState(() => {
            return (
                url === "/branches" ||
                url.startsWith("/branches/") ||
                url === "/branch-settings" ||
                url.startsWith("/branch-settings/")
            );
        });

    // School Management (sub of Core Module)
    const [
        schoolYearManagementDropdownOpen,
        setSchoolYearManagementDropdownOpen,
    ] = useState(() => {
        return (
            url === "/school-years" ||
            url.startsWith("/school-years/") ||
            url === "/academic-periods" ||
            url.startsWith("/academic-periods/") ||
            url === "/grade-levels" ||
            url.startsWith("/grade-levels/") ||
            url === "/tracks" ||
            url.startsWith("/tracks/") ||
            url === "/strands" ||
            url.startsWith("/strands/") ||
            url === "/sections" ||
            url.startsWith("/sections/") ||
            url === "/adviser-assignments" ||
            url.startsWith("/adviser-assignments/") ||
            url === "/section-settings" ||
            url.startsWith("/section-settings/")
        );
    });

    // Strand Management (nested inside School Management)
    const [strandManagementDropdownOpen, setStrandManagementDropdownOpen] =
        useState(() => {
            return (
                url === "/tracks" ||
                url.startsWith("/tracks/") ||
                url === "/strands" ||
                url.startsWith("/strands/")
            );
        });

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const { flash } = usePage().props;
    const { addToast } = useToast();

    useEffect(() => {
        if (flash?.success) addToast(flash.success, "success");
        if (flash?.error) addToast(flash.error, "error");
    }, [flash, addToast]);

    // Dark mode init
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDarkMode = () => {
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

    // Close user dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") setUserDropdownOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    // Responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
    const toggleMobileMenu = () =>
        setShowingNavigationDropdown(!showingNavigationDropdown);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleEcommerceDropdown = () =>
        setEcommerceDropdownOpen(!ecommerceDropdownOpen);
    const toggleCoreModule = () => setCoreModuleOpen(!coreModuleOpen);
    const toggleBranchManagementDropdown = () =>
        setBranchManagementDropdownOpen(!branchManagementDropdownOpen);
    const toggleSchoolYearManagementDropdown = () =>
        setSchoolYearManagementDropdownOpen(!schoolYearManagementDropdownOpen);
    const toggleStrandManagementDropdown = () =>
        setStrandManagementDropdownOpen(!strandManagementDropdownOpen);
    const toggleUserManagementDropdown = () =>
        setUserManagementDropdownOpen(!userManagementDropdownOpen);

    const getUserInitials = () => {
        if (!user?.first_name && !user?.last_name) return "U";
        const first = user.first_name?.charAt(0) || "";
        const last = user.last_name?.charAt(0) || "";
        if (first && last) return (first + last).toUpperCase();
        return (first || last).toUpperCase();
    };

    const isActive = (path) => {
        if (path === "/dashboard" && url === "/dashboard") return true;
        if (path !== "/dashboard" && url.startsWith(path)) return true;
        return false;
    };

    const isUserManagementActive = () => {
        return (
            url === "/users" ||
            url.startsWith("/users/") ||
            url === "/roles" ||
            url.startsWith("/roles/")
        );
    };

    const isBranchManagementActive = () => {
        return (
            url === "/branches" ||
            url.startsWith("/branches/") ||
            url === "/branch-settings" ||
            url.startsWith("/branch-settings/")
        );
    };

    const isSchoolYearManagementActive = () => {
        return (
            url === "/school-years" ||
            url.startsWith("/school-years/") ||
            url === "/academic-periods" ||
            url.startsWith("/academic-periods/") ||
            url === "/grade-levels" ||
            url.startsWith("/grade-levels/") ||
            url === "/tracks" ||
            url.startsWith("/tracks/") ||
            url === "/strands" ||
            url.startsWith("/strands/")
        );
    };

    const isStrandManagementActive = () => {
        return (
            url === "/tracks" ||
            url.startsWith("/tracks/") ||
            url === "/strands" ||
            url.startsWith("/strands/")
        );
    };

    const [sectionManagementDropdownOpen, setSectionManagementDropdownOpen] =
        useState(() => {
            return (
                url === "/sections" ||
                url.startsWith("/sections/") ||
                url === "/adviser-assignments" ||
                url.startsWith("/adviser-assignments/") ||
                url === "/section-settings" ||
                url.startsWith("/section-settings/")
            );
        });

    // Toggle function
    const toggleSectionManagementDropdown = () =>
        setSectionManagementDropdownOpen(!sectionManagementDropdownOpen);

    // Active check
    const isSectionManagementActive = () => {
        return (
            url === "/sections" ||
            url.startsWith("/sections/") ||
            url === "/adviser-assignments" ||
            url.startsWith("/adviser-assignments/") ||
            url === "/section-settings" ||
            url.startsWith("/section-settings/")
        );
    };

    // Student Information System
    const [sisDropdownOpen, setSisDropdownOpen] = useState(() => {
        return (
            url === "/students" ||
            url.startsWith("/students/") ||
            url === "/enrollments" ||
            url.startsWith("/enrollments/") ||
            url === "/section-assignment" ||
            url.startsWith("/section-assignment") ||
            url === "/enrollment-requirements" ||
            url.startsWith("/enrollment-requirements") ||
            url === "/enrollment-approval" ||
            url.startsWith("/enrollment-approval") ||
            url === "/enrollment-history" ||
            url.startsWith("/enrollment-history")
        );
    });

    const toggleSisDropdown = () => setSisDropdownOpen(!sisDropdownOpen);

    const isSisActive = () => {
        return url === "/students" || url.startsWith("/students/");
    };

    const [enrollmentManagementOpen, setEnrollmentManagementOpen] = useState(
        () => {
            return (
                url === "/enrollments" ||
                url.startsWith("/enrollments/") ||
                url === "/section-assignment" ||
                url.startsWith("/section-assignment") ||
                url === "/enrollment-requirements" ||
                url.startsWith("/enrollment-requirements") ||
                url === "/enrollment-approval" ||
                url.startsWith("/enrollment-approval") ||
                url === "/enrollment-history" ||
                url.startsWith("/enrollment-history")
            );
        },
    );
    const toggleEnrollmentManagement = () =>
        setEnrollmentManagementOpen(!enrollmentManagementOpen);
    const isEnrollmentManagementActive = () =>
        url === "/enrollments" ||
        url.startsWith("/enrollments/") ||
        url === "/section-assignment" ||
        url.startsWith("/section-assignment") ||
        url === "/enrollment-requirements" ||
        url.startsWith("/enrollment-requirements") ||
        url === "/enrollment-approval" ||
        url.startsWith("/enrollment-approval") ||
        url === "/enrollment-history" ||
        url.startsWith("/enrollment-history");

    const SidebarLink = ({ href, icon: Icon, children, badge = null }) => {
        const active = isActive(href);
        return (
            <Link
                href={href}
                className={`flex items-center px-2 py-1.5 rounded-base transition-colors group ${
                    active
                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700 hover:text-fg-brand dark:hover:text-white"
                }`}
            >
                <Icon
                    className={`shrink-0 w-5 h-5 transition duration-75 ${active ? "text-fg-brand" : "group-hover:text-fg-brand"}`}
                />
                <span className="flex-1 ms-3 whitespace-nowrap">
                    {children}
                </span>
                {badge && (
                    <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-fg-danger-strong bg-danger-soft border border-danger-subtle rounded-full">
                        {badge}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-neutral-primary-soft dark:bg-gray-800 border-r border-default dark:border-gray-700 transition-all duration-300 ease-in-out z-20 ${
                    sidebarOpen ? "w-64 lg:w-80" : "w-0 overflow-hidden"
                }`}
            >
                <div
                    className={`${sidebarOpen ? "block" : "hidden"} h-full px-3 py-4 overflow-y-auto`}
                >
                    <div className="h-16 mb-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-center space-x-2"
                        >
                            <img
                                src="/images/logo.png"
                                className="h-10"
                                alt="Logo"
                            />
                            <div className="leading-none">
                                <span className="block font-bold font-secondary text-xl text-dark dark:text-white tracking-widest">
                                    Asenso
                                    <span className="text-secondary">Tech</span>
                                </span>
                            </div>
                        </Link>
                    </div>
                    <ul className="space-y-2 font-medium">
                        <li>
                            <SidebarLink href="/dashboard" icon={HiOutlineHome}>
                                Dashboard
                            </SidebarLink>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={toggleEcommerceDropdown}
                                className={`flex items-center w-full justify-between px-2 py-1.5 rounded-base transition-colors ${
                                    ecommerceDropdownOpen
                                        ? "bg-neutral-tertiary dark:bg-gray-700"
                                        : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                            >
                                <div className="flex items-center">
                                    <HiOutlineShoppingBag className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
                                    <span className="flex-1 ms-3 text-left whitespace-nowrap">
                                        Learning Management <br /> System{" "}
                                        <span className="ml-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-gray-300 text-xs font-medium px-1.5 py-0.5 rounded-sm">
                                            Pro
                                        </span>
                                    </span>
                                </div>
                                <HiOutlineChevronDown
                                    className={`w-5 h-5 transition-transform duration-200 ${ecommerceDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            <ul
                                className={`py-2 space-y-2 ${ecommerceDropdownOpen ? "block" : "hidden"}`}
                            >
                                <li>
                                    <Link
                                        href="#"
                                        className="pl-10 flex items-center px-2 py-1.5 text-body dark:text-gray-300 rounded-base hover:bg-neutral-tertiary dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Products
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="pl-10 flex items-center px-2 py-1.5 text-body dark:text-gray-300 rounded-base hover:bg-neutral-tertiary dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Billing
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="pl-10 flex items-center px-2 py-1.5 text-body dark:text-gray-300 rounded-base hover:bg-neutral-tertiary dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Invoice
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <SidebarLink
                                href="/kanban"
                                icon={HiOutlineViewBoards}
                            >
                                Kanban{" "}
                                <span className="ml-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-gray-300 text-xs font-medium px-1.5 py-0.5 rounded-sm">
                                    Pro
                                </span>
                            </SidebarLink>
                        </li>
                        <li>
                            <SidebarLink
                                href="/inbox"
                                icon={HiOutlineInbox}
                                badge="2"
                            >
                                Messages
                            </SidebarLink>
                        </li>
                        {/* User Management */}
                        <li>
                            <button
                                type="button"
                                onClick={toggleUserManagementDropdown}
                                className={`flex items-center w-full justify-between px-2 py-1.5 rounded-base transition-colors ${
                                    userManagementDropdownOpen ||
                                    isUserManagementActive()
                                        ? "bg-neutral-tertiary dark:bg-gray-700"
                                        : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                            >
                                <div className="flex items-center">
                                    <HiOutlineUsers className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
                                    <span className="flex-1 ms-3 text-left whitespace-nowrap">
                                        User Management
                                    </span>
                                </div>
                                <HiOutlineChevronDown
                                    className={`w-5 h-5 transition-transform duration-200 ${userManagementDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            <ul
                                className={`py-2 space-y-2 ${userManagementDropdownOpen ? "block" : "hidden"}`}
                            >
                                <li>
                                    <Link
                                        href="/users"
                                        className={`pl-10 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                            url === "/users" ||
                                            url.startsWith("/users/")
                                                ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        User Accounts
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/roles"
                                        className={`pl-10 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                            url === "/roles" ||
                                            url.startsWith("/roles/")
                                                ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        Role Management
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        {/* ========== Core Module Management ========== */}
                        <li>
                            <button
                                type="button"
                                onClick={toggleCoreModule}
                                className={`flex items-center w-full justify-between px-2 py-1.5 rounded-base transition-colors ${
                                    coreModuleOpen ||
                                    isBranchManagementActive() ||
                                    isSchoolYearManagementActive()
                                        ? "bg-neutral-tertiary dark:bg-gray-700"
                                        : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                            >
                                <div className="flex items-center">
                                    <HiOutlineOfficeBuilding className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
                                    <span className="flex-1 ms-3 text-left whitespace-nowrap">
                                        Core Module Management
                                    </span>
                                </div>
                                <HiOutlineChevronDown
                                    className={`w-5 h-5 transition-transform duration-200 ${coreModuleOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            <ul
                                className={`py-2 space-y-2 ${coreModuleOpen ? "block" : "hidden"}`}
                            >
                                {/* Branch Management Sub-dropdown */}
                                <li>
                                    <button
                                        type="button"
                                        onClick={toggleBranchManagementDropdown}
                                        className={`flex items-center w-full justify-between pl-6 pr-2 py-1.5 rounded-base transition-colors ${
                                            branchManagementDropdownOpen ||
                                            isBranchManagementActive()
                                                ? "bg-neutral-tertiary dark:bg-gray-700"
                                                : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                        } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                                    >
                                        <span className="flex-1 text-left whitespace-nowrap">
                                            Branch Management
                                        </span>
                                        <HiOutlineChevronDown
                                            className={`w-4 h-4 transition-transform duration-200 ${branchManagementDropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <ul
                                        className={`py-1 space-y-1 ${branchManagementDropdownOpen ? "block" : "hidden"}`}
                                    >
                                        <li>
                                            <Link
                                                href="/branches"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url === "/branches" ||
                                                    url.startsWith("/branches/")
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Branch
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/branch-settings"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url ===
                                                        "/branch-settings" ||
                                                    url.startsWith(
                                                        "/branch-settings/",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Branch Settings
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                {/* School Management Sub-dropdown */}
                                <li>
                                    <button
                                        type="button"
                                        onClick={
                                            toggleSchoolYearManagementDropdown
                                        }
                                        className={`flex items-center w-full justify-between pl-6 pr-2 py-1.5 rounded-base transition-colors ${
                                            schoolYearManagementDropdownOpen ||
                                            isSchoolYearManagementActive()
                                                ? "bg-neutral-tertiary dark:bg-gray-700"
                                                : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                        } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                                    >
                                        <span className="flex-1 text-left whitespace-nowrap">
                                            School Management
                                        </span>
                                        <HiOutlineChevronDown
                                            className={`w-4 h-4 transition-transform duration-200 ${schoolYearManagementDropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <ul
                                        className={`py-1 space-y-1 ${schoolYearManagementDropdownOpen ? "block" : "hidden"}`}
                                    >
                                        <li>
                                            <Link
                                                href="/school-years"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url === "/school-years" ||
                                                    url.startsWith(
                                                        "/school-years/",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                School Years
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/academic-periods"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url ===
                                                        "/academic-periods" ||
                                                    url.startsWith(
                                                        "/academic-periods/",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Academic Periods
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/branch-settings"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url ===
                                                        "/branch-settings" ||
                                                    url.startsWith(
                                                        "/branch-settings/",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Academic Calendar
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/grade-levels"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url === "/grade-levels" ||
                                                    url.startsWith(
                                                        "/grade-levels/",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Grade Levels
                                            </Link>
                                        </li>

                                        {/* Strand Management nested inside School Management */}
                                        <li>
                                            <button
                                                type="button"
                                                onClick={
                                                    toggleStrandManagementDropdown
                                                }
                                                className={`flex items-center w-full justify-between pl-14 pr-2 py-1.5 rounded-base transition-colors ${
                                                    strandManagementDropdownOpen ||
                                                    isStrandManagementActive()
                                                        ? "bg-neutral-tertiary dark:bg-gray-700"
                                                        : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                                            >
                                                <span className="flex-1 text-left whitespace-nowrap">
                                                    Strand Management
                                                </span>
                                                <HiOutlineChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${strandManagementDropdownOpen ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                            <ul
                                                className={`py-1 space-y-1 ${strandManagementDropdownOpen ? "block" : "hidden"}`}
                                            >
                                                <li>
                                                    <Link
                                                        href="/tracks"
                                                        className={`pl-20 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                            url === "/tracks" ||
                                                            url.startsWith(
                                                                "/tracks/",
                                                            )
                                                                ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                                : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        Tracks
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href="/strands"
                                                        className={`pl-20 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                            url ===
                                                                "/strands" ||
                                                            url.startsWith(
                                                                "/strands/",
                                                            )
                                                                ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                                : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        Strands
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>

                                        {/* Section Management nested inside School Management */}
                                        <li>
                                            <button
                                                type="button"
                                                onClick={
                                                    toggleSectionManagementDropdown
                                                }
                                                className={`flex items-center w-full justify-between pl-14 pr-2 py-1.5 rounded-base transition-colors ${
                                                    sectionManagementDropdownOpen ||
                                                    isSectionManagementActive()
                                                        ? "bg-neutral-tertiary dark:bg-gray-700"
                                                        : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                                            >
                                                <span className="flex-1 text-left whitespace-nowrap">
                                                    Section Management
                                                </span>
                                                <HiOutlineChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${
                                                        sectionManagementDropdownOpen
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                            <ul
                                                className={`py-1 space-y-1 ${
                                                    sectionManagementDropdownOpen
                                                        ? "block"
                                                        : "hidden"
                                                }`}
                                            >
                                                <li>
                                                    <Link
                                                        href="/sections"
                                                        className={`pl-20 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                            url ===
                                                                "/sections" ||
                                                            url.startsWith(
                                                                "/sections/",
                                                            )
                                                                ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                                : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        Sections
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href="/adviser-assignments"
                                                        className={`pl-20 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                            url ===
                                                                "/adviser-assignments" ||
                                                            url.startsWith(
                                                                "/adviser-assignments/",
                                                            )
                                                                ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                                : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        Adviser Assignment
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link
                                                        href="/section-settings"
                                                        className={`pl-20 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                            url ===
                                                                "/section-settings" ||
                                                            url.startsWith(
                                                                "/section-settings/",
                                                            )
                                                                ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                                : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        Section Settings
                                                    </Link>
                                                </li> */}
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        {/* Student Information System */}
                        <li>
                            <button
                                type="button"
                                onClick={toggleSisDropdown}
                                className={`flex items-center w-full justify-between px-2 py-1.5 rounded-base transition-colors ${
                                    sisDropdownOpen || isSisActive()
                                        ? "bg-neutral-tertiary dark:bg-gray-700"
                                        : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                            >
                                <div className="flex items-center">
                                    <HiOutlineUserGroup className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
                                    <span className="flex-1 ms-3 text-left whitespace-nowrap">
                                        Student Information System
                                    </span>
                                </div>
                                <HiOutlineChevronDown
                                    className={`w-5 h-5 transition-transform duration-200 ${sisDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            <ul
                                className={`py-2 space-y-2 ${sisDropdownOpen ? "block" : "hidden"}`}
                            >
                                <li>
                                    <Link
                                        href="/students"
                                        className={`pl-6 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                            url === "/students" ||
                                            url.startsWith("/students/")
                                                ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        Student Directory
                                    </Link>
                                </li>

                                {/* Enrollment Management */}
                                <li>
                                    <button
                                        type="button"
                                        onClick={toggleEnrollmentManagement}
                                        className={`flex items-center w-full justify-between pl-6 pr-2 py-1.5 rounded-base transition-colors ${
                                            enrollmentManagementOpen ||
                                            isEnrollmentManagementActive()
                                                ? "bg-neutral-tertiary dark:bg-gray-700"
                                                : "hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                        } text-body dark:text-gray-300 hover:text-fg-brand dark:hover:text-white group`}
                                    >
                                        <span className="flex-1 text-left whitespace-nowrap">
                                            Enrollment Management
                                        </span>
                                        <HiOutlineChevronDown
                                            className={`w-5 h-5 transition-transform duration-200 ${enrollmentManagementOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <ul
                                        className={`py-2 space-y-2 ${enrollmentManagementOpen ? "block" : "hidden"}`}
                                    >
                                        {/* <li>
                                            <Link
                                                href="/enrollments/create"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url ===
                                                    "/enrollments/create"
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Enrollment Processing
                                            </Link>
                                        </li> */}
                                        <li>
                                            <Link
                                                href="/enrollments"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url === "/enrollments" ||
                                                    url.startsWith(
                                                        "/enrollments/",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Enrollment Records
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/section-assignment"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url ===
                                                        "/section-assignment" ||
                                                    url.startsWith(
                                                        "/section-assignment",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Section Assignment
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/enrollment-requirements"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url ===
                                                        "/enrollment-requirements" ||
                                                    url.startsWith(
                                                        "/enrollment-requirements",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Enrollment Requirements
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/enrollment-approval"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url ===
                                                        "/enrollment-approval" ||
                                                    url.startsWith(
                                                        "/enrollment-approval",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Enrollment Approval
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/enrollment-history"
                                                className={`pl-14 flex items-center px-2 py-1.5 rounded-base transition-colors ${
                                                    url ===
                                                        "/enrollment-history" ||
                                                    url.startsWith(
                                                        "/enrollment-history",
                                                    )
                                                        ? "bg-neutral-tertiary dark:bg-gray-700 text-fg-brand dark:text-white"
                                                        : "text-body dark:text-gray-300 hover:bg-neutral-tertiary dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                Enrollment History
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className="space-y-2 font-medium border-t border-default dark:border-gray-700 pt-4 mt-4">
                        <li>
                            <SidebarLink
                                href="/documentation"
                                icon={HiOutlineDocumentText}
                            >
                                Documentation
                            </SidebarLink>
                        </li>
                        <li>
                            <SidebarLink
                                href="/support"
                                icon={HiOutlineSupport}
                            >
                                Support
                            </SidebarLink>
                        </li>
                        <li>
                            <SidebarLink
                                href="/pro-version"
                                icon={HiOutlineSparkles}
                            >
                                PRO version
                            </SidebarLink>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-15 lg:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main content */}
            <div
                className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-80 ml-64" : "ml-0"}`}
            >
                <nav
                    className={`fixed top-0 right-0 z-10 bg-neutral-primary dark:bg-gray-800 border-b border-default dark:border-gray-700 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:left-80 left-64" : "left-0"}`}
                >
                    <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleSidebar}
                                type="button"
                                className="text-heading dark:text-white bg-transparent hover:bg-neutral-secondary-medium dark:hover:bg-gray-700 focus:ring-4 focus:ring-neutral-tertiary dark:focus:ring-gray-600 rounded-base text-sm p-2 transition-transform hover:scale-105"
                                aria-label="Toggle sidebar"
                            >
                                <HiOutlineMenu className="w-6 h-6" />
                            </button>
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-3 lg:hidden"
                            >
                                <img
                                    src="images/logo.png"
                                    className="h-10"
                                    alt="Logo"
                                />
                                <div className="leading-none">
                                    <span className="block font-bold font-secondary text-xl text-dark dark:text-white tracking-widest">
                                        Asenso
                                        <span className="text-secondary">
                                            Tech
                                        </span>
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link className="flex items-center gap-2 text-body dark:text-gray-300 hover:text-heading dark:hover:text-white transition-colors">
                                <HiOutlineMail className="w-5 h-5" />
                                <span>Messages</span>
                            </Link>
                            <Link className="flex items-center gap-2 text-body dark:text-gray-300 hover:text-heading dark:hover:text-white transition-colors">
                                <HiOutlineBell className="w-5 h-5" />
                                <span>Notifications</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                onClick={toggleDarkMode}
                                className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-tertiary dark:focus:ring-gray-500"
                                style={{
                                    backgroundColor: isDarkMode
                                        ? "#374151"
                                        : "#E5E7EB",
                                }}
                                aria-label="Toggle dark mode"
                            >
                                <span
                                    className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${isDarkMode ? "translate-x-7" : "translate-x-1"}`}
                                >
                                    {isDarkMode ? (
                                        <HiOutlineMoon className="h-3.5 w-3.5 text-gray-700" />
                                    ) : (
                                        <HiOutlineSun className="h-3.5 w-3.5 text-yellow-500" />
                                    )}
                                </span>
                            </button>
                            <button
                                ref={buttonRef}
                                type="button"
                                onClick={toggleUserDropdown}
                                className="flex text-sm bg-neutral-primary dark:bg-gray-700 rounded-full focus:ring-4 focus:ring-neutral-tertiary dark:focus:ring-gray-600 transition-colors hover:scale-105 transform"
                                aria-expanded={userDropdownOpen}
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-medium text-lg">
                                    {getUserInitials()}
                                </div>
                            </button>
                            {userDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute top-14 right-4 z-50 bg-neutral-primary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base shadow-lg w-44"
                                >
                                    <div className="px-4 py-3 text-sm border-b border-default dark:border-gray-700">
                                        <span className="block text-heading dark:text-white font-medium">
                                            {user?.first_name +
                                                " " +
                                                user?.last_name || "User Name"}
                                        </span>
                                        <span className="block text-body dark:text-gray-400 truncate">
                                            {user?.email || "user@example.com"}
                                        </span>
                                    </div>
                                    <ul className="p-2 text-sm text-body dark:text-gray-300 font-medium">
                                        <li>
                                            <Link
                                                href={route("profile.edit")}
                                                className="inline-flex items-center gap-2 w-full p-2 hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700 hover:text-heading dark:hover:text-white rounded"
                                            >
                                                <HiOutlineUser className="w-4 h-4" />{" "}
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="inline-flex items-center gap-2 w-full p-2 hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700 hover:text-heading dark:hover:text-white rounded"
                                            >
                                                <HiOutlineLogout className="w-4 h-4" />{" "}
                                                Sign out
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            <button
                                onClick={toggleMobileMenu}
                                type="button"
                                className="inline-flex items-center p-2 w-10 h-10 justify-center text-body dark:text-gray-300 rounded-base md:hidden hover:bg-neutral-secondary-soft dark:hover:bg-gray-700 focus:ring-2 focus:ring-neutral-tertiary"
                            >
                                {showingNavigationDropdown ? (
                                    <HiOutlineX className="w-6 h-6" />
                                ) : (
                                    <HiOutlineMenu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                        <div
                            className={`${showingNavigationDropdown ? "block" : "hidden"} w-full md:hidden mt-4`}
                        >
                            <ul className="flex flex-col p-4 font-medium border border-default dark:border-gray-700 rounded-base bg-neutral-primary dark:bg-gray-800">
                                <li>
                                    <Link
                                        className="flex items-center gap-3 py-2 px-3 text-body dark:text-gray-300 rounded hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700"
                                        onClick={() =>
                                            setShowingNavigationDropdown(false)
                                        }
                                    >
                                        <HiOutlineMail className="w-5 h-5" />{" "}
                                        Messages
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="flex items-center gap-3 py-2 px-3 text-body dark:text-gray-300 rounded hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700"
                                        onClick={() =>
                                            setShowingNavigationDropdown(false)
                                        }
                                    >
                                        <HiOutlineBell className="w-5 h-5" />{" "}
                                        Notifications
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <main className="pt-20">
                    <div className="p-4">{children}</div>
                </main>
            </div>
        </div>
    );
}
