import { IAddress } from '@/interfaces/IAddress';
import { IAppointment } from '@/interfaces/IAppointment';
import { IMedicine } from '@/interfaces/IMedicine';

type IUnprocessedOrderItems = {
  items: {
    [key: string]: (IMedicine | IAppointment) & {
      quantity: number;
      type: 'appointment' | 'medicine';
    };
  };
};

export const changeOrderFormat = (
  unprocessedOrderItems: IUnprocessedOrderItems,
  address: IAddress,
) => {
  const result = {
    medicine: [] as { medicine_id: string; quantity: number }[],
    appointment: [] as {
      time_frame: { start_time: string; end_time: string };
      issue_id: string;
      address: {
        detail: string;
        lat: number;
        long: number;
      };
    }[],
    address: address,
  };
  Object.values(unprocessedOrderItems.items).forEach((orderItem) => {
    if (orderItem.type === 'medicine') {
      result[orderItem.type].push({
        medicine_id: orderItem.id,
        quantity: orderItem.quantity,
      });
    }
    // 2022-12-16T02:33:24Z
    // date.toISOString().split('T')[0]

    if (orderItem.type === 'appointment') {
      const appointment = orderItem as IAppointment;
      const serviceName = appointment.service_name || '';
      const lowerServiceName = serviceName.toLowerCase();
      const containsTwice = lowerServiceName.includes('twice');
      const containsThrice = lowerServiceName.includes('thrice');

      // Determine how many appointments per day and spacing between them
      const appointmentsPerDay = containsThrice ? 3 : containsTwice ? 2 : 1;
      const hoursBetweenAppointments = containsTwice ? 12 : 8;

      // Parse the date string and create Date objects with local date and time
      // appointment.time_frame.date is in format "Mon Dec 29 2024" from toDateString()
      // appointment.time_frame.start_time and end_time are in "HH:mm" format (local time)
      const dateObj = new Date(appointment.time_frame.date);
      const [startHour, startMinute] = appointment.time_frame.start_time
        .split(':')
        .map(Number);
      const [endHour, endMinute] = appointment.time_frame.end_time
        .split(':')
        .map(Number);

      // Create base start and end times for the first day
      const baseStartDate = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        startHour,
        startMinute,
        0,
      );
      const baseEndDate = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        endHour,
        endMinute,
        0,
      );

      // Create appointments for each day (quantity represents number of days)
      for (let day = 0; day < orderItem.quantity; day++) {
        // Calculate day offset in milliseconds
        const dayOffsetMs = day * 24 * 60 * 60 * 1000;

        // Create appointments for this day
        for (
          let appointmentIndex = 0;
          appointmentIndex < appointmentsPerDay;
          appointmentIndex++
        ) {
          // Calculate time offset for this appointment within the day
          const appointmentOffsetMs =
            appointmentIndex * hoursBetweenAppointments * 60 * 60 * 1000;

          // Create start and end times for this appointment
          const appointmentStartDate = new Date(
            baseStartDate.getTime() + dayOffsetMs + appointmentOffsetMs,
          );
          const appointmentEndDate = new Date(
            baseEndDate.getTime() + dayOffsetMs + appointmentOffsetMs,
          );

          result[orderItem.type].push({
            time_frame: {
              start_time: appointmentStartDate.toISOString(),
              end_time: appointmentEndDate.toISOString(),
            },
            issue_id: appointment.id,
            address: address,
          });
        }
      }
    }
  });
  return result;
};
