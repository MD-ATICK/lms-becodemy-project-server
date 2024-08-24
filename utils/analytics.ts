import { PrismaClient } from '@prisma/client';


// note : 
// date.toLocaleDateString('default' or [])
// between default and [] different is default use en-us locale time and [] use browser locale time. like me show bd time. 
// if use []. [] is use for hours , min work.

type lastYearDataProps = {
    month: string;
    count: number;
};

export async function last12MonthsData<T extends keyof PrismaClient>(model: PrismaClient[T]) {

    const lastYearData: lastYearDataProps[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1); // First day of the month
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i - 1), 0); // Last day of the month
        const monthYear = startDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });


        const count = await (model as any).count({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate
                }
            }
        });

        lastYearData.push({ month: monthYear, count });
    }

    return lastYearData;
}


interface last30DaysDataProps {
    day: string,
    count: number
}

export async function last30DaysData<T extends keyof PrismaClient>(model: PrismaClient[T]) {

    const last30DaysData: last30DaysDataProps[] = [];
    const currentDate = new Date();

    for (let i = 30; i >= 0; i--) {
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i); // First day of the month
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (i - 1)); // Last day of the month
        const dayName = startDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });


        const count = await (model as any).count({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate
                }
            }
        });

        last30DaysData.push({ day: dayName, count });
    }

    console.log(last30DaysData)
    return last30DaysData;
}


interface last24HoursDataProps {
    hour: string,
    count: number
}

export async function last24hoursData<T extends keyof PrismaClient>(model: PrismaClient[T]) {

    const last24HoursData: last24HoursDataProps[] = [];
    const currentDate = new Date();

    for (let i = 24; i >= 0; i--) {
        const startHour = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours() - i, 1); // First day of the month
        const endHour = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours() - (i - 1)); // Last day of the month

        const formatDate = (date: Date) => date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

        const periodLabel = `${formatDate(startHour)} ${formatTime(startHour)} to ${formatTime(endHour)}`;


        const count = await (model as any).count({
            where: {
                createdAt: {
                    gte: startHour,
                    lt: endHour
                }
            }
        });

        last24HoursData.push({ hour: periodLabel, count });
    }

    console.log({ last24HoursData })
    return last24HoursData;
}

