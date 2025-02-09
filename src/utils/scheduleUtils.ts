// utils/scheduleUtils.ts
import { FullSchedule, ShiftCode, ShiftMap, MonthSchedule } from '../types';

const shiftTypes: ShiftCode[] = ['G', 'A','S1', 'S2',  'D'];

const dailyRequirements = {
    G: 3,  // Gece
    S1: 2, // Sabah
    S2: 2, // Sabah2
    A: 6,  // Akşam
    D: 3   // Davul
};

export const generateSchedule = (totalEmployees: number, totalWeeks: number = 8): FullSchedule => {
    const schedule: FullSchedule = [];

    // Her çalışan için plan oluştur
    for (let employeeIndex = 0; employeeIndex < totalEmployees; employeeIndex++) {
        const employeeSchedule: MonthSchedule = [];

        // Her hafta için plan oluştur
        for (let week = 0; week < totalWeeks; week++) {
            const weekSchedule: ShiftCode[] = Array(7).fill('X');

            // Bu haftaki vardiyayı belirle (haftalık rotasyon)
            const shiftIndex = (employeeIndex + week) % shiftTypes.length;
            const currentShift = shiftTypes[shiftIndex];

            // İzin günlerini belirle
            const offDay1 = (employeeIndex + week) % 7;
            const offDay2 = (offDay1 + 1) % 7;

            // 5 gün çalışma, 2 gün izin
            for (let day = 0; day < 7; day++) {
                if (day !== offDay1 && day !== offDay2) {
                    weekSchedule[day] = currentShift;
                }
            }

            employeeSchedule.push(weekSchedule);
        }

        schedule.push(employeeSchedule);
    }

    // Her gün için minimum gereksinimleri kontrol et ve düzelt
    balanceSchedule(schedule, totalWeeks);

    return schedule;
};

const balanceSchedule = (schedule: FullSchedule, totalWeeks: number) => {
    const MAX_ATTEMPTS = 100;

    for (let week = 0; week < totalWeeks; week++) {
        for (let day = 0; day < 7; day++) {
            let attempts = 0;
            while (!isDailyRequirementsMet(schedule, week, day) && attempts < MAX_ATTEMPTS) {
                adjustDailyShifts(schedule, week, day);
                attempts++;
            }
        }
    }
};

const isDailyRequirementsMet = (schedule: FullSchedule, week: number, day: number): boolean => {
    const counts = countDailyShifts(schedule, week, day);
    return Object.entries(dailyRequirements).every(([shift, required]) =>
        counts[shift as ShiftCode] >= required
    );
};

const countDailyShifts = (schedule: FullSchedule, week: number, day: number) => {
    const counts: Record<ShiftCode, number> = {
        G: 0, S1: 0, S2: 0, A: 0, D: 0, X: 0
    };

    schedule.forEach(employeeSchedule => {
        const shift = employeeSchedule[week]?.[day];
        if (shift) counts[shift]++;
    });

    return counts;
};

const adjustDailyShifts = (schedule: FullSchedule, week: number, day: number) => {
    const counts = countDailyShifts(schedule, week, day);

    Object.entries(dailyRequirements).forEach(([shift, required]) => {
        if (counts[shift as ShiftCode] < required) {
            let assigned = false;
            let attempts = 0;
            const MAX_ASSIGN_ATTEMPTS = 50;

            while (!assigned && attempts < MAX_ASSIGN_ATTEMPTS) {
                assigned = findAndAssignEmployee(schedule, week, day, shift as ShiftCode);
                attempts++;
            }
        }
    });
};

const findAndAssignEmployee = (
    schedule: FullSchedule,
    week: number,
    day: number,
    neededShift: ShiftCode
): boolean => {
    const counts = countDailyShifts(schedule, week, day);

    for (const employeeSchedule of schedule) {
        const currentShift = employeeSchedule[week][day];

        // İzin günü veya fazla personeli olan vardiyadan seç
        if (currentShift !== 'X' && currentShift !== neededShift &&
            counts[currentShift] > dailyRequirements[currentShift]) {

            // Haftanın diğer günlerindeki vardiyaları kontrol et
            const weekShifts = employeeSchedule[week].filter(s => s !== 'X');
            const uniqueShifts = new Set(weekShifts);

            // Eğer bu hafta sadece bir tip vardiyada çalışıyorsa değiştirme
            if (uniqueShifts.size <= 1 && weekShifts.length <= 5) {
                continue;
            }

            employeeSchedule[week][day] = neededShift;
            return true;
        }
    }

    return false;
};

export const calculateMonthlyHours = (employeeSchedule: MonthSchedule, shifts: ShiftMap): string => {
    let totalMinutes = 0;
    employeeSchedule.forEach(week => {
        week.forEach(shift => {
            totalMinutes += shifts[shift].duration;
        });
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

export const calculateTotalWorkDays = (employeeSchedule: MonthSchedule): number => {
    return employeeSchedule.flat().filter(shift => shift !== 'X').length;
};

export const getRotationPeriod = (weekIndex: number): number => {
    return weekIndex + 1;
};