import { Curriculum, CurriculumSyllabus, GroupSlot, GroupType, Syllabus } from '@types';
import CircularProgress from 'components/CircularProgress';
import HeaderRowTable from 'components/HeaderRowTable';
import { withGroupDetailLayout } from 'layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  useCourseGroupSlotsQuery,
  useGroupAcademicQuery,
  useGroupAcademicSyllabusQuery,
  useGroupDetailQuery,
} from 'queries';
import React, { startTransition, useMemo, useState } from 'react';
import { capitalizeAndOmitUnderscore } from 'utils';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import { useWindowValue } from 'hooks';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import Link from 'next/link';
import Table from 'components/Table';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Rows from 'components/Rows';
import dayjs from 'dayjs';

function AcademicPage() {
  const router = useRouter();
  const { gid } = router.query as { gid: string };
  const screenWidth = useWindowValue({ path: 'screen.width', initialValue: 1200 });
  const groupDetailQuery = useGroupDetailQuery(gid, { enabled: false });
  const groupAcademicQuery = useGroupAcademicQuery(gid);
  const groupAcademicSyllabusQuery = useGroupAcademicSyllabusQuery(gid);
  if (groupDetailQuery.isLoading || groupAcademicQuery.isLoading) return <CircularProgress />;

  return (
    <>
      <Head>
        <title>Academic | Group | FUniverse</title>
      </Head>
      <Box sx={{ px: 2, mx: 'auto' }}>
        {groupDetailQuery.data?.type === GroupType.Class && <ClassAcademic />}
        {groupDetailQuery.data?.type === GroupType.Course && <CourseAcademic />}
      </Box>
    </>
  );
}

export default withGroupDetailLayout(AcademicPage);
//////////////////////// Course//////////////////////////
const slotColumns: MRT_ColumnDef<GroupSlot>[] = [
  {
    header: 'No',
    accessorKey: 'no',
    enableHiding: false,
  },
  {
    header: 'Order',
    accessorKey: 'order',
  },
  {
    header: 'Room',
    accessorKey: 'room',
  },
  {
    header: 'Date',
    accessorKey: 'date',
    Cell: ({ cell, row }) => (
      <span>
        ({dayjs(cell.getValue<string>()).format('ddd')}) - {cell.getValue<string>()}
      </span>
    ),
  },
];

enum CourseAcademicTabs {
  Information,
  Slots,
}
const courseAcademicTabs = Object.keys(CourseAcademicTabs)
  //@ts-ignore
  .filter((uT) => isNaN(uT))
  .map((label) => ({ label }));
function CourseAcademic() {
  const [tabIndex, setTabIndex] = useState(CourseAcademicTabs.Information);
  const router = useRouter();
  const { gid } = router.query as { gid: string };
  const groupDetailQuery = useGroupDetailQuery(gid, { enabled: false });
  const groupAcademicQuery = useGroupAcademicQuery(gid);
  const groupSlotsQuery = useCourseGroupSlotsQuery(gid);
  function handleTabChange(event: unknown, value: number) {
    startTransition(() => {
      setTabIndex(value);
    });
  }
  return (
    <Box>
      <Tabs onChange={handleTabChange} value={tabIndex}>
        {courseAcademicTabs.map(({ label }) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      {tabIndex === CourseAcademicTabs.Information && (
        <Box sx={{ mb: 8, mt: 5 }}>
          <HeaderRowTable
            data={transfromSyllabusDetail(groupAcademicQuery.data as unknown as Syllabus)}
          />
        </Box>
      )}
      {tabIndex === CourseAcademicTabs.Slots && (
        <Table
          columns={slotColumns as any}
          //@ts-ignore
          data={groupSlotsQuery.data}
          state={{
            isLoading: groupSlotsQuery.isLoading,
            showAlertBanner: groupSlotsQuery.isError,
            showProgressBars: groupSlotsQuery.isFetching,
          }}
          //@ts-ignore
          getRowId={(originalRow: MRT_Row<CurriculumSyllabus>) =>
            (originalRow as any).syllabus?.id ?? originalRow.id
          }
        />
      )}
    </Box>
  );
}

////////////////// class /////////////////////////////
enum ClassAcademicTabs {
  Information,
  Plan,
}
const classAcademicTabs = Object.keys(ClassAcademicTabs)
  //@ts-ignore
  .filter((uT) => isNaN(uT))
  .map((label) => ({ label }));

const classPlanColumns: MRT_ColumnDef<CurriculumSyllabus>[] = [
  {
    header: 'Code',
    accessorKey: 'syllabus.code',
    Cell: ({ cell, row }) =>
      row.original.groupId ? (
        <MuiLink component={Link} href={`/groups/${row.original.groupId}`}>
          {cell.getValue<string>()}
        </MuiLink>
      ) : (
        <span>{cell.getValue<string>()}</span>
      ),
    enableHiding: false,
  },
  {
    header: 'Name',
    accessorKey: 'syllabus.name',
    enableHiding: false,
  },
  {
    header: 'Semester',
    accessorKey: 'semester',
  },
];
function ClassAcademic() {
  const [tabIndex, setTabIndex] = useState(ClassAcademicTabs.Information);
  const router = useRouter();
  const { gid } = router.query as { gid: string };
  const screenWidth = useWindowValue({ path: 'screen.width', initialValue: 1200 });

  const groupDetailQuery = useGroupDetailQuery(gid, { enabled: false });
  const groupAcademicQuery = useGroupAcademicQuery(gid);
  const groupAcademicSyllabusQuery = useGroupAcademicSyllabusQuery(gid);
  function handleTabChange(event: unknown, value: number) {
    startTransition(() => {
      setTabIndex(value);
    });
  }
  if (groupDetailQuery.isLoading || groupAcademicQuery.isLoading) return <CircularProgress />;
  return (
    <Box>
      <Tabs onChange={handleTabChange} value={tabIndex}>
        {classAcademicTabs.map(({ label }) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      {tabIndex === ClassAcademicTabs.Information && (
        <Box sx={{ mb: 8, mt: 5 }}>
          <HeaderRowTable data={transformAcademic(groupAcademicQuery.data as Curriculum)} />
        </Box>
      )}
      {tabIndex === ClassAcademicTabs.Plan && (
        <Table
          columns={classPlanColumns as any}
          //@ts-ignore
          data={groupAcademicSyllabusQuery.data}
          state={{
            isLoading: groupAcademicSyllabusQuery.isLoading,
            showAlertBanner: groupAcademicSyllabusQuery.isError,
            showProgressBars: groupAcademicSyllabusQuery.isFetching,
          }}
          //@ts-ignore
          getRowId={(originalRow: MRT_Row<CurriculumSyllabus>) =>
            (originalRow as any).syllabus?.id ?? originalRow.id
          }
        />
      )}
    </Box>
  );
}
function transformAcademic(data: Curriculum) {
  const formattedSeason = capitalizeAndOmitUnderscore(data.startedTerm.season.name);
  return {
    code: { label: 'Code', value: data.code },
    name: { label: 'Name', value: data.name },
    term: { label: 'Term', value: `${formattedSeason} ${data.startedTerm.year}` },
    noSemester: { label: 'Semester', value: `${data.noSemester}` },
    currentSemester: { label: 'Current Semester', value: data.currentSemester },
    schoolYear: { label: 'School Year', value: data.schoolYear },
    description: { label: 'Description', value: data.description },
  };
}
function transfromSyllabusDetail(data: Syllabus) {
  return {
    name: { label: 'Name', value: data.name },
    code: { label: 'Code', value: data.code },
    subjectName: { label: 'Subject Name', value: data.subject?.name },
    noCredit: { label: 'Credit', value: data.noCredit },
    noSlot: { label: 'Slot', value: data.noSlot },
    // duration: { label: 'Duration', value: data.duration },
    preRequisite: {
      label: 'Pre-Requisite',
      value: data.preRequisite ? data.preRequisite.map((s) => s.name).join(', ') : '',
    },
    description: { label: 'Description', value: data.description },
    minAvgMarkToPass: { label: 'Min Avg Mark To Pass', value: data.minAvgMarkToPass },
    active: { label: 'Active', value: `${data.active}` },
  };
}
