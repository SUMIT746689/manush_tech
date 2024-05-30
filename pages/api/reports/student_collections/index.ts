import prisma from '@/lib/prisma_client';
import dayjs from 'dayjs';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const { start_date, end_date, selected_class, selected_group, selected_section } = req.query;

        if (!start_date || !end_date || !selected_section) throw new Error("provide required information")

        // date formating code start
        let start_date_ = new Date(new Date(start_date).setHours(0, 0, 0, 0));
        let end_date_ = new Date(new Date(end_date).setHours(23, 59, 59, 999));
        
        // let hoursToSubtract = 6;
        // let new_start_date = subtractHours(start_date_, hoursToSubtract);
        // let new_end_date = subtractHours(end_date_, hoursToSubtract);
        // console.log({ start_date_, end_date_ });
        // date formating code end

        const groupWise = {};

        if (selected_group) {
          groupWise['group_id'] = { in: selected_group?.split(',').map(Number) };
        }

        // findount fees
        // const fetchStdFees = await prisma.studentFee.findMany({
        //   where: {
        //     student: {
        //       section_id: {
        //         in: selected_section?.split(',').map(Number)
        //       },
        //       ...groupWise
        //     },
        //     collection_date: {
        //       gte: start_date_,
        //       lte: end_date_
        //     }
        //   },
        //   include: {
        //     student: {
        //       include: {
        //         student_info: true,
        //         section: true,
        //         group: true
        //       }
        //     }
        //   }
        // });

        const fetchStdFees = await prisma.studentFee.findMany({
          where: {
            student: {
              section_id: {
                in: selected_section?.split(',').map(Number)
              },
              ...groupWise
            },
            collection_date: {
              gte: start_date_,
              lte: end_date_
            }
          },
          select: {
            total_payable: true,
            collected_amount: true,
            student: {
              select: {
                class_roll_no: true,
                student_info: {
                  select: {
                    student_id: true,
                    first_name: true,
                    middle_name: true,
                    last_name: true
                  }
                },
                section: {
                  select: {
                    name: true
                  }
                },
                group: {
                  select: {
                    title: true
                  }
                }
              }
            }
          }
        });

        res.status(200).json({
          status: true,
          result: fetchStdFees
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
