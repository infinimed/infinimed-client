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

      // Determine how many appointments to create per quantity unit
      const appointmentCount = containsThrice ? 3 : containsTwice ? 2 : 1;

      // Create appointments for each quantity unit
      for (let q = 0; q < orderItem.quantity; q++) {
        // Calculate the base time offset for this quantity unit
        // Each quantity unit starts appointments 8 hours apart from the previous unit's last appointment
        const quantityOffsetHours = q * appointmentCount * 8;

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

        // Create Date objects with local date and time components
        const baseStartDateLocal = new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate(),
          startHour,
          startMinute,
          0,
        );
        const baseEndDateLocal = new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate(),
          endHour,
          endMinute,
          0,
        );

        // Create appointments for this quantity unit
        for (let i = 0; i < appointmentCount; i++) {
          // Clone the base dates to avoid mutating them
          const baseStartDate = new Date(baseStartDateLocal);
          const baseEndDate = new Date(baseEndDateLocal);

          // Calculate total hours to add: quantity offset + appointment offset within this quantity
          const totalHoursToAdd = quantityOffsetHours + i * 8;

          const appointmentStartDate = new Date(
            baseStartDate.getTime() + totalHoursToAdd * 60 * 60 * 1000,
          );
          const appointmentEndDate = new Date(
            baseEndDate.getTime() + totalHoursToAdd * 60 * 60 * 1000,
          );

          // toISOString() will include the correct date, automatically handling day changes
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
