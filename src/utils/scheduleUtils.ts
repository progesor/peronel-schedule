// utils/scheduleUtils.ts
import { FullSchedule, ShiftCode, ShiftMap, MonthSchedule } from '../types';

const shiftTypes: ShiftCode[] = ['G', 'S1', 'S2', 'A', 'D'];

export const generateSchedule = (totalEmployees: number, totalWeeks: number = 8): FullSchedule => {
    // Her çalışan için temel 4 haftalık planı oluştur
    const baseSchedule = Array(totalEmployees).fill(null).map((_, employeeIndex) => {
        const schedulePattern: MonthSchedule = [];

        // İlk 4 hafta için vardiya planı
        for (let week = 0; week < 4; week++) {
            const weekSchedule: ShiftCode[] = [];
            for (let day = 0; day < 7; day++) {
                if ((day + employeeIndex) % 7 < 5) { // 5 gün çalışma, 2 gün izin
                    const shiftIndex = (employeeIndex + week) % shiftTypes.length;
                    weekSchedule.push(shiftTypes[shiftIndex]);
                } else {
                    weekSchedule.push('X');
                }
            }
            schedulePattern.push(weekSchedule);
        }
        return schedulePattern;
    });

    // İstenen toplam hafta sayısı için rotasyonlu planı oluştur
    const periodsCount = Math.ceil(totalWeeks / 4);
    const fullSchedule: FullSchedule = [];

    // Her çalışan için tam programı oluştur
    for (let employeeIndex = 0; employeeIndex < totalEmployees; employeeIndex++) {
        const employeeFullSchedule: MonthSchedule = [];

        // Her periyot için
        for (let period = 0; period < periodsCount; period++) {
            // Rotasyon indeksini hesapla
            const rotationIndex = (employeeIndex + period) % totalEmployees;

            // İlgili çalışanın 4 haftalık planını al
            const periodSchedule = baseSchedule[rotationIndex];

            // Bu periyottaki hafta sayısını hesapla
            const weeksInThisPeriod = Math.min(4, totalWeeks - period * 4);

            // Sadece gerekli haftaları ekle
            for (let week = 0; week < weeksInThisPeriod; week++) {
                employeeFullSchedule.push(periodSchedule[week]);
            }
        }

        fullSchedule.push(employeeFullSchedule);
    }

    return fullSchedule;
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
    return Math.floor(weekIndex / 4) + 1;
};