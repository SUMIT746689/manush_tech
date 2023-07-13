import { useEffect, useContext } from 'react';

import { ListSubheader, alpha, Box, List, styled } from '@mui/material';
import SidebarMenuItem from './item';
import menuItems, { MenuItem } from './items';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { AuthConsumer, AuthProvider } from '@/contexts/JWTAuthContext';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.Mui-active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.Mui-active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

const renderSidebarMenuItems = ({ permissions = [], items, path }: { permissions: any; items: MenuItem[]; path: string; }): JSX.Element => (
  <SubMenuWrapper>
    <List component="div">
      {items?.reduce(
        (ev, item) => reduceChildRoutes({ permissions, ev, item, path }),
        []
      )}
    </List>
  </SubMenuWrapper>
);

const reduceChildRoutes = ({ permissions, ev, path, item }: { permissions: any; ev: JSX.Element[]; path: string; item: MenuItem; }): Array<JSX.Element> => {

  const key = item.name;
  const partialMatch = path.includes(item.link);
  const exactMatch = path === item.link;
  console.log("permissions__", permissions, item);

  const sub_menu = () => {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={exactMatch}
        name={item.name}
        link={item.link}
        badge={item.badge}
        badgeTooltip={item.badgeTooltip}
        icon={item.icon}
      />
    );
  };
  if (item.items) {
    if (item.name === 'Academic') {
      if (permissions.includes('academic')) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
    else if (item.name === 'Teachers') {
      if (permissions.includes('teacher')) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
    else if (item.name === 'Accounts') {
      if (permissions.includes('accounts')) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
    else if (item.name === 'Attendence') {
      if (permissions.findIndex(i => i.group == 'attendence') > -1) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>

      );
      console.log("item__", item);

    }
    else if (item.name === 'Certificate') {
      if (permissions.findIndex(i => i.group == 'certificate') > -1) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
    else if (item.name === 'Bulk Sms And Email') {
      if (permissions.findIndex(i => i.group == 'bulk_sms_&_email') > -1) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
    else if (item.name === 'Result') {
      if (permissions.findIndex(i => i.group == 'result') > -1) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
    else if (item.name === 'Reports') {
      if (permissions.findIndex(i => i.group == 'report') > -1) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
    else if (item.name === 'System') {
      if (permissions.findIndex(i => i.group == 'package_request') > -1) ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
    else {
      ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
        >
          {/* @ts-ignore */}
          {renderSidebarMenuItems({
            permissions,
            path,
            items: item.items
          })}
        </SidebarMenuItem>
      );
    }
  } else {


    if (
      item.name === 'Sections' ||
      item.name === 'Subjects' ||
      item.name === 'Schools' ||
      item.name === 'Teachers' ||
      item.name === 'Students' ||
      item.name === 'Sessions' ||
      item.name === 'Period' ||
      item.name === 'Routine' ||
      item.name === 'Classes' ||
      item.name === 'Fees' ||
      item.name === 'Rooms' ||
      item.name === 'Grading system' ||
      item.name === 'Exam' ||
      item.name === 'CollectFee' ||
      item.name === 'Holidays' ||
      item.name === 'Result' ||
      item.name === 'Academic Years' ||
      item.name === 'Leave Application' ||
      item.name === 'Department' ||
      item.name === 'Department' ||
      item.name === 'Package' ||
      item.name === 'Front End' ||
      item.name === 'Pending Package' ||
      item.name === 'Users' ||
      item.name === 'Students Attendence' ||
      item.name === 'Exam Attendence' ||
      item.name === 'Employee Attendence'

    ) {
      // switch(item.name){
      //   case 'Sections':
      //     sub_menu();
      //     break;
      // }
      if (item.name === 'Sections' && permissions?.findIndex(i => i.group == 'section') > -1) sub_menu();
      if (item.name === 'Leave Application' && permissions?.findIndex(i => i.group == 'leave') > -1) sub_menu();
      if (item.name === 'Subjects' && permissions?.findIndex(i => i.group == 'subject') > -1) sub_menu();
      if (item.name === 'Schools' && permissions?.findIndex(i => i.group == 'school') > -1) sub_menu();
      if (item.name === 'Teachers' && permissions?.findIndex(i => i.group == 'teacher') > -1) sub_menu();
      if (item.name === 'Students' && permissions?.findIndex(i => i.group == 'student') > -1) sub_menu();
      if (item.name === 'Sessions' && permissions?.findIndex(i => i.group == 'session') > -1) sub_menu();
      if (item.name === 'Period' && permissions?.findIndex(i => i.group == 'period') > -1) sub_menu();
      if (item.name === 'Routine' && permissions?.findIndex(i => i.group == 'routine') > -1) sub_menu();
      if (item.name === 'Classes' && permissions?.findIndex(i => i.group == 'class') > -1) sub_menu();
      if (item.name === 'Fees' && permissions?.findIndex(i => i.group == 'fee') > -1) sub_menu();
      if (item.name === 'Rooms' && permissions?.findIndex(i => i.group == 'room') > -1) sub_menu();
      if (item.name === 'Grading system' && permissions?.findIndex(i => i.group == 'grade') > -1) sub_menu();
      if (item.name === 'Exam' && permissions?.findIndex(i => i.group == 'exam') > -1) sub_menu();
      if (item.name === 'CollectFee' && permissions?.findIndex(i => i.group == 'collect_fee') > -1) sub_menu();
      if (item.name === 'Holidays' && permissions?.findIndex(i => i.group == 'holiday') > -1) sub_menu();
      if (item.name === 'Result' && permissions?.findIndex(i => i.group == 'result') > -1) sub_menu();
      if (item.name === 'Academic Years' && permissions?.findIndex(i => i.group == 'academic_years') > -1) sub_menu();
      if (item.name === 'Department' && permissions?.findIndex(i => i.group == 'department') > -1) sub_menu();
      if (item.name === 'Users' && permissions?.findIndex(i => i.group == 'user') > -1) sub_menu();
      if (item.name === 'Package' && permissions?.findIndex(i => i.group == 'package') > -1) sub_menu();
      if (item.name === 'Front End' && permissions?.findIndex(i => i.group == 'front_end') > -1) sub_menu();
      if (item.name === 'Pending Package' && permissions?.findIndex(i => i.group == 'pending_package') > -1) sub_menu();
      
      if (item.name === 'Students Attendence' && permissions?.findIndex(i => i.value == 'create_student_attendence') > -1) sub_menu();
      if (item.name === 'Exam Attendence' && permissions?.findIndex(i => i.value == 'create_exam_attendence') > -1) sub_menu();
      if (item.name === 'Employee Attendence' && permissions?.findIndex(i => i.value == 'create_employee_attendence') > -1) sub_menu();
    }
    else sub_menu();
    // {
    // if (!permissions?.includes('create_admin')) sub_menu();
    // } else sub_menu();
  }

  return ev;
};

function SidebarMenu() {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }
  };

  useEffect(handlePathChange, [router.isReady, router.asPath]);

  return (
    <>
      <AuthConsumer>
        {({ user }) => {

          const permissions = [];
          if (user?.permissions?.length > 0) {
            user.permissions.map((permission: any) =>
              permissions.push(permission)
            );
          }
          return menuItems.map((section: any) => (
            <MenuWrapper key={section.heading}>
              <List
                component="div"
                subheader={
                  <ListSubheader component="div" disableSticky>
                    {t(section.heading)}
                  </ListSubheader>
                }
              >
                {renderSidebarMenuItems({
                  permissions: permissions,
                  items: section.items,
                  path: router.asPath
                })}
              </List>
            </MenuWrapper>
          ));
        }}
      </AuthConsumer>
    </>
  );
}

export default SidebarMenu;
