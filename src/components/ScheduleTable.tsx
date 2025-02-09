import React from 'react';
import type { FC } from 'react';
import type { ScheduleTableProps } from '../types';
import { calculateMonthlyHours, calculateTotalWorkDays } from '../utils/scheduleUtils';

const ScheduleTable: FC<ScheduleTableProps> = ({ schedule, shifts, weeks, days }) => {
    // Her periyot için haftalık verileri grupla
    const tableData = schedule.map((employeeSchedule, employeeIndex) => {
        const weeklyData = [];
        for (let weekIndex = 0; weekIndex < employeeSchedule.length; weekIndex++) {
            weeklyData.push({
                weekLabel: weeks[weekIndex],
                days: employeeSchedule[weekIndex]
            });
        }
        return {
            employeeId: employeeIndex + 1,
            weeks: weeklyData,
            totalWorkDays: calculateTotalWorkDays(employeeSchedule),
            monthlyHours: calculateMonthlyHours(employeeSchedule, shifts)
        };
    });

    return (
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                                Çalışan
                            </th>
                            {weeks.map((week, weekIndex) => (
                                <React.Fragment key={weekIndex}>
                                    {days.map((day, dayIndex) => (
                                        <th
                                            key={`${weekIndex}-${dayIndex}`}
                                            scope="col"
                                            className="px-3 py-2 text-center text-sm font-semibold text-gray-900"
                                        >
                                            <div className="whitespace-nowrap">{week}</div>
                                            <div className="text-xs text-gray-500">{day}</div>
                                        </th>
                                    ))}
                                </React.Fragment>
                            ))}
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                Toplam Saat
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {tableData.map((employee) => (
                            <tr key={employee.employeeId} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                    <div>Çalışan {employee.employeeId}</div>
                                    <div className="text-xs text-gray-500">
                                        {employee.totalWorkDays} gün çalışma
                                    </div>
                                </td>
                                {employee.weeks.map((week, weekIndex) => (
                                    <React.Fragment key={weekIndex}>
                                        {week.days.map((shift, dayIndex) => (
                                            <td
                                                key={`${weekIndex}-${dayIndex}`}
                                                className={`${shifts[shift].color} whitespace-nowrap px-3 py-4 text-sm text-gray-500 transition-colors duration-150`}
                                            >
                                                <div className="font-semibold text-gray-900">{shift}</div>
                                                <div className="text-xs">
                                                    {shifts[shift].startTime} - {shifts[shift].endTime}
                                                </div>
                                            </td>
                                        ))}
                                    </React.Fragment>
                                ))}
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-center font-medium text-gray-900">
                                    {employee.monthlyHours}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ScheduleTable;