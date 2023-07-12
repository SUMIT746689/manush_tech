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
  //  console.log("permissions__",permissions);

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
      if (permissions.includes('attendence')) ev.push(
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
    else if (item.name === 'Certificate') {
      if (permissions.includes('certificate')) ev.push(
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
      if (permissions.includes('bulk_sms_&_email')) ev.push(
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
      if (permissions.includes('result')) ev.push(
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
      if (permissions.includes('report')) ev.push(
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
      if (permissions.includes('package_request')) ev.push(
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
      item.name === 'Pending Package'

    ) {
      // switch(item.name){
      //   case 'Sections':
      //     sub_menu();
      //     break;
      // }
      if (item.name === 'Sections' && permissions?.includes('section')) sub_menu();
      if (item.name === 'Leave Application' && permissions?.includes('leave')) sub_menu();
      if (item.name === 'Subjects' && permissions?.includes('subject')) sub_menu();
      if (item.name === 'Schools' && permissions?.includes('school')) sub_menu();
      if (item.name === 'Teachers' && permissions?.includes('teacher')) sub_menu();
      if (item.name === 'Students' && permissions?.includes('student')) sub_menu();
      if (item.name === 'Sessions' && permissions?.includes('session')) sub_menu();
      if (item.name === 'Period' && permissions?.includes('period')) sub_menu();
      if (item.name === 'Routine' && permissions?.includes('routine')) sub_menu();
      if (item.name === 'Classes' && permissions?.includes('class')) sub_menu();
      if (item.name === 'Fees' && permissions?.includes('fee')) sub_menu();
      if (item.name === 'Rooms' && permissions?.includes('room')) sub_menu();
      if (item.name === 'Grading system' && permissions?.includes('grade')) sub_menu();
      if (item.name === 'Exam' && permissions?.includes('exam')) sub_menu();
      if (item.name === 'CollectFee' && permissions?.includes('collect_fee')) sub_menu();
      if (item.name === 'Holidays' && permissions?.includes('holiday')) sub_menu();
      if (item.name === 'Result' && permissions?.includes('result')) sub_menu();
      if (item.name === 'Academic Years' && permissions?.includes('academic_years')) sub_menu();
      if (item.name === 'Department' && permissions?.includes('department')) sub_menu();
      // if (item.name === 'Certification' && permissions?.includes('certificate')) sub_menu();
      if (item.name === 'Package' && permissions?.includes('package')) sub_menu();
      if (item.name === 'Front End' && permissions?.includes('front_end')) sub_menu();
      if (item.name === 'Pending Package' && permissions?.includes('pending_package')) sub_menu();
    } else sub_menu();
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
          let permissions = [];
          if (user?.permissions?.length > 0) {
            user.permissions.map((permission: any) =>
              permissions.push(permission.group)
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
