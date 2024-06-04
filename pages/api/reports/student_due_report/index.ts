import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const { month_name, selected_class, selected_group, selected_section, selected_student } = req.query;
        const where = {};
        if (selected_group) {
          where['group_id'] = {
            in: selected_group?.split(',').map(Number)
          };
        }
        const studentDueInfo = await prisma.studentFee.findMany({
          where: {
            fee: {
              fees_month: month_name.toLowerCase(),
              class_id: parseInt(selected_class)
            },
            student: {
              id: {
                in: selected_student?.split(',').map(Number)
              },
              section_id: {
                in: selected_section?.split(',').map(Number)
              },
              ...where
            }
          },

          select: {
            on_time_discount: true,
            fee: {
              select: {
                Discount: {
                  select: {
                    amt: true
                  }
                }
              }
            },

            total_payable: true,
            collected_amount: true,
            student: {
              select: {
                id: true,
                academic_year: {
                  select: {
                    title: true
                  }
                },
                class_roll_no: true,
                section: {
                  select: {
                    name: true
                  }
                },
                group: {
                  select: {
                    title: true
                  }
                },
                student_info: {
                  select: {
                    student_id: true,
                    first_name: true,
                    middle_name: true,
                    last_name: true
                  }
                }
              }
            }
          }
        });

        res.status(200).json({
          status: true,
          studentDueInfo
        });
        break;

      default:
        res.setHeader('Allow', ['GET']);
        logFile.error(`Method ${method} Not Allowed`);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    logFile.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export default index;
