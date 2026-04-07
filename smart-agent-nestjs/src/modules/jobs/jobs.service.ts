import { Injectable } from "@nestjs/common";

@Injectable()
export class JobsService {
  private timeToMinutes(time: string): number {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  }

  calculateAvailability(prof: any, now: Date): boolean {
    const daysMap = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const currentDay = daysMap[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayAvailability = prof.availabilities?.find(
      (a) => a.dayOfWeek === currentDay,
    );

    if (!todayAvailability) return false;

    const start = this.timeToMinutes(todayAvailability.startTime);
    const end = this.timeToMinutes(todayAvailability.endTime);

    const isWithinSchedule = currentTime >= start && currentTime <= end;

    if (!isWithinSchedule) return false;

    const isBusy = prof.appointments?.some((appt) => {
      if (appt.status !== "scheduled") return false;

      const nowDate = now.toISOString().split("T")[0];

      if (appt.date !== nowDate) return false;

      const start = this.timeToMinutes(appt.startTime);
      const end = this.timeToMinutes(appt.endTime);

      return currentTime >= start && currentTime <= end;
    });

    if (isBusy) return false;

    return true;
  }
}
