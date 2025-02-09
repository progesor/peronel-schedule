// types/index.ts

export type ShiftCode = 'G' | 'S1' | 'S2' | 'A' | 'D' | 'X';

export interface Shift {
    name: string;
    color: string;
    duration: number;
    startTime: string;
    endTime: string;
}

export interface ShiftMap {
    [key: string]: Shift;
}

export interface EmployeesPerShift {
    [key: string]: number;
}

export type WeekSchedule = ShiftCode[];
export type MonthSchedule = WeekSchedule[];
export type FullSchedule = MonthSchedule[];

export interface ShiftInfoProps {
    shifts: ShiftMap;
}

export interface ScheduleTableProps {
    schedule: FullSchedule;
    shifts: ShiftMap;
    weeks: string[];
    days: string[];
}

export interface ShiftScheduleAppProps {
    // Add any app-level props here if needed
}