import type { FC } from 'react';
import type { ShiftInfoProps } from '../types';

const ShiftInfo: FC<ShiftInfoProps> = ({ shifts }) => {
    return (
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Vardiya Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(shifts).map(([key, { name, color }]) => (
                    <div
                        key={key}
                        className={`${color} p-3 rounded-lg shadow-sm transition-all duration-200 flex items-center space-x-2`}
                    >
                        <span className="font-medium">{key}:</span>
                        <span>{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftInfo;