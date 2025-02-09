// constants/shiftConstants.ts
import { ShiftMap, EmployeesPerShift } from '../types';

export const shifts: ShiftMap = {
    G: {
        name: 'Gece (00:00-09:00)',
        color: 'bg-purple-200 hover:bg-purple-300',
        duration: 9 * 60,
        startTime: '00:00',
        endTime: '09:00'
    },
    S1: {
        name: 'Sabah (09:00-18:00)',
        color: 'bg-blue-200 hover:bg-blue-300',
        duration: 9 * 60,
        startTime: '09:00',
        endTime: '18:00'
    },
    S2: {
        name: 'Sabah2 (10:00-19:10)',
        color: 'bg-green-200 hover:bg-green-300',
        duration: 9 * 60,
        startTime: '10:00',
        endTime: '19:00'
    },
    A: {
        name: 'Akşam (15:00-00:00)',
        color: 'bg-yellow-200 hover:bg-yellow-300',
        duration: 9 * 60,
        startTime: '15:00',
        endTime: '00:00'
    },
    D: {
        name: 'Davul (19:00-04:00)',
        color: 'bg-red-200 hover:bg-red-300',
        duration: 9 * 60,
        startTime: '19:00',
        endTime: '04:00'
    },
    X: {
        name: 'İzin',
        color: 'bg-gray-200 hover:bg-gray-300',
        duration: 0,
        startTime: '-',
        endTime: '-'
    }
};

export const employeesPerShift: EmployeesPerShift = {
    G: 3,  // Gece
    S1: 2, // Sabah
    S2: 2, // Sabah2
    A: 6,  // Akşam
    D: 3   // Davul
};

export const weeks: string[] = ['Hafta 1', 'Hafta 2', 'Hafta 3', 'Hafta 4'];
export const days: string[] = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];