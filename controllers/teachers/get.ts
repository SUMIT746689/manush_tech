import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';
import { refresh_token_varify } from 'utilities_api/jwtVerify';
// @ts-ignore
export const get = async (req, res) => {
  try {
    console.log('request domain__', req.headers.host);
    let query = {};

    if (!req.cookies.refresh_token) {
      query = {
        school: {
          domain: req.headers.host
        }
      };
    } else {
      // console.log("req.cookies.refresh_token___", req.cookies.refresh_token);

      const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

      if (!refresh_token || !refresh_token.school_id) throw new Error('invalid user');
      else
        query = {
          school_id: refresh_token.school_id
        };
    }

    const teachers = await prisma.teacher.findMany({
      where: {
        ...query,
        deleted_at: null
      },
      include: {
        teacherSalaries: {
          where: {
            deleted_at: {
              equals: null
            }
          },
          select: {
            class: {
              select: {
                name: true
              }
            },
            section: {
              select: {
                name: true
              }
            },
            id: true,
            subject: {
              select: {
                name: true,
                id: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            school_id: true,
            school: true
          }
        }
      }
    });

    res.status(200).json(teachers);
  } catch (err) {
    logFile.error(err.message);
    res.status(404).json({ error: err.message });
  }
};
