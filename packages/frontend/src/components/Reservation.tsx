import { API } from "aws-amplify";
import { useEffect, useRef, useState } from "react";
import { PickersDayProps } from "@mui/lab";
import { Badge } from "@mui/material";
import {
  DateCalendar,
  DayCalendarSkeleton,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickerSelectionState } from "@mui/x-date-pickers/internals";
import dayjs, { Dayjs } from "dayjs";
import { useAppContext } from "../lib/ContextLib";

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
function fetchReservations(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const dateFormat = date.format("YYYYMM");
    const queryStringParameters = {
      from: dateFormat + "01",
      to: dateFormat + "31",
    };
    API.get("obriy", `/apartments/42/reservations`, { queryStringParameters })
      .then((res: { Items: { reservationId: string }[] }) => {
        console.log(res);
        const daysToHighlight = res.Items.map(
          ({ reservationId }) => +reservationId.slice(-2)
        );
        resolve({ daysToHighlight });
      })
      .catch((err) => reject(err.response));

    signal.onabort = () => {
      reject(new DOMException("aborted", "AbortError"));
    };
  });
}

const initialValue = dayjs(Date.now());

function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) {
  const {
    highlightedDays = [],
    day,
    onDaySelect,
    outsideCurrentMonth,
    isFirstVisibleCell,
    isLastVisibleCell,
    ...other
  } = props;
  const isSelected = highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🌚" : undefined}
    >
      <PickersDay
        {...other}
        day={day}
        onDaySelect={onDaySelect}
        outsideCurrentMonth={outsideCurrentMonth}
        isFirstVisibleCell={isFirstVisibleCell}
        isLastVisibleCell={isLastVisibleCell}
      />
    </Badge>
  );
}

export default function Reservation() {
  const requestAbortController = useRef<AbortController | null>(null);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([1, 2, 15]);

  const fetchHighlightedDays = (date: Dayjs) => {
    const controller = new AbortController();
    fetchReservations(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  function handleDateChange(
    date: Dayjs,
    selectedState: PickerSelectionState | undefined
  ) {
    if (!isAuthenticated || selectedState !== "finish") return;

    const reserve = dayjs(date).format("YYYYMMDD");
    API.post("obriy", `/apartments/42/reservations/${reserve}`, {});
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onChange={handleDateChange}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          } as any,
        }}
        showDaysOutsideCurrentMonth
      />
    </LocalizationProvider>
  );
}
