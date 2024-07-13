import { useAuthUserQuery } from '@/redux/services/auth';
import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
  Badge,
} from '@mantine/core';
import { IconChevronRight, IconUserCircle } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.orange[0],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.orange[9],
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : "white",

    },
  },
  text: {
    opacity: 0.8,
  }
}));

export function NavFooter({...others }: UnstyledButtonProps) {

  const { classes } = useStyles();
  const { data: user } = useAuthUserQuery();

  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        {
          user?.photo ?
            <Avatar src={user?.photo} radius="xl" />
            :
            <Avatar color="orange" radius="sm">
              <IconUserCircle size="1.5rem" />
            </Avatar>
        }

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {[user?.fullName].join(' ')}
          </Text>
          <Badge>{user?.role}</Badge>

          <Text size="xs" className={classes.text}>
            {user?.email}
          </Text>
        </div>

        {/* {user?.icon ||  */}
        <IconChevronRight size="0.9rem" stroke={1.5} />
        {/* } */}
      </Group>
    </UnstyledButton>
  );
}
