import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const { selected_head, selected_class, selected_section, month_name } = req.query;
        // month related code
        const currentDate = new Date();
        const monthIndex = currentDate.getMonth();
        const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const currentMonthName = monthNames[monthIndex].toLowerCase();
        const startMonthIndex = monthNames.indexOf(month_name);

        const monthsToQuery = monthNames.slice(startMonthIndex, monthIndex + 1);

        const studentDueInfo = await prisma.studentFee.findMany({
          where: {
            fee: {
              fees_head_id: parseInt(selected_head),
              class_id: parseInt(selected_class),
              fees_month: {
                // @ts-ignore
                in: monthsToQuery
              }
            },
            student: {
              batches: {
                some: {
                  id: {
                    in: selected_section?.split(',').map(Number)
                  }
                }
              },
              // section_id: {
              //   in: selected_section?.split(',').map(Number)
              // }
            }
          },

          select: {
            on_time_discount: true,

            fee: {
              select: {
                amount: true,
                Discount: {
                  select: {
                    amt: true,
                    type: true
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
                batches:{
                  select:{
                    name:true
                  }
                },
                // section: {
                //   select: {
                //     name: true
                //   }
                // },
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
