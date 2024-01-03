import prisma from "@/lib/prisma_client";
import { fileUpload } from "@/utils/upload";
import { unique_tracking_number } from "@/utils/utilitY-functions";
import { authenticate } from "middleware/authenticate";
import path from "path";
import { logFile } from "utilities_api/handleLogFile";

export const config = {
    api: {
        bodyParser: false,
    },
};
const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':
                const uploadFolderName = 'transaction';

                const fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                const filterFiles = {
                    attachment: fileType,
                }

                const { files, fields, error } = await fileUpload({ req, filterFiles, uploadFolderName });
                console.log({ files, fields });

                if (error) throw new Error('Error')
                const { account_id, voucher_id, payment_method_id, Ref,
                    transID, amount, created_at, description } = fields;

                const voucher = await prisma.voucher.findFirstOrThrow({
                    where: {
                        id: Number(voucher_id)
                    }
                })
                if (voucher.type !== 'debit') throw new Error('Only Expense voucher acceptable !')
                const account = await prisma.accounts.findFirstOrThrow({
                    where: {
                        id: Number(account_id)
                    },
                    include: {
                        payment_method: {
                            where: {
                                id: Number(payment_method_id)
                            }
                        }
                    }
                })
                // console.log("account__", account);

                const { attachment } = files
                await prisma.$transaction(async (trans) => {

                    const data = {
                        account_id: Number(account_id),
                        voucher_id: Number(voucher_id),
                        voucher_type: voucher.type,
                        voucher_name: voucher.title,
                        voucher_amount: voucher.amount,
                        transID,
                        amount: Number(amount),
                        created_at: new Date(created_at),
                        payment_method: account?.payment_method[0]?.title,
                        payment_method_id: Number(payment_method_id),
                        account_name: account.title,
                        acccount_number: account.account_number,
                        school_id: refresh_token?.school_id,
                        tracking_number: unique_tracking_number()
                    }
                    if (Ref) data['Ref'] = Ref
                    if (description) data['description'] = description
                    if (attachment) data['attachment'] = path.join(uploadFolderName, attachment?.newFilename)

                    const transaction_amount = Number(amount)

                    if (account.balance - transaction_amount < 0) throw new Error('Insufficient balance !')

                    await trans.transaction.create({
                        data
                    })
                    await trans.accounts.update({
                        where: {
                            id: Number(account_id)
                        },
                        data: {
                            balance: account.balance - transaction_amount
                        }
                    })
                })
                res.status(200).json({ message: 'Expense added successful !' })
                break;

            default:
                res.setHeader('Allow', ['POST']);
                logFile.error(`Method ${method} Not Allowed`)
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message)
        res.status(500).json({ message: err.message });

    }

}

export default authenticate(index) 