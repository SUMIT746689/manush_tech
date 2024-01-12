import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';

type ReturnType = {
    isPermitted: boolean,
    // err: null | string
}
export const verifyPermissions = async (requiredPermissions: string[], refresh_token: any): Promise<ReturnType> => {
    try {

        const res = await prisma.user.findFirstOrThrow({
            where: {
                id: refresh_token?.id,
                username: refresh_token?.name,
                role: {
                    id: refresh_token?.role?.id,
                    // title: 'SUPER_ADMIN',
                },
                // permissions: {
                //     some:requiredPermissions
                // }
            },
            select: {
                user_role: {
                    select: {
                        permissions: {
                            where: {
                                value: {
                                    in: requiredPermissions
                                }
                            },
                            select: {
                                value: true
                            }
                        }
                    }
                },
                permissions: {
                    where: { value: { in: requiredPermissions } },
                    select: { value: true }
                }
            }
        })
        const permissions = [...res.user_role.permissions, ...res.permissions];

        if (permissions.length === 0) return { isPermitted: false };

        return { isPermitted: true }

    } catch (err) {
        logFile.error(err.message);
        return { isPermitted: false }
    }
}