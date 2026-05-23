import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    HiOutlineUsers,
    HiOutlineAcademicCap,
    HiOutlineBookOpen,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlineClipboardList,
    HiOutlineChartBar,
} from "react-icons/hi";

export default function Dashboard() {
    // Sample data for stats
    const stats = [
        {
            title: "Total Students",
            value: "1,234",
            icon: HiOutlineUsers,
            color: "bg-blue-500",
        },
        {
            title: "Total Teachers",
            value: "86",
            icon: HiOutlineAcademicCap,
            color: "bg-green-500",
        },
        {
            title: "Active Courses",
            value: "24",
            icon: HiOutlineBookOpen,
            color: "bg-purple-500",
        },
        {
            title: "Attendance Rate",
            value: "94%",
            icon: HiOutlineCalendar,
            color: "bg-yellow-500",
        },
    ];

    // Recent enrollments
    const recentEnrollments = [
        {
            student: "John Doe",
            course: "Mathematics 101",
            date: "2024-03-15",
            status: "Active",
        },
        {
            student: "Jane Smith",
            course: "Physics 202",
            date: "2024-03-14",
            status: "Active",
        },
        {
            student: "Mike Johnson",
            course: "Chemistry 101",
            date: "2024-03-13",
            status: "Pending",
        },
        {
            student: "Sarah Williams",
            course: "Biology 201",
            date: "2024-03-12",
            status: "Active",
        },
    ];

    // Upcoming events
    const upcomingEvents = [
        {
            title: "Parent-Teacher Meeting",
            date: "Mar 25, 2024",
            time: "10:00 AM",
            location: "Auditorium",
        },
        {
            title: "Science Fair",
            date: "Apr 2, 2024",
            time: "9:00 AM",
            location: "Gymnasium",
        },
        {
            title: "Final Exams Start",
            date: "Apr 10, 2024",
            time: "8:00 AM",
            location: "All Classrooms",
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Dashboard
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-all hover:shadow-lg"
                            >
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div
                                            className={`shrink-0 rounded-md p-3 ${stat.color}`}
                                        >
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                    {stat.title}
                                                </dt>
                                                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                    {stat.value}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts and Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Attendance Chart (Placeholder) */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <HiOutlineChartBar className="mr-2 h-5 w-5 text-gray-500" />
                                    Attendance Overview (Last 7 Days)
                                </h3>
                                <div className="h-64 flex items-end space-x-2">
                                    {[85, 90, 78, 92, 88, 95, 89].map(
                                        (value, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 flex flex-col items-center"
                                            >
                                                <div
                                                    className="w-full bg-blue-200 dark:bg-blue-900 rounded-t-lg transition-all duration-500 hover:bg-blue-300 dark:hover:bg-blue-800"
                                                    style={{
                                                        height: `${value}%`,
                                                    }}
                                                >
                                                    <div className="text-center text-xs text-gray-600 dark:text-gray-300 mt-1">
                                                        {value}%
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    {
                                                        [
                                                            "Mon",
                                                            "Tue",
                                                            "Wed",
                                                            "Thu",
                                                            "Fri",
                                                            "Sat",
                                                            "Sun",
                                                        ][i]
                                                    }
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <HiOutlineCalendar className="mr-2 h-5 w-5 text-gray-500" />
                                    Upcoming Events
                                </h3>
                                <div className="flow-root">
                                    <ul className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                                        {upcomingEvents.map((event, idx) => (
                                            <li key={idx} className="py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {event.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {event.date} •{" "}
                                                            {event.time}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                                            📍 {event.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Enrollments Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                <HiOutlineClipboardList className="mr-2 h-5 w-5 text-gray-500" />
                                Recent Enrollments
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Course
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {recentEnrollments.map(
                                            (enrollment, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {enrollment.student}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {enrollment.course}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {enrollment.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                enrollment.status ===
                                                                "Active"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                            }`}
                                                        >
                                                            {enrollment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-right">
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    View all enrollments →
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Additional Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-md p-3">
                                    <HiOutlineUserGroup className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Manage Students
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Add, edit or view student records
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="shrink-0 bg-pink-100 dark:bg-pink-900 rounded-md p-3">
                                    <HiOutlineBookOpen className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Course Catalog
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Browse and update courses
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                                    <HiOutlineCalendar className="h-6 w-6 text-green-600 dark:text-green-300" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Attendance
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Mark and review attendance
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
