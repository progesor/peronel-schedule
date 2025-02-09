import React, { useState } from 'react';
import type { FC } from 'react';
import { shifts, employeesPerShift, days } from '../constants/shiftConstants';
import { generateSchedule, getRotationPeriod } from '../utils/scheduleUtils';
import type { ShiftScheduleAppProps } from '../types';
import ShiftInfo from './ShiftInfo';
import ScheduleTable from './ScheduleTable';

const ShiftScheduleApp: FC<ShiftScheduleAppProps> = () => {
    const [totalWeeks, setTotalWeeks] = useState<number>(8);
    const totalEmployees = 23; // Sabit çalışan sayısı
    const schedule = generateSchedule(totalEmployees, totalWeeks);

    // Hafta etiketlerini oluştur
    const weeks = Array.from({ length: totalWeeks }, (_, i) => {
        const period = getRotationPeriod(i);
        return `${period}. Periyot - Hafta ${(i % 4) + 1}`;
    });

    const handleWeeksChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTotalWeeks(Number(event.target.value));
    };

    // Günlük minimum personel gereksinimlerini göster
    const dailyRequirements = {
        G: 3,  // Gece
        S1: 2, // Sabah
        S2: 2, // Sabah2
        A: 6,  // Akşam
        D: 3   // Davul
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Vardiya Çizelgesi</h1>
                    <p className="text-gray-600">
                        {totalEmployees} çalışan için optimize edilmiş vardiya planı
                    </p>
                    <div className="mt-4">
                        <label htmlFor="weeks" className="block text-sm font-medium text-gray-700">
                            Gösterilecek Hafta Sayısı
                        </label>
                        <select
                            id="weeks"
                            value={totalWeeks}
                            onChange={handleWeeksChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value={4}>4 Hafta</option>
                            <option value={8}>8 Hafta</option>
                            <option value={12}>12 Hafta</option>
                            <option value={16}>16 Hafta</option>
                        </select>
                    </div>
                </header>

                <ShiftInfo shifts={shifts} />

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Vardiya Gereksinimleri</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {Object.entries(dailyRequirements).map(([shift, count]) => (
                            <div key={shift} className={`${shifts[shift].color} rounded-lg shadow p-3`}>
                                <div className="font-medium text-gray-900">{shifts[shift].name}</div>
                                <div className="text-sm text-gray-600">Günlük {count} kişi gerekli</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Atanan: {employeesPerShift[shift]} kişi
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <ScheduleTable
                    schedule={schedule}
                    shifts={shifts}
                    weeks={weeks}
                    days={days}
                />

                <footer className="mt-6 text-sm text-gray-600">
                    <p>* Her çalışan haftada 5 gün çalışıp 2 gün izin kullanmaktadır.</p>
                    <p>* Her 4 haftada bir vardiya rotasyonu uygulanmaktadır.</p>
                    <p>* Rotasyon sayesinde izin günleri ve vardiyalar düzenli olarak değişmektedir.</p>
                    <p>* Toplam {totalEmployees} çalışan ile minimum personel gereksinimleri karşılanmaktadır.</p>
                </footer>
            </div>
        </div>
    );
};

export default ShiftScheduleApp;