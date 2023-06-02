import { useUserTimetableQuery } from 'queries';
import React, { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';
import CircularProgress from 'components/CircularProgress';
import { Scheduler } from '@aldabil/react-scheduler';
import { CellRenderedProps, ProcessedEvent, SchedulerProps } from '@aldabil/react-scheduler/types';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { WeekProps } from '@aldabil/react-scheduler/views/Week';

const defaultViewConfig: WeekProps = {
  startHour: 7,
  endHour: 17,
  weekStartOn: 1,
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  step: 60,
  cellRenderer: (props) => {
    return <Button sx={{ height: '100%' }} {...props} onClick={() => {}}></Button>;
  },
};

const schedulerConfig = {
  draggable: false,
  editable: false,
  deletable: false,
  week: defaultViewConfig,
  day: defaultViewConfig,
  hourFormat: '24',
} as unknown as Omit<SchedulerProps, 'events'>;

function Timetable() {
  const { data, isLoading } = useUserTimetableQuery();
  const theme = useTheme();

  if (isLoading) return <Scheduler events={[]} {...schedulerConfig} loading={isLoading} />;

  const events: ProcessedEvent[] = (data || [])!.map((d) => {
    const startDate = dayjs(d.startDateTime).toDate();
    const endDate = dayjs(d.endDateTime).toDate();
    return {
      event_id: d.id,
      title: `${d.title} - at ${d.location}`,
      start: startDate,
      end: endDate,
      color: theme.palette.primary.main,
    };
  });

  return (
    <Paper>
      <Scheduler events={events} {...schedulerConfig} />
    </Paper>
  );
}

export default Timetable;
